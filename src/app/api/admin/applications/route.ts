import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const status = searchParams.get("status");
        const search = searchParams.get("search");

        const skip = (page - 1) * limit;

        const where: any = {};

        if (status && status !== "All") {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { applicant: { firstName: { contains: search, mode: "insensitive" } } },
                { applicant: { surname: { contains: search, mode: "insensitive" } } },
                { schoolName: { contains: search, mode: "insensitive" } },
            ];
        }

        const [total, applications] = await Promise.all([
            prisma.application.count({ where }),
            prisma.application.findMany({
                where,
                include: {
                    applicant: {
                        select: {
                            firstName: true,
                            surname: true,
                            email: true,
                            phone: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit,
            })
        ]);

        return NextResponse.json({
            success: true,
            data: applications,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Error fetching applications:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch applications" }, { status: 500 });
    }
}
