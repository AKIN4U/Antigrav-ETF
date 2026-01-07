import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
    try {
        const body = await request.text();
        const signature = request.headers.get("x-paystack-signature");

        if (!signature) {
            return new Response("No signature", { status: 400 });
        }

        // Verify signature
        const secret = process.env.PAYSTACK_SECRET_KEY;
        if (!secret) {
            console.error("PAYSTACK_SECRET_KEY is not defined");
            return new Response("Configuration error", { status: 500 });
        }

        const hash = crypto
            .createHmac("sha512", secret)
            .update(body)
            .digest("hex");

        if (hash !== signature) {
            return new Response("Invalid signature", { status: 401 });
        }

        const event = JSON.parse(body);

        // Handle successful charge
        if (event.event === "charge.success") {
            const data = event.data;
            const reference = data.reference;
            const amount = data.amount / 100; // Paystack amount is in kobo
            const customer = data.customer;
            const metadata = data.metadata || {};

            // Check if transaction already exists
            const existingDonation = await prisma.donation.findFirst({
                where: {
                    transaction: {
                        reference: reference
                    }
                }
            });

            if (existingDonation) {
                return NextResponse.json({ success: true, message: "Transaction already processed" });
            }

            // Create transaction and donation in a single transaction
            await prisma.$transaction(async (tx) => {
                const transaction = await tx.transaction.create({
                    data: {
                        type: "Income",
                        category: "Donation",
                        amount: new Prisma.Decimal(amount),
                        description: `Online Donation - Ref: ${reference}`,
                        reference: reference,
                        date: new Date(),
                    }
                });

                await tx.donation.create({
                    data: {
                        transactionId: transaction.id,
                        donorName: metadata.donorName || customer.first_name + " " + customer.last_name || "Unknown Donor",
                        donorEmail: customer.email,
                        donorPhone: customer.phone,
                        donationType: metadata.donationType || "One-time",
                        isAnonymous: metadata.isAnonymous === "true" || metadata.isAnonymous === true,
                        purpose: metadata.purpose || "General",
                        notes: `Paystack Payment Reference: ${reference}`
                    }
                });
            });

            console.log(`Successfully processed donation: ${reference}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Paystack webhook error:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
