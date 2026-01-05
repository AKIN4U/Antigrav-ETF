import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // Find applicant by email
        const applicant = await prisma.applicant.findUnique({
            where: { email: session.user.email },
            include: {
                applications: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!applicant) {
            return NextResponse.json({ success: true, data: null });
        }

        return NextResponse.json({ success: true, data: applicant });
    } catch (error) {
        console.error("Error fetching user dashboard:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch dashboard data" }, { status: 500 });
    }
}
