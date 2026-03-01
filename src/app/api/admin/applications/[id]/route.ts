import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendStatusUpdateEmail } from "@/lib/email";
import { createAuditLog } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        const { data: application, error } = await (supabase as any)
            .from("Application")
            .select(`
                *,
                applicant:Applicant(
                    *,
                    familyInfo:FamilyInfo(*)
                )
            `)
            .eq("id", id)
            .single();

        if (error || !application) {
            console.error("Error fetching application:", error);
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

