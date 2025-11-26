"use client";

import { useState, useEffect } from "react";
import { Download, CheckCircle, AlertTriangle, Plus, X } from "lucide-react";

export default function DisbursementsPage() {
    const [disbursements, setDisbursements] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [voucherCode, setVoucherCode] = useState("");
    const [paymentReference, setPaymentReference] = useState("");

    useEffect(() => {
        fetchDisbursements();
    }, []);

    const fetchDisbursements = async () => {
        try {
            const response = await fetch("/api/admin/disbursements");
            const result = await response.json();
            if (result.success) {
                setDisbursements(result.data);
            }
        } catch (error) {
            console.error("Error fetching disbursements:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRecordDisbursement = async () => {
        if (!selectedApp || !voucherCode) return;

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
            }
        } catch (error) {
            console.error("Error recording disbursement:", error);
        }
    };

    const handleExportCSV = () => {
        if (disbursements.length === 0) return;

        const headers = ["Voucher Code", "Beneficiary", "School", "Amount", "Date", "Status", "Payment Reference"];
        const csvContent = [
            headers.join(","),
            ...disbursements.map(app => [
                `"${app.voucherCode || 'N/A'}"`,
                `"${app.applicant.surname} ${app.applicant.firstName}"`,
                `"${app.schoolName}"`,
                `"${app.approvedAmount || '0'}"`,
                `"${app.disbursedDate ? new Date(app.disbursedDate).toLocaleDateString() : 'Pending'}"`,
                `"${app.status}"`,
                `"${app.paymentReference || 'N/A'}"`
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "disbursements_export.csv");
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const totalDisbursed = disbursements
        .filter(d => d.status === "Disbursed")
        .reduce((sum, d) => sum + parseFloat(d.approvedAmount || "0"), 0);

    const pendingAmount = disbursements
        .filter(d => d.status === "Approved")
        .reduce((sum, d) => sum + parseFloat(d.approvedAmount || "0"), 0);

    if (isLoading) {
        return <div className="flex items-center justify-center h-64">Loading...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Disbursements</h2>
                    <p className="text-muted-foreground">Manage payments and generate vouchers.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleExportCSV}
                        disabled={disbursements.length === 0}
                        className="px-4 py-2 border border-input bg-background rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                    >
                        Export Report
                    </button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="p-6 bg-card rounded-xl border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Disbursed (YTD)</h3>
                    <div className="text-2xl font-bold">₦{totalDisbursed.toLocaleString()}</div>
                </div>
                <div className="p-6 bg-card rounded-xl border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Pending Payments</h3>
                    <div className="text-2xl font-bold text-yellow-600">₦{pendingAmount.toLocaleString()}</div>
                </div>
                <div className="p-6 bg-card rounded-xl border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Applications</h3>
                    <div className="text-2xl font-bold">{disbursements.length}</div>
                </div>
            </div>

            <div className="rounded-md border bg-card shadow-sm">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Voucher ID</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Beneficiary</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">School</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {disbursements.map((item) => (
                                <tr key={item.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium">{item.voucherCode || "—"}</td>
                                    <td className="p-4 align-middle">{item.applicant.surname} {item.applicant.firstName}</td>
                                    <td className="p-4 align-middle">{item.schoolName}</td>
                                    <td className="p-4 align-middle">₦{parseFloat(item.approvedAmount || "0").toLocaleString()}</td>
                                    <td className="p-4 align-middle">
                                        {item.disbursedDate ? new Date(item.disbursedDate).toLocaleDateString() : "—"}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <span
                                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${item.status === "Disbursed"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        {item.status === "Approved" && (
                                            <button
                                                onClick={() => {
                                                    setSelectedApp(item);
                                                    setShowModal(true);
                                                }}
                                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3"
                                            >
                                                <Plus className="h-4 w-4 mr-1" />
                                                Record
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card rounded-lg p-6 w-full max-w-md shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Record Disbursement</h3>
                            <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Beneficiary</label>
                                <p className="text-sm text-muted-foreground">
                                    {selectedApp?.applicant.surname} {selectedApp?.applicant.firstName}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Amount</label>
                                <p className="text-sm text-muted-foreground">₦{parseFloat(selectedApp?.approvedAmount || "0").toLocaleString()}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Voucher Code *</label>
                                <input
                                    type="text"
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="e.g., V-2025-001"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Payment Reference (Optional)</label>
                                <input
                                    type="text"
                                    value={paymentReference}
                                    onChange={(e) => setPaymentReference(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="e.g., TXN123456"
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-input bg-background rounded-md text-sm font-medium hover:bg-accent"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRecordDisbursement}
                                    disabled={!voucherCode}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                                >
                                    Record Disbursement
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
