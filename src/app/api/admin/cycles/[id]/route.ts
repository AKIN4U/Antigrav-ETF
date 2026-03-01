import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const body = await request.json();

        // Ensure only one cycle is active if status is switched to Active
        if (body.status === "Active") {
            await (prisma as any).scholarshipCycle.updateMany({
                where: { status: "Active", id: { not: id } },
                data: { status: "Completed" }
            });
        }

        const cycle = await (prisma as any).scholarshipCycle.update({
            where: { id },
            data: {
                ...body,
                startDate: body.startDate ? new Date(body.startDate) : undefined,
                endDate: body.endDate ? new Date(body.endDate) : undefined,
            }
        });

        return NextResponse.json({ success: true, data: cycle });
    } catch (error: any) {
        console.error("Error updating cycle:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        await (prisma as any).scholarshipCycle.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: "Cycle deleted" });
    } catch (error: any) {
        console.error("Error deleting cycle:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
