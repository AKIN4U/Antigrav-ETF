import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const cycles = await (prisma as any).scholarshipCycle.findMany({
            orderBy: { startDate: 'desc' }
        });
        return NextResponse.json({ success: true, data: cycles });
    } catch (error: any) {
        console.error("Error fetching cycles:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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
        const { year, name, startDate, endDate, status, description } = body;

        const cycle = await (prisma as any).scholarshipCycle.create({
            data: {
                year: parseInt(year),
                name,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                status: status || "Draft",
                description
            }
        });

        return NextResponse.json({ success: true, data: cycle });
    } catch (error: any) {
        console.error("Error creating cycle:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
