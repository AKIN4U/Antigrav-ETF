import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { sendStatusUpdateEmail } from "@/lib/email";
import { createAuditLog } from "@/lib/audit";

export const dynamic = "force-dynamic";

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

        // Find potential duplicates
        const applicant = application.applicant;
        const familyInfo = applicant?.familyInfo;
        const orConditions: any[] = [];

        if (familyInfo) {
            if (familyInfo.fatherPhone) orConditions.push({ applicant: { familyInfo: { fatherPhone: familyInfo.fatherPhone } } });
            if (familyInfo.motherPhone) orConditions.push({ applicant: { familyInfo: { motherPhone: familyInfo.motherPhone } } });
            if (familyInfo.fatherSurname && familyInfo.fatherFirstName) {
                orConditions.push({ applicant: { familyInfo: { fatherSurname: familyInfo.fatherSurname, fatherFirstName: familyInfo.fatherFirstName } } });
            }
            if (familyInfo.motherSurname && familyInfo.motherFirstName) {
                orConditions.push({ applicant: { familyInfo: { motherSurname: familyInfo.motherSurname, motherFirstName: familyInfo.motherFirstName } } });
            }
        }

        if (applicant) {
            orConditions.push({ applicant: { surname: applicant.surname, firstName: applicant.firstName, dob: applicant.dob } });
            if (applicant.phone) orConditions.push({ applicant: { phone: applicant.phone } });
        }

        let duplicates: any[] = [];
        if (orConditions.length > 0) {
            duplicates = await prisma.application.findMany({
                where: {
                    id: { not: id },
                    cycleId: application.cycleId,
                    OR: orConditions
                },
                include: {
                    applicant: true
                }
            });
        }

        return NextResponse.json({ 
            success: true, 
            data: { 
                ...application, 
                duplicates 
            } 
        });
    } catch (error) {
        console.error("Error fetching application:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch application" }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const supabase = await createClient();

        // Extract applicant info if present (for email) and remove from update data
        const { applicant, ...updateData } = body;

        // Ensure numeric fields are actually numbers if present
        const fieldsToParse = ['scoreFinancial', 'scoreAcademic', 'scoreChurch'];
        fieldsToParse.forEach(field => {
            if (updateData[field] !== undefined && updateData[field] !== null) {
                updateData[field] = parseInt(updateData[field]);
            }
        });

        // Get current status for comparison (optional but good for logs)
        // For now, we trust the update.

        const { data: updatedApplication, error } = await (supabase as any)
            .from("Application")
            .update(updateData)
            .eq("id", id)
            .select(`
                *,
                applicant:Applicant(*)
            `)
            .single();

        if (error) {
            console.error("Error updating application:", error);
            throw error;
        }

        // Send email if status changed
        if (updateData.status && updatedApplication.applicant?.email) {
            await sendStatusUpdateEmail(
                updatedApplication.applicant.email,
                updatedApplication.applicant.firstName,
                updateData.status
            );
        }

        // AUDIT LOG
        if (updateData.status) {
            const { data: { user } } = await supabase.auth.getUser();
            await createAuditLog({
                action: updateData.status === 'Approved' ? 'APPROVE_APPLICATION' :
                    updateData.status === 'Rejected' ? 'REJECT_APPLICATION' :
                        'UPDATE_STATUS',
                details: `Application ${id} status changed to ${updateData.status}`,
                userId: user?.id,
                userEmail: user?.email
            });
        }

        return NextResponse.json({ success: true, data: updatedApplication });
    } catch (error) {
        console.error("Error updating application:", error);
        return NextResponse.json({ success: false, error: "Failed to update application" }, { status: 500 });
    }
}

