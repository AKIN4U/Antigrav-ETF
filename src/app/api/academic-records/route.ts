import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.email) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const applicant = await prisma.applicant.findUnique({
            where: { email: user.email }
        });

        if (!applicant) {
            return NextResponse.json({ success: false, error: "Applicant not found" }, { status: 404 });
        }

        const records = await prisma.academicRecord.findMany({
            where: { applicantId: applicant.id },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ success: true, data: records });
    } catch (error) {
        console.error("Error fetching academic records:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.email) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { academicYear, semester, level, cgpaOrAverage, resultUrl, applicationId } = body;

        if (!academicYear || !level || !cgpaOrAverage || !resultUrl) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const applicant = await prisma.applicant.findUnique({
            where: { email: user.email }
        });

        if (!applicant) {
            return NextResponse.json({ success: false, error: "Applicant not found" }, { status: 404 });
        }

        const record = await prisma.academicRecord.create({
            data: {
                applicantId: applicant.id,
                applicationId,
                academicYear,
                semester,
                level,
                cgpaOrAverage,
                resultUrl,
                status: "Pending Review"
            }
        });

        return NextResponse.json({ success: true, data: record });
    } catch (error) {
        console.error("Error creating academic record:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
