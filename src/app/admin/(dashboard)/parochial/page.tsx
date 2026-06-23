"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Search, RefreshCw, Award, ShieldCheck, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function ParochialCommitteePage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [eSignature, setESignature] = useState("");
    const [showSignOffModal, setShowSignOffModal] = useState(false);
    const [actionType, setActionType] = useState<"Approve" | "Reject">("Approve");

    useEffect(() => {
        fetchRecommendedApplications();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredData(applications);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredData(
                applications.filter(item => 
                    (item.applicant?.surname || "").toLowerCase().includes(query) ||
                    (item.applicant?.firstName || "").toLowerCase().includes(query) ||
                    (item.schoolName || "").toLowerCase().includes(query)
                )
            );
        }
    }, [searchQuery, applications]);

    const fetchRecommendedApplications = async () => {
        setIsLoading(true);
        try {
            // Fetch all applications in Recommended for Award status
            const response = await fetch("/api/admin/applications");
            const result = await response.json();
            if (result.success) {
                // Filter by recommended status
                const recommended = (result.data || []).filter(
                    (app: any) => app.status === "Recommended for Award"
                );
                setApplications(recommended);
                setFilteredData(recommended);
                setSelectedIds([]);
            }
        } catch (error) {
            console.error("Error fetching recommended applications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(filteredData.map(app => app.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(rowId => rowId !== id));
        }
    };

    const triggerSignOffAction = (type: "Approve" | "Reject") => {
        if (selectedIds.length === 0) return;
        setActionType(type);
        setESignature("");
        setShowSignOffModal(true);
    };

    const handleExecuteSignOff = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!eSignature.trim()) {
            alert("Electronic signature is required.");
            return;
        }

        setIsProcessing(true);
        const targetStatus = actionType === "Approve" ? "Approved" : "Rejected";

        try {
            // Process all selected applications sequentially or in parallel
            const promises = selectedIds.map(async (id) => {
                const app = applications.find(a => a.id === id);
                const approvedVal = app?.approvedAmount || app?.schoolFees || "0";
                
                return fetch(`/api/admin/applications/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        status: targetStatus,
                        committeeNotes: `Parochial Committee Sign-Off. E-signed by: ${eSignature}`,
                        // If approving, make sure approvedAmount is set
                        ...(actionType === "Approve" && { approvedAmount: approvedVal })
                    })
                });
            });

            await Promise.all(promises);
            setShowSignOffModal(false);
            fetchRecommendedApplications();
            alert(`Successfully signed off and set status to ${targetStatus} for ${selectedIds.length} candidate(s)!`);
        } catch (error) {
            console.error("Error signing off applications:", error);
            alert("An error occurred during sign-off.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8 p-6 bg-slate-50/50 min-h-screen rounded-2xl border border-slate-100">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm">
                        <ShieldCheck className="h-4 w-4" />
                        Parochial Committee Final Review
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Scholarship Award Sign-Off</h1>
                    <p className="text-slate-500">Provide final electronic sign-offs for bursary recommendations from the ETF Secretariat.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={fetchRecommendedApplications}
                        size="sm"
                        disabled={isLoading}
                        className="bg-white border-slate-200"
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh Recommended List
                    </Button>
                </div>
            </div>

            {/* Selection Actions bar */}
            {selectedIds.length > 0 && (
                <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-xl shadow-sm animate-fade-in">
                    <div className="flex items-center gap-2 text-indigo-900 font-semibold text-sm">
                        <ClipboardCheck className="h-5 w-5 text-indigo-600 animate-bounce" />
                        <span>{selectedIds.length} candidate(s) selected for action</span>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => triggerSignOffAction("Approve")}
                            disabled={isProcessing}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white font-bold"
                        >
                            <CheckCircle2 className="h-4 w-4 mr-1.5" /> Sign-Off (Approve)
                        </Button>
                        <Button
                            onClick={() => triggerSignOffAction("Reject")}
                            disabled={isProcessing}
                            variant="destructive"
                            size="sm"
                        >
                            <XCircle className="h-4 w-4 mr-1.5" /> Reject Candidates
                        </Button>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="relative bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <Search className="absolute left-7 top-7 h-4 w-4 text-slate-400" />
                <Input
                    type="text"
                    placeholder="Search recommended list by beneficiary name or school..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 border-slate-200 focus:ring-indigo-500 w-full"
                />
            </div>

            {/* Content Table */}
            {isLoading ? (
                <div className="p-12 text-center bg-white border rounded-xl shadow-sm text-slate-500 font-medium">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-indigo-700 mb-2" />
                    Loading recommendations...
                </div>
            ) : filteredData.length === 0 ? (
                <div className="p-16 text-center bg-white border rounded-xl shadow-sm text-slate-400">
                    <Award className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                    No candidates are currently recommended for award waiting for sign-off.
                </div>
            ) : (
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <table className="w-full caption-bottom text-sm">
                        <thead>
                            <tr className="border-b bg-slate-50 text-slate-500 font-semibold">
                                <th className="h-12 px-6 text-left align-middle w-12">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.length === filteredData.length}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                </th>
                                <th className="h-12 px-6 text-left align-middle">Beneficiary</th>
                                <th className="h-12 px-6 text-left align-middle">School Details</th>
                                <th className="h-12 px-6 text-left align-middle">School Fees (Declared)</th>
                                <th className="h-12 px-6 text-left align-middle">Recommended Status</th>
                                <th className="h-12 px-6 text-right align-middle">Verification</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredData.map((item) => {
                                const isChecked = selectedIds.includes(item.id);
                                return (
                                    <tr key={item.id} className={`hover:bg-slate-50/50 transition-colors ${isChecked ? 'bg-indigo-50/20' : ''}`}>
                                        <td className="px-6 py-4 align-middle">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={(e) => handleSelectRow(item.id, e.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4 align-middle">
                                            <Link href={`/admin/applications/${item.id}`} className="font-bold text-slate-800 hover:text-indigo-700 underline underline-offset-2">
                                                {item.applicant?.surname} {item.applicant?.firstName}
                                            </Link>
                                            <div className="text-xs text-slate-400 mt-0.5">{item.applicant?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 align-middle text-slate-500">
                                            <div className="font-medium text-slate-700">{item.schoolName}</div>
                                            <div className="text-xs">{item.presentClass}</div>
                                        </td>
                                        <td className="px-6 py-4 align-middle font-semibold text-slate-900">
                                            ₦{parseFloat(item.schoolFees.replace(/[^0-9]/g, ''))?.toLocaleString() || item.schoolFees}
                                        </td>
                                        <td className="px-6 py-4 align-middle">
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border-blue-200">
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 align-middle text-right text-slate-500">
                                            <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                                                item.verificationStatus === 'Verification Complete'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {item.verificationStatus || "Unverified"}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Electronic Sign-Off Modal */}
            {showSignOffModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 w-full max-w-md shadow-2xl space-y-4 animate-scale-in">
                        <div className="flex justify-between items-center border-b pb-2.5">
                            <h3 className="text-lg font-bold text-slate-800">
                                {actionType === "Approve" ? "Confirm Electronic Sign-Off" : "Confirm Rejection"}
                            </h3>
                            <Button variant="ghost" size="icon" onClick={() => setShowSignOffModal(false)} className="h-7 w-7 text-slate-400 hover:text-slate-600">
                                <XCircle className="h-5 w-5" />
                            </Button>
                        </div>
                        <form onSubmit={handleExecuteSignOff} className="space-y-4">
                            <p className="text-sm text-slate-600">
                                You are about to {actionType === "Approve" ? "APPROVE" : "REJECT"} the awards for <span className="font-bold text-indigo-700">{selectedIds.length} selected candidate(s)</span>.
                            </p>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 block">
                                    Electronic Sign-off Signature (Type your Full Name) *
                                </label>
                                <input
                                    type="text"
                                    value={eSignature}
                                    onChange={(e) => setESignature(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-bold"
                                    placeholder="e.g. Elder Joseph Alao"
                                    required
                                    disabled={isProcessing}
                                />
                                <p className="text-xs text-muted-foreground">
                                    By typing your name, you acknowledge this as an electronic confirmation of the Parochial Committee final decision.
                                </p>
                            </div>

                            <div className="flex gap-2 justify-end pt-2 border-t mt-4">
                                <Button variant="outline" type="button" onClick={() => setShowSignOffModal(false)} disabled={isProcessing}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!eSignature.trim() || isProcessing}
                                    className={actionType === "Approve" ? "bg-green-600 hover:bg-green-700 text-white font-bold" : "bg-red-600 hover:bg-red-700 text-white"}
                                >
                                    Confirm Action
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
