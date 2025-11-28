"use client";

import { useState, useEffect } from "react";
import { Users, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalApplications: 0,
        pendingReview: 0,
        approvedScholars: 0,
        totalBeneficiaries: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch("/api/admin/stats");
                const result = await response.json();
                if (result.success) {
                    setStats(result.data);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-primary">Dashboard Overview</h1>
                <p className="text-muted-foreground">Welcome back, Committee Member.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Total Applications</h3>
                        <FileText className="h-5 w-5 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold">{stats.totalApplications}</p>
                    <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
                </div>

                <div className="bg-card p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Pending Review</h3>
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <p className="text-3xl font-bold">{stats.pendingReview}</p>
                    <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
                </div>

                <div className="bg-card p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Approved Scholars</h3>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold">{stats.approvedScholars}</p>
                    <p className="text-xs text-muted-foreground mt-1">For this session</p>
                </div>

                <div className="bg-card p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Total Beneficiaries</h3>
                        <Users className="h-5 w-5 text-purple-500" />
                    </div>
                    <p className="text-3xl font-bold">{stats.totalBeneficiaries}</p>
                    <p className="text-xs text-muted-foreground mt-1">Lifetime impact</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Applications</h3>
                    <div className="space-y-4">
                        <div className="text-center py-8 text-muted-foreground">
                            <Link href="/admin/applications" className="text-primary hover:underline">
                                View all applications
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-card border rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 border rounded-lg hover:bg-accent text-left transition-colors">
                            <span className="block font-medium">Generate Report</span>
                            <span className="text-xs text-muted-foreground">Download PDF summary</span>
                        </button>
                        <button className="p-4 border rounded-lg hover:bg-accent text-left transition-colors">
                            <span className="block font-medium">Review Pending</span>
                            <span className="text-xs text-muted-foreground">Go to screening</span>
                        </button>
                        <button className="p-4 border rounded-lg hover:bg-accent text-left transition-colors">
                            <span className="block font-medium">Disburse Funds</span>
                            <span className="text-xs text-muted-foreground">Process payments</span>
                        </button>
                        <button className="p-4 border rounded-lg hover:bg-accent text-left transition-colors">
                            <span className="block font-medium">Settings</span>
                            <span className="text-xs text-muted-foreground">System config</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
