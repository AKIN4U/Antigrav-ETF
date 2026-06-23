import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getSetting, setSetting } from "@/lib/settings";

const DEFAULT_CEILINGS = {
    Primary: 30000,
    JSS: 50000,
    SSS: 50000,
    Tertiary: 60000
};

const DEFAULT_TEMPLATES = {
    applicant_received: {
        subject: "Application Received - Antigrav ETF",
        body: "Dear {name},\n\nWe have successfully received your scholarship application.\n\nApplication ID: {applicationId}\n\nOur committee will review your submission and verify your documents.\n\nBest regards,\nAntigrav ETF Team"
    },
    admin_new_application: {
        subject: "New Application: {applicantName}",
        body: "A new application has been submitted by {applicantName}.\n\nApplication ID: {applicationId}\n\nLink to view: {appUrl}/admin/applications/{applicationId}"
    },
    status_update: {
        subject: "Application Update - Antigrav ETF",
        body: "Dear {name},\n\nYour scholarship application status has been updated to: {status}.\n\nPlease log in to your dashboard for more details.\n\nBest regards,\nAntigrav ETF Team"
    }
};

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const ceilings = await getSetting("scholarship_ceilings", DEFAULT_CEILINGS);
        const emailTemplates = await getSetting("email_templates", DEFAULT_TEMPLATES);

        // Fetch active cycle details for deadline configuration
        const activeCycle = await (prisma as any).scholarshipCycle.findFirst({
            where: { status: "Active" }
        });

        return NextResponse.json({
            success: true,
            data: {
                ceilings,
                emailTemplates,
                activeCycle: activeCycle ? {
                    id: activeCycle.id,
                    name: activeCycle.name,
                    year: activeCycle.year,
                    startDate: activeCycle.startDate,
                    endDate: activeCycle.endDate,
                    status: activeCycle.status
                } : null
            }
        });
    } catch (error: any) {
        console.error("Error in settings GET:", error);
        return NextResponse.json({ success: false, error: error.message || "Failed to load settings" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { ceilings, emailTemplates, activeCycleDates } = body;

        if (ceilings) {
            await setSetting("scholarship_ceilings", ceilings);
        }

        if (emailTemplates) {
            await setSetting("email_templates", emailTemplates);
        }

        if (activeCycleDates) {
            const activeCycle = await (prisma as any).scholarshipCycle.findFirst({
                where: { status: "Active" }
            });

            if (activeCycle) {
                await (prisma as any).scholarshipCycle.update({
                    where: { id: activeCycle.id },
                    data: {
                        ...(activeCycleDates.startDate && { startDate: new Date(activeCycleDates.startDate) }),
                        ...(activeCycleDates.endDate && { endDate: new Date(activeCycleDates.endDate) })
                    }
                });
            } else {
                return NextResponse.json({
                    success: false,
                    error: "No active cycle found. Please activate a cycle in the Scholarship Cycles tab before updating dates."
                }, { status: 400 });
            }
        }

        return NextResponse.json({ success: true, message: "Settings updated successfully" });
    } catch (error: any) {
        console.error("Error in settings POST:", error);
        return NextResponse.json({ success: false, error: error.message || "Failed to save settings" }, { status: 500 });
    }
}
