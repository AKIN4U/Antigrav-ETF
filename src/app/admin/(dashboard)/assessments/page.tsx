"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, ChevronLeft, ChevronRight, FileText, User } from "lucide-react";

export default function AssessmentsPage() {
    const [assessments, setAssessments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination (Client-side for now as simplistic start)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const res = await fetch("/api/assessments");
                if (res.ok) {
                    const data = await res.json();
                    setAssessments(data.assessments || []);
                }
            } catch (error) {
                console.error("Failed to load assessments", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssessments();
    }, []);

    // Filter Logic
    const filteredAssessments = assessments.filter(assessment => {
        const searchLower = searchQuery.toLowerCase();
        const reviewerName = assessment.adminUser?.name?.toLowerCase() || "";
        const reviewerEmail = assessment.adminUser?.email?.toLowerCase() || "";
        const applicantName = `${assessment.application?.applicant?.surname} ${assessment.application?.applicant?.firstName}`.toLowerCase();

        return reviewerName.includes(searchLower) ||
            reviewerEmail.includes(searchLower) ||
            applicantName.includes(searchLower);
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredAssessments.length / itemsPerPage);
    const currentData = filteredAssessments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Assessments</h1>
                    <p className="text-muted-foreground">Review committee evaluations.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-card border rounded-lg p-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search reviewer or applicant..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Committee Member</th>
                                <th className="px-6 py-4">Applicant</th>
                                <th className="px-6 py-4">Scores (Fin/Acad/Ch)</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Notes</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                                        Loading assessments...
                                    </td>
                                </tr>
                            ) : currentData.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                                        No assessments found.
                                    </td>
                                </tr>
                            ) : (
                                currentData.map((assessment) => (
                                    <tr key={assessment.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-gray-100">
                                                        {assessment.adminUser?.name || "Unknown"}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {assessment.adminUser?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {assessment.application?.applicant ? (
                                                <span>
                                                    {assessment.application.applicant.surname} {assessment.application.applicant.firstName}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground italic">Deleted Applicant</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {assessment.financialScore} / {assessment.academicScore} / {assessment.churchScore}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                {assessment.totalScore}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {new Date(assessment.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate text-muted-foreground" title={assessment.notes}>
                                            {assessment.notes || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/applications/${assessment.applicationId}`}
                                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                                            >
                                                View <FileText className="h-3 w-3" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && filteredAssessments.length > 0 && (
                    <div className="px-6 py-4 border-t flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredAssessments.length)} to {Math.min(currentPage * itemsPerPage, filteredAssessments.length)} of {filteredAssessments.length}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 border rounded-md hover:bg-accent disabled:opacity-50"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 border rounded-md hover:bg-accent disabled:opacity-50"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
