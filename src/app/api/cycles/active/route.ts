import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const activeCycle = await (prisma as any).scholarshipCycle.findFirst({
            where: {
                status: "Active",
                startDate: { lte: new Date() },
                endDate: { gte: new Date() }
            }
        });

        return NextResponse.json({ success: true, data: activeCycle });
    } catch (error: any) {
        console.error("Error fetching active cycle:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
