import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendStatusUpdateEmail } from "@/lib/email";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const application = await prisma.application.findUnique({
            where: { id },
            include: {
                applicant: {
                    include: {
                        familyInfo: true
                    }
                }
            }
        });

        if (!application) {
            return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: application });
    } catch (error) {
        console.error("Error fetching application:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch application" }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Extract applicant info if present (for email) and remove from update data
        const { applicant, ...updateData } = body;

        // Ensure numeric fields are actually numbers if present
        if (updateData.scoreFinancial) updateData.scoreFinancial = parseInt(updateData.scoreFinancial);
        if (updateData.scoreAcademic) updateData.scoreAcademic = parseInt(updateData.scoreAcademic);
        if (updateData.scoreChurch) updateData.scoreChurch = parseInt(updateData.scoreChurch);

        const updatedApplication = await prisma.application.update({
            where: { id },
            data: updateData,
            include: {
                applicant: true
            }
        });

        // Send email if status changed and we have an email
        if (updateData.status && updatedApplication.applicant?.email) {
            await sendStatusUpdateEmail(
                updatedApplication.applicant.email,
                updatedApplication.applicant.firstName,
                updateData.status
            );
        }

        return NextResponse.json({ success: true, data: updatedApplication });
    } catch (error) {
        console.error("Error updating application:", error);
        return NextResponse.json({ success: false, error: "Failed to update application" }, { status: 500 });
    }
}
