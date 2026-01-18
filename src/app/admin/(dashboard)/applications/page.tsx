"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ApplicationWithApplicant, ApiResponse } from "@/types";

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<ApplicationWithApplicant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchApplications = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
                status: statusFilter,
                search: searchTerm,
            });
            const response = await fetch(`/api/admin/applications?${params}`);
            const result: ApiResponse<ApplicationWithApplicant[]> = await response.json();
            if (result.success && result.data) {
                setApplications(result.data);
                setTotalPages(result.meta?.totalPages || 1);
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search to avoid too many requests
        const timeoutId = setTimeout(() => {
            fetchApplications();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [page, statusFilter, searchTerm]);

    const handleExportCSV = () => {
        if (applications.length === 0) return;

        const headers = ["Applicant Name", "School", "Level", "Date", "Status"];
        const csvContent = [
            headers.join(","),
            ...applications.map(app => [
                `"${app.applicant.surname} ${app.applicant.firstName}"`,
                `"${app.schoolName}"`,
                `"${app.presentClass}"`,
                `"${new Date(app.createdAt).toLocaleDateString()}"`,
                `"${app.status}"`
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "applications_export.csv");
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-primary">Applications</h1>
                <div className="flex gap-2">
                    <Button
                        onClick={handleExportCSV}
                        disabled={applications.length === 0}
                        size="sm"
                    >
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-lg border shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        placeholder="Search applicants..."
                        className="pl-10 h-10 w-full rounded-md border border-input bg-background text-sm"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1); // Reset to page 1 on search
                        }}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                        className="h-10 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1); // Reset to page 1 on filter change
                        }}
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Disbursed">Disbursed</option>
                    </select>
                </div>
            </div>

            <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium">
                            <tr>
                                <th className="px-6 py-3">Applicant</th>
                                <th className="px-6 py-3">School</th>
                                <th className="px-6 py-3">Level</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                        <div className="flex justify-center items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Loading applications...
                                        </div>
                                    </td>
                                </tr>
                            ) : applications.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                        No applications found.
                                    </td>
                                </tr>
                            ) : (
                                applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 font-medium">
                                            {app.applicant.surname} {app.applicant.firstName}
                                        </td>
                                        <td className="px-6 py-4">{app.schoolName}</td>
                                        <td className="px-6 py-4">{app.presentClass}</td>
                                        <td className="px-6 py-4">{new Date(app.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${app.status === "Approved"
                                                    ? "bg-green-100 text-green-800"
                                                    : app.status === "Rejected"
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button asChild variant="ghost" size="icon">
                                                <Link href={`/admin/applications/${app.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between px-4 py-4 border-t">
                    <div className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1 || isLoading}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || isLoading}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}