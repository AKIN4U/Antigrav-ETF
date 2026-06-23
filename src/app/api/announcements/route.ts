import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const announcements = await prisma.announcement.findMany({
            where: { status: "Published" },
            orderBy: { createdAt: "desc" }
        });

        // Set CORS headers so WordPress or other domains can fetch it
        const response = NextResponse.json({ success: true, data: announcements });
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "GET");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type");
        
        return response;
    } catch (error) {
        console.error("Error fetching public announcements:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch announcements" }, { status: 500 });
    }
}
