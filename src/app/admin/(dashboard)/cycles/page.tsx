"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar, CheckCircle2, Clock, AlertCircle, X, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function CyclesPage() {
    const [cycles, setCycles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCycle, setEditingCycle] = useState<any>(null);
    const [formData, setFormData] = useState({
        year: new Date().getFullYear(),
        name: "",
        startDate: "",
        endDate: "",
        status: "Draft",
        description: ""
    });

    useEffect(() => {
        fetchCycles();
    }, []);

    const fetchCycles = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/admin/cycles");
            const result = await response.json();
            if (result.success) {
                setCycles(result.data);
            }
        } catch (error) {
            console.error("Error fetching cycles:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingCycle ? `/api/admin/cycles/${editingCycle.id}` : "/api/admin/cycles";
        const method = editingCycle ? "PATCH" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (result.success) {
                setShowModal(false);
                setEditingCycle(null);
                setFormData({
                    year: new Date().getFullYear(),
                    name: "",
                    startDate: "",
                    endDate: "",
                    status: "Draft",
                    description: ""
                });
                fetchCycles();
            }
        } catch (error) {
            console.error("Error saving cycle:", error);
        }
    };

    const handleEdit = (cycle: any) => {
        setEditingCycle(cycle);
        setFormData({
            year: cycle.year,
            name: cycle.name,
            startDate: format(new Date(cycle.startDate), "yyyy-MM-dd"),
            endDate: format(new Date(cycle.endDate), "yyyy-MM-dd"),
            status: cycle.status,
            description: cycle.description || ""
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this cycle?")) return;
        try {
            const response = await fetch(`/api/admin/cycles/${id}`, { method: "DELETE" });
            const result = await response.json();
            if (result.success) {
                fetchCycles();
            }
        } catch (error) {
            console.error("Error deleting cycle:", error);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Active": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case "Draft": return <Clock className="h-4 w-4 text-yellow-500" />;
            case "Completed": return <Calendar className="h-4 w-4 text-blue-500" />;
            default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Scholarship Cycles</h1>
                    <p className="text-muted-foreground">Manage application windows and program settings.</p>
                </div>
                <Button onClick={() => { setEditingCycle(null); setShowModal(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Cycle
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">Loading cycles...</div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {cycles.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-muted-foreground bg-card border rounded-xl">
                            No scholarship cycles found. Create one to get started.
                        </div>
                    ) : (
                        cycles.map((cycle) => (
                            <div key={cycle.id} className="bg-card border rounded-xl p-6 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(cycle.status)}
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cycle.status === "Active" ? "bg-green-100 text-green-800" :
                                                    cycle.status === "Draft" ? "bg-yellow-100 text-yellow-800" :
                                                        "bg-gray-100 text-gray-800"
                                                }`}>
                                                {cycle.status}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(cycle)} className="p-1 hover:bg-muted rounded text-muted-foreground">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(cycle.id)} className="p-1 hover:bg-muted rounded text-red-500">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold">{cycle.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{cycle.year} Scholarship Program</p>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Start: {format(new Date(cycle.startDate), "MMM d, yyyy")}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>End: {format(new Date(cycle.endDate), "MMM d, yyyy")}</span>
                                        </div>
                                    </div>

                                    {cycle.description && (
                                        <p className="text-sm text-gray-600 line-clamp-2 italic border-t pt-2 mt-2">
                                            "{cycle.description}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{editingCycle ? "Edit Cycle" : "Create New Cycle"}</h2>
                            <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Year</label>
                                    <input
                                        type="number"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Active">Active</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cycle Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 2026 First Semester"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Start Date</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">End Date</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description (Optional)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md min-h-[80px]"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1">
                                    {editingCycle ? "Update Cycle" : "Create Cycle"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
