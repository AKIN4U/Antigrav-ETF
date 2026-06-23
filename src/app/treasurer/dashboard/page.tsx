"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { Plus, X, Search, FileDown, Landmark, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TreasurerDashboardPage() {
    const [disbursements, setDisbursements] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedApp, setSelectedApp] = useState<any | null>(null);
    const [voucherCode, setVoucherCode] = useState("");
    const [paymentReference, setPaymentReference] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchDisbursements();
    }, []);

    useEffect(() => {
        let result = disbursements;

        if (statusFilter !== "All") {
            result = result.filter(item => item.status === statusFilter);
        }

        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            result = result.filter(item => 
                (item.applicant?.surname || "").toLowerCase().includes(query) ||
                (item.applicant?.firstName || "").toLowerCase().includes(query) ||
                (item.schoolName || "").toLowerCase().includes(query) ||
                (item.voucherCode || "").toLowerCase().includes(query)
            );
        }

        setFilteredData(result);
    }, [searchQuery, statusFilter, disbursements]);

    const fetchDisbursements = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/admin/disbursements");
            const result = await response.json();
            if (result.success) {
                setDisbursements(result.data || []);
                setFilteredData(result.data || []);
            }
        } catch (error) {
            console.error("Error fetching disbursements:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRecordDisbursement = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedApp || !voucherCode) return;
        setIsSaving(true);

        try {
            const response = await fetch("/api/admin/disbursements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    applicationId: selectedApp.id,
                    voucherCode,
                    paymentReference,
                }),
            });

            const result = await response.json();
            if (result.success) {
                setShowModal(false);
                setVoucherCode("");
                setPaymentReference("");
                setSelectedApp(null);
                fetchDisbursements();
                alert("Disbursement recorded successfully!");
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            console.error("Error recording disbursement:", error);
            alert("An error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleExportCSV = () => {
        if (filteredData.length === 0) return;

        const headers = ["Voucher ID", "Beneficiary", "Email", "SchoolName", "Approved Amount", "Disbursement Date", "Payment Status", "Bank Reference"];
        const csvContent = [
            headers.join(","),
            ...filteredData.map(app => [
                `"${app.voucherCode || '—'}"`,
                `"${app.applicant?.surname || ''} ${app.applicant?.firstName || ''}"`,
                `"${app.applicant?.email || 'N/A'}"`,
                `"${app.schoolName || ''}"`,
                `"₦${parseFloat(app.approvedAmount || '0').toLocaleString()}"`,
                `"${app.disbursedDate ? new Date(app.disbursedDate).toLocaleDateString() : 'Pending'}"`,
                `"${app.status}"`,
                `"${app.paymentReference || '—'}"`
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `CCC_ETF_Disbursements_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Computations
    const totalDisbursed = disbursements
        .filter(d => d.status === "Disbursed")
        .reduce((sum, d) => sum + parseFloat(d.approvedAmount || "0"), 0);

    const pendingAmount = disbursements
        .filter(d => d.status === "Approved")
        .reduce((sum, d) => sum + parseFloat(d.approvedAmount || "0"), 0);

    return (
        <div className="space-y-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Funds Disbursement Sign-Off</h1>
                    <p className="text-slate-500">Record bank transaction slips, generate vouchers, and trace released funds.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={fetchDisbursements}
                        size="sm"
                        disabled={isLoading}
                        className="bg-white hover:bg-slate-50 border-slate-200"
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button
                        onClick={handleExportCSV}
                        disabled={filteredData.length === 0}
                        size="sm"
                        className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold shadow-sm"
                    >
                        <FileDown className="h-4 w-4 mr-2" />
                        Export CSV Report
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="p-6 bg-white rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-sm font-medium text-slate-400 block mb-1">Total Disbursed (Paid)</span>
                        <div className="text-2xl font-black text-slate-800">₦{totalDisbursed.toLocaleString()}</div>
                    </div>
                    <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center border border-green-100">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                </div>

                <div className="p-6 bg-white rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-sm font-medium text-slate-400 block mb-1">Pending Release (Approved)</span>
                        <div className="text-2xl font-black text-amber-600">₦{pendingAmount.toLocaleString()}</div>
                    </div>
                    <div className="h-12 w-12 bg-amber-50 rounded-lg flex items-center justify-center border border-amber-100">
                        <Landmark className="h-6 w-6 text-amber-600" />
                    </div>
                </div>

                <div className="p-6 bg-white rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-sm font-medium text-slate-400 block mb-1">Total Active Candidates</span>
                        <div className="text-2xl font-black text-indigo-700">{disbursements.length}</div>
                    </div>
                    <div className="h-12 w-12 bg-indigo-50 rounded-lg flex items-center justify-center border border-indigo-100">
                        <AlertCircle className="h-6 w-6 text-indigo-600" />
                    </div>
                </div>
            </div>

            {/* Filters panel */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm items-center">
                <div className="relative w-full md:flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                        type="text"
                        placeholder="Search by beneficiary name, school, or voucher code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-10 border-slate-200 focus:ring-indigo-500 w-full"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-10 px-3 bg-background border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium w-full md:w-44"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Approved">Approved (Pending)</option>
                        <option value="Disbursed">Disbursed (Paid)</option>
                    </select>
                </div>
            </div>

            {/* Table list */}
            {isLoading ? (
                <div className="p-8 text-center bg-white border rounded-xl shadow-sm text-slate-500 font-medium">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-indigo-700 mb-2" />
                    Fetching disbursement records...
                </div>
            ) : filteredData.length === 0 ? (
                <div className="p-12 text-center bg-white border rounded-xl shadow-sm text-slate-400">
                    No disbursement records match your current filters.
                </div>
            ) : (
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead>
                                <tr className="border-b bg-slate-50 text-slate-500 font-semibold">
                                    <th className="h-12 px-6 text-left align-middle">Voucher Code</th>
                                    <th className="h-12 px-6 text-left align-middle">Beneficiary Name</th>
                                    <th className="h-12 px-6 text-left align-middle">School Details</th>
                                    <th className="h-12 px-6 text-left align-middle">Approved Amount</th>
                                    <th className="h-12 px-6 text-left align-middle">Disbursement Date</th>
                                    <th className="h-12 px-6 text-left align-middle">Status</th>
                                    <th className="h-12 px-6 text-right align-middle">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 align-middle font-bold text-slate-700">
                                            {item.voucherCode || "—"}
                                        </td>
                                        <td className="px-6 py-4 align-middle font-medium text-slate-900">
                                            {item.applicant?.surname} {item.applicant?.firstName}
                                        </td>
                                        <td className="px-6 py-4 align-middle text-slate-500">
                                            <div className="font-medium text-slate-700">{item.schoolName}</div>
                                            <div className="text-xs">{item.presentClass}</div>
                                        </td>
                                        <td className="px-6 py-4 align-middle font-bold text-slate-900">
                                            ₦{parseFloat(item.approvedAmount || "0").toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 align-middle text-slate-500">
                                            {item.disbursedDate ? new Date(item.disbursedDate).toLocaleDateString() : "—"}
                                        </td>
                                        <td className="px-6 py-4 align-middle">
                                            <span
                                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                                                    item.status === "Disbursed"
                                                        ? "bg-green-50 text-green-700 border-green-200"
                                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                                }`}
                                            >
                                                {item.status === "Disbursed" ? "Paid" : "Pending Release"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 align-middle text-right">
                                            {item.status === "Approved" ? (
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedApp(item);
                                                        setShowModal(true);
                                                    }}
                                                    className="bg-indigo-700 hover:bg-indigo-800 text-white font-medium shadow-sm flex items-center gap-1.5 ml-auto"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                    Disburse
                                                </Button>
                                            ) : (
                                                <div className="text-xs text-slate-400 font-medium">
                                                    Ref: {item.paymentReference || "—"}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal Dialog */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 w-full max-w-md shadow-2xl space-y-4 animate-scale-in">
                        <div className="flex justify-between items-center border-b pb-2.5">
                            <h3 className="text-lg font-bold text-slate-800">Record Funds Release</h3>
                            <Button variant="ghost" size="icon" onClick={() => setShowModal(false)} className="h-7 w-7 text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <form onSubmit={handleRecordDisbursement} className="space-y-4">
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm space-y-1">
                                <p><span className="text-slate-400 font-medium">Beneficiary:</span> <span className="font-bold text-slate-800">{selectedApp?.applicant?.surname} {selectedApp?.applicant?.firstName}</span></p>
                                <p><span className="text-slate-400 font-medium">Approved Amount:</span> <span className="font-bold text-indigo-700">₦{parseFloat(selectedApp?.approvedAmount || "0").toLocaleString()}</span></p>
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Voucher Code *</label>
                                <input
                                    type="text"
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-semibold"
                                    placeholder="e.g. V-2026-042"
                                    required
                                    disabled={isSaving}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Bank Payment Reference (Optional)</label>
                                <input
                                    type="text"
                                    value={paymentReference}
                                    onChange={(e) => setPaymentReference(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g. TR-BANK-10294"
                                    disabled={isSaving}
                                />
                            </div>

                            <div className="flex gap-2 justify-end pt-2 border-t mt-4">
                                <Button variant="outline" type="button" onClick={() => setShowModal(false)} disabled={isSaving}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!voucherCode || isSaving}
                                    className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold shadow-sm"
                                >
                                    Confirm Paid
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
