"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { Users, FileText, CheckCircle, AlertCircle, Loader2, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<{
        totalApplications: number;
        pendingReview: number;
        approvedScholars: number;
        totalBeneficiaries: number;
        recentApplications: any[];
    }>({
        totalApplications: 0,
        pendingReview: 0,
        approvedScholars: 0,
        totalBeneficiaries: 0,
        recentApplications: [],
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
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Dashboard Overview</h1>
                    <p className="text-muted-foreground">Welcome back, Committee Member.</p>
                </div>
                <div className="text-sm text-muted-foreground bg-accent/30 px-3 py-1 rounded-full">
                    Last updated: {new Date().toLocaleDateString()}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link href="/admin/applications" className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all hover:border-primary/50 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <FileText className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground">Total Applications</h3>
                    </div>
                    <p className="text-3xl font-bold">{stats.totalApplications}</p>
                    <div className="flex items-center gap-1 text-xs text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        View all <ArrowRight className="h-3 w-3" />
                    </div>
                </Link>

                <Link href="/admin/applications?status=Pending" className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all hover:border-yellow-500/50 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg group-hover:bg-yellow-600 group-hover:text-white transition-colors">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground">Pending Review</h3>
                    </div>
                    <p className="text-3xl font-bold">{stats.pendingReview}</p>
                    <div className="flex items-center gap-1 text-xs text-yellow-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        Review now <ArrowRight className="h-3 w-3" />
                    </div>
                </Link>

                <Link href="/admin/applications?status=Approved" className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all hover:border-green-500/50 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground">Approved Scholars</h3>
                    </div>
                    <p className="text-3xl font-bold">{stats.approvedScholars}</p>
                    <div className="flex items-center gap-1 text-xs text-green-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        Details <ArrowRight className="h-3 w-3" />
                    </div>
                </Link>

                <Link href="/admin/users" className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all hover:border-purple-500/50 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <Users className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground">Total Beneficiaries</h3>
                    </div>
                    <p className="text-3xl font-bold">{stats.totalBeneficiaries}</p>
                    <div className="flex items-center gap-1 text-xs text-purple-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        View list <ArrowRight className="h-3 w-3" />
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card border rounded-2xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b">
                        <h3 className="text-lg font-semibold">Recent Applications</h3>
                    </div>
                    <div className="flex-1">
                        {stats.recentApplications.length > 0 ? (
                            <div className="divide-y">
                                {stats.recentApplications.map((app) => (
                                    <Link
                                        key={app.id}
                                        href={`/admin/applications/${app.id}`}
                                        className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                {app.applicant.surname[0]}{app.applicant.firstName[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                                                    {app.applicant.surname} {app.applicant.firstName}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {app.level} Scholar • {new Date(app.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                            app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {app.status}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto opacity-20 mb-4" />
                                <p>No recent applications found</p>
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-muted/30 border-t text-center">
                        <Link href="/admin/applications" className="text-xs text-primary font-medium hover:underline flex items-center justify-center gap-1">
                            View all applications <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                </div>

                <div className="bg-card border rounded-2xl shadow-sm p-6 overflow-hidden">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Quick Actions</h3>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">One-click access</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => router.push("/admin/reports")}
                            className="p-5 border rounded-xl hover:bg-accent text-left transition-all hover:border-primary/30 group bg-muted/5 hover:bg-white"
                        >
                            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <ArrowRight className="h-4 w-4" />
                            </div>
                            <span className="block font-semibold group-hover:text-primary transition-colors">Generate Report</span>
                            <span className="text-xs text-muted-foreground mt-1 block">Download PDF summary</span>
                        </button>
                        <button
                            onClick={() => router.push("/admin/applications?status=Pending")}
                            className="p-5 border rounded-xl hover:bg-accent text-left transition-all hover:border-primary/30 group bg-muted/5 hover:bg-white"
                        >
                            <div className="h-8 w-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center mb-3 group-hover:bg-yellow-600 group-hover:text-white transition-all">
                                <AlertCircle className="h-4 w-4" />
                            </div>
                            <span className="block font-semibold group-hover:text-primary transition-colors">Review Pending</span>
                            <span className="text-xs text-muted-foreground mt-1 block">Go to screening</span>
                        </button>
                        <button
                            onClick={() => router.push("/admin/disbursements")}
                            className="p-5 border rounded-xl hover:bg-accent text-left transition-all hover:border-primary/30 group bg-muted/5 hover:bg-white"
                        >
                            <div className="h-8 w-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mb-3 group-hover:bg-green-600 group-hover:text-white transition-all">
                                <ArrowRight className="h-4 w-4" />
                            </div>
                            <span className="block font-semibold group-hover:text-primary transition-colors">Disburse Funds</span>
                            <span className="text-xs text-muted-foreground mt-1 block">Process payments</span>
                        </button>
                        <button
                            onClick={() => router.push("/admin/users")}
                            className="p-5 border rounded-xl hover:bg-accent text-left transition-all hover:border-primary/30 group bg-muted/5 hover:bg-white"
                        >
                            <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                <Settings className="h-4 w-4" />
                            </div>
                            <span className="block font-semibold group-hover:text-primary transition-colors">Committee</span>
                            <span className="text-xs text-muted-foreground mt-1 block">System config</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
