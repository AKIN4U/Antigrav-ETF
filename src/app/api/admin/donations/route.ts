import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET - Fetch donations
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year') || new Date().getFullYear().toString();
        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${year}-12-31`);

        const donations = await prisma.donation.findMany({
            where: {
                transaction: {
                    date: {
                        gte: startDate,
                        lte: endDate
                    }
                }
            },
            include: {
                transaction: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Calculate statistics
        const totalDonations = donations.reduce((sum, d) => sum + Number(d.transaction.amount), 0);
        const totalDonors = new Set(donations.map(d => d.donorEmail || d.donorName)).size;

        const typeBreakdown = donations.reduce((acc: any, d) => {
            acc[d.donationType] = (acc[d.donationType] || 0) + Number(d.transaction.amount);
            return acc;
        }, {});

        const purposeBreakdown = donations.reduce((acc: any, d) => {
            const purpose = d.purpose || 'General';
            acc[purpose] = (acc[purpose] || 0) + Number(d.transaction.amount);
            return acc;
        }, {});

        // Monthly trend
        const monthlyData = Array.from({ length: 12 }, (_, i) => {
            const month = i + 1;
            const monthDonations = donations.filter(d => {
                const donationMonth = new Date(d.transaction.date).getMonth() + 1;
                return donationMonth === month;
            });
            const total = monthDonations.reduce((sum, d) => sum + Number(d.transaction.amount), 0);
            return {
                month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
                amount: total,
                count: monthDonations.length
            };
        });

        // Top donors
        const donorStats = donations.reduce((acc: any, d) => {
            const key = d.isAnonymous ? 'Anonymous' : (d.donorEmail || d.donorName);
            if (!acc[key]) {
                acc[key] = { name: d.isAnonymous ? 'Anonymous' : d.donorName, amount: 0, count: 0 };
            }
            acc[key].amount += Number(d.transaction.amount);
            acc[key].count++;
            return acc;
        }, {});

        const topDonors = Object.values(donorStats)
            .sort((a: any, b: any) => b.amount - a.amount)
            .slice(0, 10);

        return NextResponse.json({
            success: true,
            data: {
                donations,
                summary: {
                    totalDonations,
                    totalDonors,
                    averageDonation: donations.length > 0 ? totalDonations / donations.length : 0,
                    receiptsIssued: donations.filter(d => d.receiptIssued).length
                },
                typeBreakdown,
                purposeBreakdown,
                monthlyData,
                topDonors
            }
        });
    } catch (error) {
        console.error("Error fetching donations:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch donations" }, { status: 500 });
    }
}

// POST - Create donation (creates both transaction and donation record)
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Create transaction first
        const transaction = await prisma.transaction.create({
            data: {
                type: 'Income',
                category: 'Donation',
                amount: new Prisma.Decimal(body.amount),
                description: `Donation from ${body.isAnonymous ? 'Anonymous' : body.donorName}`,
                reference: body.reference,
                date: new Date(body.date || new Date()),
                createdBy: body.createdBy
            }
        });

        // Create donation record
        const donation = await prisma.donation.create({
            data: {
                transactionId: transaction.id,
                donorName: body.donorName,
                donorEmail: body.donorEmail,
                donorPhone: body.donorPhone,
                donorAddress: body.donorAddress,
                donationType: body.donationType,
                isAnonymous: body.isAnonymous || false,
                purpose: body.purpose,
                receiptIssued: body.receiptIssued || false,
                receiptNumber: body.receiptNumber,
                notes: body.notes
            },
            include: {
                transaction: true
            }
        });

        return NextResponse.json({ success: true, data: donation });
    } catch (error) {
        console.error("Error creating donation:", error);
        return NextResponse.json({ success: false, error: "Failed to create donation" }, { status: 500 });
    }
}

// PATCH - Update donation (e.g., issue receipt)
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        const donation = await prisma.donation.update({
            where: { id },
            data: updateData,
            include: {
                transaction: true
            }
        });

        return NextResponse.json({ success: true, data: donation });
    } catch (error) {
        console.error("Error updating donation:", error);
        return NextResponse.json({ success: false, error: "Failed to update donation" }, { status: 500 });
    }
}
