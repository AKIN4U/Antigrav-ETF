import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const status = searchParams.get("status");
        const search = searchParams.get("search");

        const supabase = await createClient();

        console.log("Fetching applications from DEBUG route:", { page, limit, status, search });

        const skip = (page - 1) * limit;

        let query = supabase
            .from("Application")
            .select(`
                *,
                applicant:Applicant(
                    *,
                    familyInfo:FamilyInfo(*)
                )
            `, { count: "exact" });

        if (status && status !== "All") {
            query = query.eq("status", status);
        }

        if (search) {
            query = query.or(`schoolName.ilike.%${search}%,applicant.firstName.ilike.%${search}%,applicant.surname.ilike.%${search}%`);
        }

        const { data, count, error } = await query
            .order("createdAt", { ascending: false })
            .range(skip, skip + limit - 1);

        if (error) {
            console.error("Supabase query error:", error);
            throw error;
        }

        const total = count || 0;
        console.log(`DEBUG: Found ${data?.length || 0} applications out of ${total} total`);

        return NextResponse.json({
            success: true,
            data: data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        console.error("Error fetching applications in DEBUG route:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
