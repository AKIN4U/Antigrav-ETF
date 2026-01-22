import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const supabase = await createClient();

        // Parallelize count queries for performance
        const [
            { count: totalApplications },
            { count: pendingReview },
            { count: approvedScholars },
            { data: approvedApps },
            { data: recentApplications }
        ] = await Promise.all([
            // 1. Total Applications
            supabase.from("Application").select("*", { count: "exact", head: true }),

            // 2. Pending Review
            supabase.from("Application").select("*", { count: "exact", head: true }).eq("status", "Pending"),

            // 3. Approved Scholars
            supabase.from("Application").select("*", { count: "exact", head: true }).eq("status", "Approved"),

            // 4. For beneficiaries (unique applicants with approved applications)
            supabase.from("Application").select("applicantId").eq("status", "Approved"),

            // 5. Recent Applications
            supabase.from("Application")
                .select(`
                    *,
                    applicant:Applicant(
                        firstName,
                        surname
                    )
                `)
                .order("createdAt", { ascending: false })
                .limit(5)
        ]);

        // Calculate unique beneficiaries
        const uniqueBeneficiaries = new Set(approvedApps?.map(app => app.applicantId) || []);
        const totalBeneficiaries = uniqueBeneficiaries.size;

        return NextResponse.json({
            success: true,
            data: {
                totalApplications: totalApplications || 0,
                pendingReview: pendingReview || 0,
                approvedScholars: approvedScholars || 0,
                totalBeneficiaries: totalBeneficiaries || 0,
                recentApplications: recentApplications || []
            }
        });
    } catch (error: any) {
        console.error("Error fetching stats:", error);
        return NextResponse.json({ success: false, error: error.message || "Failed to fetch stats" }, { status: 500 });
    }
}
