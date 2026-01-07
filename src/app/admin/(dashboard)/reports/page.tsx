"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, DollarSign, Download, Calendar, PieChart } from "lucide-react";
import { ReportResponse, ApiResponse } from "@/types";

export default function ReportsPage() {
    const [reportData, setReportData] = useState<ReportResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

    useEffect(() => {
        fetchReport();
    }, [selectedYear]);

    const fetchReport = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/admin/reports?year=${selectedYear}`);
            const result: ApiResponse<ReportResponse> = await response.json();
            if (result.success && result.data) {
                setReportData(result.data);
            }
        } catch (error) {
            console.error("Error fetching report:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportPDF = () => {
        setIsLoading(true);
        // Simulate PDF generation
        setTimeout(() => {
            setIsLoading(false);
            alert("Report generated successfully! In a production environment, this would download the PDF summary for " + selectedYear);
        }, 1500);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-muted-foreground">Loading reports...</div>
            </div>
        );
    }

    if (!reportData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-muted-foreground">No data available</div>
            </div>
        );
    }

    const { summary, statusBreakdown, genderBreakdown, levelBreakdown, monthlyData, topSchools } = reportData;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
                    <p className="text-muted-foreground">Comprehensive insights and statistics</p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="px-4 py-2 border border-input bg-background rounded-md text-sm font-medium"
                    >
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleExportPDF}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-4">
                <div className="relative p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <Users className="h-8 w-8 opacity-80" />
                            <TrendingUp className="h-5 w-5 opacity-60" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{summary.totalApplications}</div>
                        <div className="text-sm opacity-90">Total Applications</div>
                    </div>
                </div>

                <div className="relative p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <DollarSign className="h-8 w-8 opacity-80" />
                            <TrendingUp className="h-5 w-5 opacity-60" />
                        </div>
                        <div className="text-3xl font-bold mb-1">₦{summary.totalDisbursed.toLocaleString()}</div>
                        <div className="text-sm opacity-90">Total Disbursed</div>
                    </div>
                </div>

                <div className="relative p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <BarChart3 className="h-8 w-8 opacity-80" />
                            <TrendingUp className="h-5 w-5 opacity-60" />
                        </div>
                        <div className="text-3xl font-bold mb-1">₦{Math.round(summary.averageAmount).toLocaleString()}</div>
                        <div className="text-sm opacity-90">Average Amount</div>
                    </div>
                </div>

                <div className="relative p-6 bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <PieChart className="h-8 w-8 opacity-80" />
                            <TrendingUp className="h-5 w-5 opacity-60" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{summary.approvalRate.toFixed(1)}%</div>
                        <div className="text-sm opacity-90">Approval Rate</div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Status Breakdown */}
                <div className="bg-card border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-primary" />
                        Application Status
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(statusBreakdown).map(([status, count]) => {
                            const percentage = (count / summary.totalApplications) * 100;
                            const colors: Record<string, string> = {
                                'Pending': 'bg-yellow-500',
                                'Under Review': 'bg-blue-500',
                                'Approved': 'bg-green-500',
                                'Disbursed': 'bg-emerald-500',
                                'Rejected': 'bg-red-500'
                            };
                            return (
                                <div key={status}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium">{status}</span>
                                        <span className="text-muted-foreground">{count} ({percentage.toFixed(1)}%)</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${colors[status] || 'bg-gray-500'} transition-all duration-500`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Gender Breakdown */}
                <div className="bg-card border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Gender Distribution
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(genderBreakdown).map(([gender, count]) => {
                            const percentage = (count / summary.totalApplications) * 100;
                            const colors: Record<string, string> = {
                                'Male': 'bg-blue-500',
                                'Female': 'bg-pink-500',
                                'Unknown': 'bg-gray-500'
                            };
                            return (
                                <div key={gender}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium">{gender}</span>
                                        <span className="text-muted-foreground">{count} ({percentage.toFixed(1)}%)</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${colors[gender] || 'bg-gray-500'} transition-all duration-500`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Education Level */}
                <div className="bg-card border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Education Level
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(levelBreakdown).map(([level, count]) => {
                            const percentage = (count / summary.totalApplications) * 100;
                            const colors: Record<string, string> = {
                                'Primary': 'bg-green-500',
                                'Secondary': 'bg-blue-500',
                                'Tertiary': 'bg-purple-500'
                            };
                            return (
                                <div key={level}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium">{level}</span>
                                        <span className="text-muted-foreground">{count} ({percentage.toFixed(1)}%)</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${colors[level] || 'bg-gray-500'} transition-all duration-500`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Monthly Trend */}
                <div className="bg-card border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Monthly Applications
                    </h3>
                    <div className="space-y-3">
                        {monthlyData.map((data) => {
                            const maxCount = Math.max(...monthlyData.map((d) => d.applications));
                            const percentage = maxCount > 0 ? (data.applications / maxCount) * 100 : 0;
                            return (
                                <div key={data.month} className="flex items-center gap-3">
                                    <div className="w-12 text-sm font-medium text-muted-foreground">{data.month}</div>
                                    <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-end pr-2 text-white text-xs font-semibold transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        >
                                            {data.applications > 0 && data.applications}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Top Schools Table */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6">Top 10 Schools by Applications</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">#</th>
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">School Name</th>
                                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Applications</th>
                                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topSchools.map((school, index) => (
                                <tr key={school.name} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                    <td className="py-3 px-4 font-medium">{index + 1}</td>
                                    <td className="py-3 px-4">{school.name}</td>
                                    <td className="py-3 px-4 text-right font-semibold">{school.count}</td>
                                    <td className="py-3 px-4 text-right font-semibold text-green-600">
                                        ₦{school.amount.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
