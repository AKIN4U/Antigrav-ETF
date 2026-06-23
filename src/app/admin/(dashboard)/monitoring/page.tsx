"use client";

import { useState, useEffect } from "react";
import { Loader2, FileText, CheckCircle, XCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ScholarMonitoringPage() {
    const [records, setRecords] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const response = await fetch("/api/admin/academic-records");
            const result = await response.json();
            if (result.success) {
                setRecords(result.data);
            }
        } catch (error) {
            console.error("Error fetching academic records:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        const notes = prompt(`Any notes for this ${newStatus.toLowerCase()} decision? (Optional)`);
        if (notes === null) return; // User cancelled

        try {
            const response = await fetch(`/api/admin/academic-records/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus, reviewerNotes: notes })
            });
            const result = await response.json();
            if (result.success) {
                alert(`Record marked as ${newStatus}`);
                fetchRecords();
            } else {
                alert("Failed to update record.");
            }
        } catch (error) {
            console.error("Error updating record:", error);
        }
    };

    const filteredRecords = records.filter(record => {
        const matchesStatus = filterStatus === "All" || record.status === filterStatus;
        const matchesSearch = 
            record.applicant?.surname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.applicant?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.level?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Scholar Monitoring</h1>
                <p className="text-muted-foreground mt-2">Review submitted academic results for ongoing scholarship eligibility.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-lg border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search scholars..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {["All", "Pending Review", "Approved", "Rejected"].map(status => (
                        <Button 
                            key={status}
                            variant={filterStatus === status ? "default" : "outline"}
                            onClick={() => setFilterStatus(status)}
                            size="sm"
                        >
                            {status}
                        </Button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
            ) : filteredRecords.length === 0 ? (
                <div className="bg-card border rounded-lg p-12 text-center text-muted-foreground">
                    No academic records found matching your filters.
                </div>
            ) : (
                <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Scholar</th>
                                    <th className="px-6 py-4 font-medium">Academic Info</th>
                                    <th className="px-6 py-4 font-medium">Score / CGPA</th>
                                    <th className="px-6 py-4 font-medium">Document</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-primary">
                                                {record.applicant?.surname} {record.applicant?.firstName}
                                            </div>
                                            <div className="text-xs text-muted-foreground">{record.applicant?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>{record.level}</div>
                                            <div className="text-xs text-muted-foreground">{record.semester} - {record.academicYear}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {record.cgpaOrAverage}
                                        </td>
                                        <td className="px-6 py-4">
                                            <a href={record.resultUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                                <FileText className="h-4 w-4" /> View
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                                                record.status === "Approved" ? "bg-green-100 text-green-800" :
                                                record.status === "Rejected" ? "bg-red-100 text-red-800" :
                                                "bg-yellow-100 text-yellow-800"
                                            }`}>
                                                {record.status}
                                            </span>
                                            {record.reviewerNotes && (
                                                <div className="text-xs text-muted-foreground mt-1 max-w-[150px] truncate" title={record.reviewerNotes}>
                                                    Note: {record.reviewerNotes}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {record.status !== "Approved" && (
                                                    <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleStatusUpdate(record.id, "Approved")}>
                                                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                                    </Button>
                                                )}
                                                {record.status !== "Rejected" && (
                                                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleStatusUpdate(record.id, "Rejected")}>
                                                        <XCircle className="h-4 w-4 mr-1" /> Reject
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
