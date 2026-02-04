import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const supabase = await createClient();

        // Parallelize data fetching
        const [
            { data: applicants },
            { data: applications },
            { data: disbursements }
        ] = await Promise.all([
            // 1. Applicants for Demographics
            supabase.from("Applicant").select("sex, stateOrigin, lga"),

            // 2. Applications for Status & Trends
            supabase.from("Application").select("id, status, approvedAmount, createdAt"),

            // 3. Transactions/Disbursements (using generic Transaction table joined with Budget/Donation if needed, or simplistically just Application.approvedAmount for now)
            // For simplicity in this iteration, we will rely on Application.approvedAmount where status='Disbursed'
            Promise.resolve({ data: [] }) // Placeholder if we need separate transaction table later
        ]);

        if (!applicants || !applications) {
            throw new Error("Failed to fetch data");
        }

        // --- Aggregation Logic ---

        // 1. Gender Distribution
        const genderCounts: Record<string, number> = {};
        applicants.forEach(app => {
            const sex = app.sex || "Not Specified";
            genderCounts[sex] = (genderCounts[sex] || 0) + 1;
        });
        const genderData = Object.entries(genderCounts).map(([name, value]) => ({ name, value }));

        // 2. State Distribution (Top 10)
        const stateCounts: Record<string, number> = {};
        applicants.forEach(app => {
            const state = app.stateOrigin || "Unknown";
            stateCounts[state] = (stateCounts[state] || 0) + 1;
        });
        const stateData = Object.entries(stateCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);

        // 3. Application Status Distribution
        const statusCounts: Record<string, number> = {};
        applications.forEach(app => {
            const status = app.status || "Unknown";
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });
        const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

        // 4. Financial Overview
        // Calculate total approved vs disbursed
        const totalApproved = applications
            .filter(app => app.status === 'Approved' || app.status === 'Disbursed')
            .reduce((sum, app) => sum + (parseFloat(app.approvedAmount || "0") || 0), 0);

        const totalDisbursed = applications
            .filter(app => app.status === 'Disbursed')
            .reduce((sum, app) => sum + (parseFloat(app.approvedAmount || "0") || 0), 0);

        const financialData = [
            { name: "Approved (Pending)", value: totalApproved - totalDisbursed },
            { name: "Disbursed", value: totalDisbursed }
        ];

        // 5. Monthly Trends (Last 6 Months)
        const months: Record<string, number> = {};
        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = d.toLocaleString('default', { month: 'short' });
            months[key] = 0;
        }

        applications.forEach(app => {
            const d = new Date(app.createdAt);
            const key = d.toLocaleString('default', { month: 'short' });
            if (months.hasOwnProperty(key)) {
                months[key]++;
            }
        });
        const trendData = Object.entries(months).map(([name, value]) => ({ name, value }));

        return NextResponse.json({
            success: true,
            data: {
                genderData,
                stateData,
                statusData,
                financialData,
                trendData,
                metrics: {
                    totalApplicants: applicants.length,
                    totalApplications: applications.length,
                    approvalRate: Math.round((applications.filter(a => a.status === 'Approved' || a.status === 'Disbursed').length / applications.length) * 100) || 0,
                }
            }
        });

    } catch (error: any) {
        console.error("Error fetching analytics:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
