import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search");

        const where: any = {};
        if (search) {
            where.OR = [
                { applicant: { surname: { contains: search, mode: "insensitive" } } },
                { applicant: { firstName: { contains: search, mode: "insensitive" } } },
                { institution: { contains: search, mode: "insensitive" } },
            ];
        }

        const alumni = await prisma.alumniProfile.findMany({
            where,
            include: {
                applicant: {
                    select: {
                        id: true,
                        firstName: true,
                        surname: true,
                        stateOrigin: true,
                    }
                }
            },
            orderBy: {
                graduationYear: "desc"
            }
        });

        return NextResponse.json({ success: true, data: alumni });
    } catch (error) {
        console.error("Error fetching alumni:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch alumni" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { applicantId, graduationYear, institution, degree, currentStatus, employer, jobTitle, linkedInUrl, successStory } = body;

        if (!applicantId || !graduationYear) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Check if exists
        const existing = await prisma.alumniProfile.findUnique({
            where: { applicantId }
        });

        let alumni;
        if (existing) {
            alumni = await prisma.alumniProfile.update({
                where: { applicantId },
                data: {
                    graduationYear: parseInt(graduationYear),
                    institution,
                    degree,
                    currentStatus,
                    employer,
                    jobTitle,
                    linkedInUrl,
                    successStory
                }
            });
        } else {
            alumni = await prisma.alumniProfile.create({
                data: {
                    applicantId,
                    graduationYear: parseInt(graduationYear),
                    institution,
                    degree,
                    currentStatus,
                    employer,
                    jobTitle,
                    linkedInUrl,
                    successStory
                }
            });
        }

        return NextResponse.json({ success: true, data: alumni });
    } catch (error) {
        console.error("Error saving alumni profile:", error);
        return NextResponse.json({ success: false, error: "Failed to save alumni profile" }, { status: 500 });
    }
}
