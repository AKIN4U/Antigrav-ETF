"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, TrendingDown, Plus, X, Wallet, PieChart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FinanceResponse, ApiResponse } from "@/types";

export default function FinancePage() {
    const [financeData, setFinanceData] = useState<FinanceResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'budget' | 'transaction'>('budget');
    const [formData, setFormData] = useState<{
        year?: number;
        quarter?: number | null;
        category?: string;
        allocated?: string;
        description?: string;
        transactionType?: string;
        budgetId?: string;
        amount?: string;
        date?: string;
        reference?: string;
    }>({});

    useEffect(() => {
        fetchFinanceData();
    }, [selectedYear]);

    const fetchFinanceData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/admin/finance?year=${selectedYear}`);
            const result: ApiResponse<FinanceResponse> = await response.json();
            if (result.success && result.data) {
                setFinanceData(result.data);
            }
        } catch (error) {
            console.error("Error fetching finance data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/admin/finance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: modalType, ...formData })
            });
            const result = await response.json();
            if (result.success) {
                setShowModal(false);
                setFormData({});
                fetchFinanceData();
            }
        } catch (error) {
            console.error("Error submitting:", error);
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-64">Loading financial data...</div>;
    }

    if (!financeData) {
        return <div className="flex items-center justify-center h-64">No data available</div>;
    }

    const { summary, budgets, transactions } = financeData;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Financial Management</h2>
                    <p className="text-muted-foreground">Track budgets, expenses, and income</p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="px-4 py-2 border border-input bg-background rounded-md text-sm font-medium h-9"
                    >
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => { setModalType('budget'); setShowModal(true); }}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Budget
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => { setModalType('transaction'); setShowModal(true); }}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Transaction
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-4">
                <div className="relative p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <Wallet className="h-8 w-8 opacity-80" />
                        </div>
                        <div className="text-3xl font-bold mb-1">₦{summary.totalBudget.toLocaleString()}</div>
                        <div className="text-sm opacity-90">Total Budget</div>
                    </div>
                </div>
                <div className="relative p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="h-8 w-8 opacity-80" />
                        </div>
                        <div className="text-3xl font-bold mb-1">₦{summary.totalIncome.toLocaleString()}</div>
                        <div className="text-sm opacity-90">Total Income</div>
                    </div>
                </div>
                <div className="relative p-6 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingDown className="h-8 w-8 opacity-80" />
                        </div>
                        <div className="text-3xl font-bold mb-1">₦{summary.totalExpenses.toLocaleString()}</div>
                        <div className="text-sm opacity-90">Total Expenses</div>
                    </div>
                </div>
                <div className={`relative p-6 bg-gradient-to-br ${summary.balance >= 0 ? 'from-emerald-500 to-emerald-600' : 'from-orange-500 to-orange-600'} text-white rounded-2xl shadow-lg overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <DollarSign className="h-8 w-8 opacity-80" />
                        </div>
                        <div className="text-3xl font-bold mb-1">₦{summary.balance.toLocaleString()}</div>
                        <div className="text-sm opacity-90">Net Balance</div>
                    </div>
                </div>
            </div>

            {/* Budgets Section */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    Budget Allocation
                </h3>
                <div className="space-y-4">
                    {budgets.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No budgets created for {selectedYear}</p>
                    ) : (
                        budgets.map((budget) => {
                            const utilization = Number(budget.allocated) > 0
                                ? (Number(budget.spent) / Number(budget.allocated)) * 100
                                : 0;
                            const isOverBudget = utilization > 100;

                            return (
                                <div key={budget.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="font-semibold">{budget.category}</h4>
                                            {budget.description && (
                                                <p className="text-sm text-muted-foreground">{budget.description}</p>
                                            )}
                                            {budget.quarter && (
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 inline-block">
                                                    Q{budget.quarter}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-muted-foreground">
                                                ₦{Number(budget.spent).toLocaleString()} / ₦{Number(budget.allocated).toLocaleString()}
                                            </div>
                                            <div className={`text-sm font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                                                {utilization.toFixed(1)}% used
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`}
                                            style={{ width: `${Math.min(utilization, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Recent Transactions
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Description</th>
                                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No transactions recorded
                                    </td>
                                </tr>
                            ) : (
                                transactions.slice(0, 20).map((transaction) => (
                                    <tr key={transaction.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                        <td className="py-3 px-4 text-sm">
                                            {new Date(transaction.date).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`text-xs px-2 py-1 rounded ${transaction.type === 'Income' ? 'bg-green-100 text-green-800' :
                                                transaction.type === 'Expense' ? 'bg-red-100 text-red-800' :
                                                    'bg-blue-100 text-blue-800'
                                                }`}>
                                                {transaction.type}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm">{transaction.category}</td>
                                        <td className="py-3 px-4 text-sm">{transaction.description}</td>
                                        <td className={`py-3 px-4 text-right font-semibold ${transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {transaction.type === 'Income' ? '+' : '-'}₦{Number(transaction.amount).toLocaleString()}
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
                    <div className="bg-card rounded-lg p-6 w-full max-w-md shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                {modalType === 'budget' ? 'Create Budget' : 'Add Transaction'}
                            </h3>
                            <Button variant="ghost" size="icon" onClick={() => setShowModal(false)} className="h-7 w-7">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {modalType === 'budget' ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Year</label>
                                        <input
                                            type="number"
                                            value={formData.year || selectedYear}
                                            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Quarter (Optional)</label>
                                        <select
                                            value={formData.quarter || ''}
                                            onChange={(e) => setFormData({ ...formData, quarter: e.target.value ? parseInt(e.target.value) : null })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        >
                                            <option value="">Annual</option>
                                            <option value="1">Q1</option>
                                            <option value="2">Q2</option>
                                            <option value="3">Q3</option>
                                            <option value="4">Q4</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Category</label>
                                        <input
                                            type="text"
                                            value={formData.category || ''}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            placeholder="e.g., Scholarships"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Allocated Amount</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.allocated || ''}
                                            onChange={(e) => setFormData({ ...formData, allocated: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Description (Optional)</label>
                                        <textarea
                                            value={formData.description || ''}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Type</label>
                                        <select
                                            value={formData.transactionType || 'Expense'}
                                            onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            required
                                        >
                                            <option value="Income">Income</option>
                                            <option value="Expense">Expense</option>
                                            <option value="Transfer">Transfer</option>
                                        </select>
                                    </div>

                                    {(formData.transactionType === 'Expense' || !formData.transactionType) && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Link to Budget (Optional)</label>
                                            <select
                                                value={formData.budgetId || ''}
                                                onChange={(e) => setFormData({ ...formData, budgetId: e.target.value })}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            >
                                                <option value="">Select a Budget</option>
                                                {budgets.map((b) => (
                                                    <option key={b.id} value={b.id}>
                                                        {b.category} {b.quarter ? `(Q${b.quarter})` : '(Annual)'} - ₦{Number(b.allocated).toLocaleString()}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Category</label>
                                        <input
                                            type="text"
                                            value={formData.category || ''}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            placeholder="e.g., Donation, Scholarship"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Amount</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.amount || ''}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Description</label>
                                        <input
                                            type="text"
                                            value={formData.description || ''}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Date</label>
                                        <input
                                            type="date"
                                            value={formData.date || new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Reference (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.reference || ''}
                                            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            placeholder="Invoice/Receipt number"
                                        />
                                    </div>
                                </>
                            )}
                            <div className="flex gap-2 justify-end pt-4">
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {modalType === 'budget' ? 'Create Budget' : 'Add Transaction'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}