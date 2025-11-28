import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Fetch all approved applications with disbursement info
        const applications = await prisma.application.findMany({
            where: {
                status: {
                    in: ["Approved", "Disbursed"]
                }
            },
            include: {
                applicant: {
                    select: {
                        firstName: true,
                        surname: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        return NextResponse.json({ success: true, data: applications });
    } catch (error) {
        console.error("Error fetching disbursements:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch disbursements" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { applicationId, voucherCode, paymentReference } = body;

        if (!applicationId || !voucherCode) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        // Update application with disbursement details
        const application = await prisma.application.update({
            where: { id: applicationId },
            data: {
                status: "Disbursed",
                voucherCode,
                paymentReference,
                disbursedDate: new Date(),
            }
        });

        return NextResponse.json({ success: true, data: application });
    } catch (error) {
        console.error("Error recording disbursement:", error);
        return NextResponse.json({ success: false, error: "Failed to record disbursement" }, { status: 500 });
    }
}
