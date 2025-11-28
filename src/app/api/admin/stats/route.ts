import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const totalApplications = await prisma.application.count();
        const pendingReview = await prisma.application.count({
            where: { status: "Pending" }
        });
        const approvedScholars = await prisma.application.count({
            where: { status: "Approved" }
        });
        // For beneficiaries, we might count unique applicants with approved applications
        const totalBeneficiaries = await prisma.applicant.count({
            where: {
                applications: {
                    some: {
                        status: "Approved"
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                totalApplications,
                pendingReview,
                approvedScholars,
                totalBeneficiaries
            }
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 });
    }
}
