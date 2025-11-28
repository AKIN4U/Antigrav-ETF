import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year') || new Date().getFullYear().toString();

        // Get all applications for the year
        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${year}-12-31`);

        const applications = await prisma.application.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                applicant: {
                    select: {
                        firstName: true,
                        surname: true,
                        sex: true,
                        stateOrigin: true,
                    }
                }
            }
        });

        // Calculate statistics
        const totalApplications = applications.length;
        const statusBreakdown = applications.reduce((acc: any, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {});

        const genderBreakdown = applications.reduce((acc: any, app) => {
            const gender = app.applicant.sex || 'Unknown';
            acc[gender] = (acc[gender] || 0) + 1;
            return acc;
        }, {});

        const levelBreakdown = applications.reduce((acc: any, app) => {
            const level = app.presentClass?.includes('Primary') ? 'Primary' :
                app.presentClass?.includes('JSS') || app.presentClass?.includes('SSS') ? 'Secondary' :
                    'Tertiary';
            acc[level] = (acc[level] || 0) + 1;
            return acc;
        }, {});

        // Calculate monthly trends
        const monthlyData = Array.from({ length: 12 }, (_, i) => {
            const month = i + 1;
            const count = applications.filter(app => {
                const appMonth = new Date(app.createdAt).getMonth() + 1;
                return appMonth === month;
            }).length;
            return {
                month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
                applications: count
            };
        });

        // Calculate financial data
        const totalDisbursed = applications
            .filter(app => app.status === 'Disbursed' && app.approvedAmount)
            .reduce((sum, app) => sum + parseFloat(app.approvedAmount || '0'), 0);

        const totalApproved = applications
            .filter(app => (app.status === 'Approved' || app.status === 'Disbursed') && app.approvedAmount)
            .reduce((sum, app) => sum + parseFloat(app.approvedAmount || '0'), 0);

        const averageAmount = totalApproved / applications.filter(app => app.approvedAmount).length || 0;

        // Top schools
        const schoolStats = applications.reduce((acc: any, app) => {
            const school = app.schoolName;
            if (!acc[school]) {
                acc[school] = { count: 0, amount: 0 };
            }
            acc[school].count++;
            if (app.approvedAmount) {
                acc[school].amount += parseFloat(app.approvedAmount);
            }
            return acc;
        }, {});

        const topSchools = Object.entries(schoolStats)
            .map(([name, data]: [string, any]) => ({ name, ...data }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        return NextResponse.json({
            success: true,
            data: {
                summary: {
                    totalApplications,
                    totalDisbursed,
                    totalApproved,
                    averageAmount,
                    approvalRate: ((statusBreakdown['Approved'] || 0) + (statusBreakdown['Disbursed'] || 0)) / totalApplications * 100 || 0
                },
                statusBreakdown,
                genderBreakdown,
                levelBreakdown,
                monthlyData,
                topSchools
            }
        });
    } catch (error) {
        console.error("Error generating report:", error);
        return NextResponse.json({ success: false, error: "Failed to generate report" }, { status: 500 });
    }
}
