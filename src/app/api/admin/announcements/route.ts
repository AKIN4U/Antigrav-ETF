import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const announcements = await prisma.announcement.findMany({
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json({ success: true, data: announcements });
    } catch (error) {
        console.error("Error loading admin announcements:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch announcements" }, { status: 500 });
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
        const { title, content, status } = body;

        if (!title || !content) {
            return NextResponse.json({ success: false, error: "Title and Content are required fields" }, { status: 400 });
        }

        const announcement = await prisma.announcement.create({
            data: {
                title,
                content,
                status: status || "Draft"
            }
        });

        return NextResponse.json({ success: true, data: announcement });
    } catch (error) {
        console.error("Error creating announcement:", error);
        return NextResponse.json({ success: false, error: "Failed to create announcement" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { id, title, content, status } = body;

        if (!id) {
            return NextResponse.json({ success: false, error: "Announcement ID is required" }, { status: 400 });
        }

        const announcement = await prisma.announcement.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(content !== undefined && { content }),
                ...(status !== undefined && { status }),
            }
        });

        return NextResponse.json({ success: true, data: announcement });
    } catch (error) {
        console.error("Error updating announcement:", error);
        return NextResponse.json({ success: false, error: "Failed to update announcement" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, error: "Announcement ID is required" }, { status: 400 });
        }

        await prisma.announcement.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: "Announcement deleted successfully" });
    } catch (error) {
        console.error("Error deleting announcement:", error);
        return NextResponse.json({ success: false, error: "Failed to delete announcement" }, { status: 500 });
    }
}
