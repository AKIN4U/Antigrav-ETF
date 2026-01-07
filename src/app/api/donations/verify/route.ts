import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const reference = searchParams.get("reference");

        if (!reference) {
            return NextResponse.json({ success: false, error: "Reference is required" }, { status: 400 });
        }

        // 1. Check if it's already in our DB (webhook might have already processed it)
        const existingDonation = await prisma.donation.findFirst({
            where: {
                transaction: {
                    reference: reference
                }
            },
            include: {
                transaction: true
            }
        });

        if (existingDonation) {
            return NextResponse.json({ success: true, data: existingDonation, source: "database" });
        }

        // 2. If not in DB, verify with Paystack
        const secret = process.env.PAYSTACK_SECRET_KEY;
        if (!secret) {
            throw new Error("PAYSTACK_SECRET_KEY is not defined");
        }

        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${secret}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (result.status && result.data.status === "success") {
            const data = result.data;
            const amount = data.amount / 100;
            const metadata = data.metadata || {};

            // Double check existence to avoid race conditions with webhook
            const doubleCheck = await prisma.donation.findFirst({
                where: { transaction: { reference: reference } },
                include: { transaction: true }
            });

            if (doubleCheck) return NextResponse.json({ success: true, data: doubleCheck, source: "database_race" });

            // Create records
            const donation = await prisma.$transaction(async (tx) => {
                const transaction = await tx.transaction.create({
                    data: {
                        type: "Income",
                        category: "Donation",
                        amount: new Prisma.Decimal(amount),
                        description: `Online Donation (Verified) - Ref: ${reference}`,
                        reference: reference,
                        date: new Date(),
                    }
                });

                return await tx.donation.create({
                    data: {
                        transactionId: transaction.id,
                        donorName: metadata.donorName || data.customer.first_name + " " + data.customer.last_name || "Unknown Donor",
                        donorEmail: data.customer.email,
                        donorPhone: data.customer.phone,
                        donationType: metadata.donationType || "One-time",
                        isAnonymous: metadata.isAnonymous === "true" || metadata.isAnonymous === true,
                        purpose: metadata.purpose || "General",
                        notes: `Verified Paystack Payment: ${reference}`
                    },
                    include: {
                        transaction: true
                    }
                });
            });

            return NextResponse.json({ success: true, data: donation, source: "paystack_api" });
        }

        return NextResponse.json({ success: false, error: "Transaction not found or not successful" }, { status: 404 });
    } catch (error) {
        console.error("Transaction verification error:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
