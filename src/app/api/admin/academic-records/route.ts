import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.email) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // Verify Admin role
        const { data: currentAdmin } = await supabase
            .from("AdminUser")
            .select("role")
            .eq("email", user.email)
            .single();

        if (!currentAdmin) {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        const records = await prisma.academicRecord.findMany({
            include: {
                applicant: {
                    select: {
                        firstName: true,
                        surname: true,
                        email: true
                    }
                }
            },
            orderBy: [
                { status: "asc" }, // Pending Review usually comes before Approved/Rejected alphabetically, but let's be careful
                { createdAt: "desc" }
            ]
        });

        return NextResponse.json({ success: true, data: records });
    } catch (error) {
        console.error("Error fetching academic records for admin:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
