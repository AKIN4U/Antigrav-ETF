"use client";

import { useState, useEffect } from "react";
import { Shield, UserPlus, Edit2, Trash2, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminUser {
    id: string;
    email: string;
    name: string | null;
    role: string;
    status: string;
    createdAt: string;
    isActive: boolean;
    lastSignIn: string | null;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

    // Form states
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        role: "Admin",
        password: "",
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/admin/users");

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to fetch users");
            }

            const data = await response.json();
            setUsers(data.users);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to create user");
            }

            setSuccess(`✓ ${data.user.name || data.user.email} has been added successfully!`);
            setShowCreateModal(false);
            setFormData({ email: "", name: "", role: "Admin", password: "" });
            fetchUsers();

            // Auto-dismiss success message after 5 seconds
            setTimeout(() => setSuccess(null), 5000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        }
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        setError(null);
        setSuccess(null);

        try {
            const response = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedUser.id,
                    name: formData.name,
                    role: formData.role,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update user");
            }

            setSuccess("Committee member updated successfully!");
            setShowEditModal(false);
            setSelectedUser(null);
            fetchUsers();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to deactivate this committee member? This action cannot be undone.")) {
            return;
        }

        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`/api/admin/users?id=${userId}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to delete user");
            }

            setSuccess("Committee member deactivated successfully!");
            fetchUsers();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        }
    };

    const handleApproveUser = async (userId: string) => {
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: userId, status: "Approved" }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to approve user");
            }

            setSuccess("User approved successfully!");
            fetchUsers();

            // Auto-dismiss after 5 seconds
            setTimeout(() => setSuccess(null), 5000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        }
    };

    const handleRejectUser = async (userId: string) => {
        if (!confirm("Are you sure you want to reject this registration?")) {
            return;
        }

        setError(null);
        setSuccess(null);

        try {
            const response = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: userId, status: "Rejected" }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to reject user");
            }

            setSuccess("User registration rejected.");
            fetchUsers();

            // Auto-dismiss after 5 seconds
            setTimeout(() => setSuccess(null), 5000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        }
    };

    const openEditModal = (user: AdminUser) => {
        setSelectedUser(user);
        setFormData({
            email: user.email,
            name: user.name || "",
            role: user.role,
            password: "",
        });
        setShowEditModal(true);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Shield className="h-8 w-8 text-primary" />
                        Committee Members
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage admin users and their access levels
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setFormData({ email: "", name: "", role: "Admin", password: "" });
                        setShowCreateModal(true);
                    }}
                >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Committee Member
                </Button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b">
                <Button
                    variant="ghost"
                    onClick={() => setFilter("all")}
                    className={`font-medium text-sm rounded-none border-b-2 ${filter === "all"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                >
                    All Users ({users.length})
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => setFilter("pending")}
                    className={`font-medium text-sm rounded-none border-b-2 ${filter === "pending"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Pending Approval ({users.filter(u => u.status === "Pending").length})
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => setFilter("approved")}
                    className={`font-medium text-sm rounded-none border-b-2 ${filter === "approved"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Approved ({users.filter(u => u.status === "Approved").length})
                </Button>
            </div>

            {/* Alerts */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
                    <XCircle className="h-5 w-5" />
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-md flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{success}</span>
                </div>
            )}

            {/* Users Table */}
            <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No committee members found</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Last Sign In
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users
                                .filter(user => {
                                    if (filter === "pending") return user.status === "Pending";
                                    if (filter === "approved") return user.status === "Approved";
                                    return true;
                                })
                                .map((user) => (
                                    <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium">{user.name || "—"}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === "SuperAdmin"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : "bg-blue-100 text-blue-800"
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === "Approved"
                                                    ? "bg-green-100 text-green-800"
                                                    : user.status === "Pending"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                            {user.lastSignIn
                                                ? new Date(user.lastSignIn).toLocaleDateString()
                                                : "Never"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {user.status === "Pending" ? (
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="link" className="text-green-600 h-auto p-0" onClick={() => handleApproveUser(user.id)}>
                                                        Approve
                                                    </Button>
                                                    <Button variant="link" className="text-red-600 h-auto p-0" onClick={() => handleRejectUser(user.id)}>
                                                        Reject
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditModal(user)}>
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteUser(user.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold mb-4">Add Committee Member</h2>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="john@cccabuja.org"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Min. 8 characters"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="SuperAdmin">SuperAdmin</option>
                                </select>
                            </div>
                            <div className="flex gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1">
                                    Create
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold mb-4">Edit Committee Member</h2>
                        <form onSubmit={handleUpdateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    disabled
                                    value={formData.email}
                                    className="w-full px-3 py-2 border rounded-md bg-muted cursor-not-allowed"
                                />
                                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="SuperAdmin">SuperAdmin</option>
                                </select>
                            </div>
                            <div className="flex gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedUser(null);
                                    }}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1">
                                    Update
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}