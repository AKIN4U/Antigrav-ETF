"use client";

import { useState, useEffect } from "react";
import { Heart, TrendingUp, Users, FileText, Plus, X, Download, CheckCircle } from "lucide-react";

import { DonationResponse, ApiResponse } from "@/types";

export default function DonationsPage() {
    const [donationsData, setDonationsData] = useState<DonationResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<{
        donorName?: string;
        donorEmail?: string;
        donorPhone?: string;
        amount?: string;
        donorAddress?: string;
        donationType: string;
        isAnonymous: boolean;
        purpose: string;
        notes?: string;
    }>({
        donationType: 'One-time',
        isAnonymous: false,
        purpose: 'General'
    });

    useEffect(() => {
        fetchDonations();
    }, [selectedYear]);

    const fetchDonations = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/admin/donations?year=${selectedYear}`);
            const result: ApiResponse<DonationResponse> = await response.json();
            if (result.success && result.data) {
                setDonationsData(result.data);
            }
        } catch (error) {
            console.error("Error fetching donations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/admin/donations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (result.success) {
                setShowModal(false);
                setFormData({ donationType: 'One-time', isAnonymous: false, purpose: 'General' });
                fetchDonations();
            }
        } catch (error) {
            console.error("Error submitting donation:", error);
        }
    };

    const handleIssueReceipt = async (donationId: string) => {
        try {
            const receiptNumber = `RCP-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            const response = await fetch('/api/admin/donations', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: donationId,
                    receiptIssued: true,
                    receiptNumber
                })
            });
            if (response.ok) {
                fetchDonations();
            }
        } catch (error) {
            console.error("Error issuing receipt:", error);
        }
    };

    const handleExportCSV = () => {
        if (!donationsData || donationsData.donations.length === 0) return;

        const headers = ["Date", "Donor Name", "Email", "Phone", "Type", "Purpose", "Amount", "Receipt #"];
        const csvContent = [
            headers.join(","),
            ...donationsData.donations.map((d) => [
                `"${new Date(d.transaction.date).toLocaleDateString()}"`,
                `"${d.isAnonymous ? 'Anonymous' : d.donorName}"`,
                `"${d.donorEmail || 'N/A'}"`,
                `"${d.donorPhone || 'N/A'}"`,
                `"${d.donationType}"`,
                `"${d.purpose || 'General'}"`,
                `"${Number(d.transaction.amount).toLocaleString()}"`,
                `"${d.receiptNumber || 'Not Issued'}"`
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `donations_${selectedYear}.csv`);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-64">Loading donations...</div>;
    }

    if (!donationsData) {
        return <div className="flex items-center justify-center h-64">No data available</div>;
    }

    const { summary, donations, typeBreakdown, purposeBreakdown, monthlyData, topDonors } = donationsData;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Donations Management</h2>
                    <p className="text-muted-foreground">Track and manage donor contributions</p>
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
                        onClick={handleExportCSV}
                        disabled={donations.length === 0}
                        className="px-4 py-2 border border-input bg-background rounded-md text-sm font-medium hover:bg-accent disabled:opacity-50 flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Export CSV
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Record Donation
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-4">
                <div className="relative p-6 bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <Heart className="h-8 w-8 opacity-80" />
                        </div>
                        <div className="text-3xl font-bold mb-1">₦{summary.totalDonations.toLocaleString()}</div>
                        <div className="text-sm opacity-90">Total Donations</div>
                    </div>
                </div>

                <div className="relative p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <Users className="h-8 w-8 opacity-80" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{summary.totalDonors}</div>
                        <div className="text-sm opacity-90">Unique Donors</div>
                    </div>
                </div>

                <div className="relative p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="h-8 w-8 opacity-80" />
                        </div>
                        <div className="text-3xl font-bold mb-1">₦{Math.round(summary.averageDonation).toLocaleString()}</div>
                        <div className="text-sm opacity-90">Average Donation</div>
                    </div>
                </div>

                <div className="relative p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <FileText className="h-8 w-8 opacity-80" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{summary.receiptsIssued}</div>
                        <div className="text-sm opacity-90">Receipts Issued</div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Donation Type Breakdown */}
                <div className="bg-card border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-6">Donation Types</h3>
                    <div className="space-y-4">
                        {Object.entries(typeBreakdown).map(([type, amount]) => {
                            const percentage = (amount / summary.totalDonations) * 100;
                            const colors: Record<string, string> = {
                                'One-time': 'bg-blue-500',
                                'Monthly': 'bg-green-500',
                                'Annual': 'bg-purple-500'
                            };
                            return (
                                <div key={type}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium">{type}</span>
                                        <span className="text-muted-foreground">₦{amount.toLocaleString()} ({percentage.toFixed(1)}%)</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${colors[type] || 'bg-gray-500'} transition-all duration-500`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Purpose Breakdown */}
                <div className="bg-card border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-6">Donation Purpose</h3>
                    <div className="space-y-4">
                        {Object.entries(purposeBreakdown).map(([purpose, amount]) => {
                            const percentage = (amount / summary.totalDonations) * 100;
                            const colors: Record<string, string> = {
                                'General': 'bg-blue-500',
                                'Scholarship': 'bg-yellow-500',
                                'Infrastructure': 'bg-purple-500',
                                'Operations': 'bg-green-500'
                            };
                            return (
                                <div key={purpose}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium">{purpose}</span>
                                        <span className="text-muted-foreground">₦{amount.toLocaleString()} ({percentage.toFixed(1)}%)</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${colors[purpose] || 'bg-gray-500'} transition-all duration-500`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Monthly Trend */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6">Monthly Donation Trend</h3>
                <div className="space-y-3">
                    {monthlyData.map((data) => {
                        const maxAmount = Math.max(...monthlyData.map((d) => d.amount));
                        const percentage = maxAmount > 0 ? (data.amount / maxAmount) * 100 : 0;
                        return (
                            <div key={data.month} className="flex items-center gap-3">
                                <div className="w-12 text-sm font-medium text-muted-foreground">{data.month}</div>
                                <div className="flex-1 h-10 bg-muted rounded-lg overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-between px-3 text-white text-sm font-semibold transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    >
                                        {data.amount > 0 && (
                                            <>
                                                <span>₦{data.amount.toLocaleString()}</span>
                                                <span className="text-xs opacity-80">{data.count} donations</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Top Donors */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6">Top Donors</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">#</th>
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Donor Name</th>
                                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Donations</th>
                                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topDonors.map((donor, index) => (
                                <tr key={index} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                    <td className="py-3 px-4 font-medium">{index + 1}</td>
                                    <td className="py-3 px-4">{donor.name}</td>
                                    <td className="py-3 px-4 text-right">{donor.count}</td>
                                    <td className="py-3 px-4 text-right font-semibold text-green-600">
                                        ₦{donor.amount.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Donations Table */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6">Recent Donations</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Donor</th>
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Purpose</th>
                                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Amount</th>
                                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Receipt</th>
                                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No donations recorded
                                    </td>
                                </tr>
                            ) : (
                                donations.slice(0, 20).map((donation) => (
                                    <tr key={donation.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                        <td className="py-3 px-4 text-sm">
                                            {new Date(donation.transaction.date).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4">
                                            {donation.isAnonymous ? (
                                                <span className="text-muted-foreground italic">Anonymous</span>
                                            ) : (
                                                <div>
                                                    <div className="font-medium">{donation.donorName}</div>
                                                    {donation.donorEmail && (
                                                        <div className="text-xs text-muted-foreground">{donation.donorEmail}</div>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                                                {donation.donationType}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm">{donation.purpose || 'General'}</td>
                                        <td className="py-3 px-4 text-right font-semibold text-green-600">
                                            ₦{Number(donation.transaction.amount).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {donation.receiptIssued ? (
                                                <div className="flex items-center justify-center gap-1 text-green-600">
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span className="text-xs">{donation.receiptNumber}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">Not issued</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            {!donation.receiptIssued && (
                                                <button
                                                    onClick={() => handleIssueReceipt(donation.id)}
                                                    className="text-xs px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                                                >
                                                    Issue Receipt
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card rounded-lg p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Record Donation</h3>
                            <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Donor Name *</label>
                                    <input
                                        type="text"
                                        value={formData.donorName || ''}
                                        onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <input
                                        type="email"
                                        value={formData.donorEmail || ''}
                                        onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.donorPhone || ''}
                                        onChange={(e) => setFormData({ ...formData, donorPhone: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Amount *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.amount || ''}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Address</label>
                                <input
                                    type="text"
                                    value={formData.donorAddress || ''}
                                    onChange={(e) => setFormData({ ...formData, donorAddress: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Donation Type *</label>
                                    <select
                                        value={formData.donationType}
                                        onChange={(e) => setFormData({ ...formData, donationType: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        required
                                    >
                                        <option value="One-time">One-time</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Annual">Annual</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Purpose</label>
                                    <select
                                        value={formData.purpose}
                                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="General">General</option>
                                        <option value="Scholarship">Scholarship</option>
                                        <option value="Infrastructure">Infrastructure</option>
                                        <option value="Operations">Operations</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Notes</label>
                                <textarea
                                    value={formData.notes || ''}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="anonymous"
                                    checked={formData.isAnonymous}
                                    onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                                    className="h-4 w-4"
                                />
                                <label htmlFor="anonymous" className="text-sm font-medium">
                                    Anonymous Donation
                                </label>
                            </div>

                            <div className="flex gap-2 justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-input bg-background rounded-md text-sm font-medium hover:bg-accent"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
                                >
                                    Record Donation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
