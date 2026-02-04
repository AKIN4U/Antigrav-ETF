import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const logs = await prisma.auditLog.findMany({
            orderBy: {
                createdAt: "desc"
            },
            take: 100 // Limit to last 100 actions for now
        });

        return NextResponse.json({ success: true, data: logs });
    } catch (error) {
        console.error("Error fetching audit logs:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch audit logs" }, { status: 500 });
    }
}
