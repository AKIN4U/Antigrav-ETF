import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
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

        const body = await req.json();
        const { status, reviewerNotes } = body;

        if (!status) {
            return NextResponse.json({ success: false, error: "Missing status" }, { status: 400 });
        }

        const record = await prisma.academicRecord.update({
            where: { id },
            data: {
                status,
                reviewerNotes
            }
        });

        return NextResponse.json({ success: true, data: record });
    } catch (error) {
        console.error("Error updating academic record:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
