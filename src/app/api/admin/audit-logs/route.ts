import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const supabase = await createClient();
        
        const { data: logs, error } = await supabase
            .from("AuditLog")
            .select("*")
            .order("createdAt", { ascending: false })
            .limit(100);

        if (error) throw error;

        return NextResponse.json({ success: true, data: logs });
    } catch (error) {
        console.error("Error fetching audit logs:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch audit logs" }, { status: 500 });
    }
}
