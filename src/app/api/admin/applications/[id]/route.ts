import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const body = await request.json();

        // Ensure numeric fields are actually numbers if present
        if (body.scoreFinancial) body.scoreFinancial = parseInt(body.scoreFinancial);
        if (body.scoreAcademic) body.scoreAcademic = parseInt(body.scoreAcademic);
        if (body.scoreChurch) body.scoreChurch = parseInt(body.scoreChurch);

        const updatedApplication = await prisma.application.update({
            where: { id },
            data: body,
        });

        return NextResponse.json({ success: true, data: updatedApplication });
    } catch (error) {
        console.error("Error updating application:", error);
        return NextResponse.json({ success: false, error: "Failed to update application" }, { status: 500 });
    }
}
