"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Globe, FileText, CheckCircle, RefreshCw, XCircle, Code, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    // Form state
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("Draft");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [copiedFeed, setCopiedFeed] = useState(false);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/admin/announcements");
            const result = await response.json();
            if (result.success) {
                setAnnouncements(result.data || []);
            }
        } catch (error) {
            console.error("Error fetching announcements:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert("Title and Content are required.");
            return;
        }

        setIsSaving(true);
        const payload = {
            id: editingId,
            title,
            content,
            status
        };

        const method = editingId ? "PATCH" : "POST";

        try {
            const response = await fetch("/api/admin/announcements", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.success) {
                setShowFormModal(false);
                setTitle("");
                setContent("");
                setStatus("Draft");
                setEditingId(null);
                fetchAnnouncements();
                alert(editingId ? "Announcement updated successfully!" : "Announcement created successfully!");
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            console.error("Error saving announcement:", error);
            alert("An error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (ann: any) => {
        setEditingId(ann.id);
        setTitle(ann.title);
        setContent(ann.content);
        setStatus(ann.status);
        setShowFormModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this announcement?")) return;

        try {
            const response = await fetch(`/api/admin/announcements?id=${id}`, {
                method: "DELETE"
            });
            const result = await response.json();
            if (result.success) {
                fetchAnnouncements();
                alert("Announcement deleted successfully.");
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            console.error("Error deleting announcement:", error);
            alert("An error occurred while deleting.");
        }
    };

    const handleTogglePublish = async (ann: any) => {
        const targetStatus = ann.status === "Published" ? "Draft" : "Published";
        try {
            const response = await fetch("/api/admin/announcements", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: ann.id, status: targetStatus })
            });
            const result = await response.json();
            if (result.success) {
                fetchAnnouncements();
                alert(`Announcement set to ${targetStatus}`);
            }
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    const copyFeedUrl = () => {
        const feedUrl = `${window.location.origin}/api/announcements`;
        navigator.clipboard.writeText(feedUrl);
        setCopiedFeed(true);
        setTimeout(() => setCopiedFeed(false), 2000);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-5">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">General Secretary Announcements</h1>
                    <p className="text-slate-500">Publish and manage scholarship cycle updates, requirements guidelines, and sync announcements to WordPress.</p>
                </div>
                <div>
                    <Button
                        onClick={() => {
                            setEditingId(null);
                            setTitle("");
                            setContent("");
                            setStatus("Draft");
                            setShowFormModal(true);
                        }}
                        className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold flex items-center gap-1.5 shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        Create Announcement
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Announcements List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-indigo-700" />
                        Scholarship Announcements
                    </h2>
                    
                    {isLoading ? (
                        <div className="p-12 text-center bg-white border rounded-xl shadow-sm text-slate-500">
                            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-indigo-700 mb-2" />
                            Loading postings...
                        </div>
                    ) : announcements.length === 0 ? (
                        <div className="p-16 text-center bg-white border rounded-xl shadow-sm text-slate-400">
                            No announcements created yet. Click &quot;Create Announcement&quot; to begin.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {announcements.map((ann) => (
                                <div key={ann.id} className="p-5 bg-white border rounded-xl shadow-sm space-y-3 hover:border-slate-300 transition-colors">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800">{ann.title}</h3>
                                            <p className="text-xs text-slate-400 mt-1">
                                                Created: {new Date(ann.createdAt).toLocaleDateString()} • Status:{" "}
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                        ann.status === "Published"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-slate-100 text-slate-600"
                                                    }`}
                                                >
                                                    {ann.status}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(ann)} className="h-8 w-8 text-slate-600 hover:text-indigo-700">
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleTogglePublish(ann)} className={`h-8 w-8 ${ann.status === "Published" ? 'text-green-600' : 'text-slate-400'} hover:text-green-800`}>
                                                <Globe className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(ann.id)} className="h-8 w-8 text-slate-600 hover:text-red-700">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                        {ann.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side: Integration Guide Panel */}
                <div className="space-y-6">
                    <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <Code className="h-5 w-5 text-indigo-700" />
                            <h2 className="text-lg font-bold text-slate-800">WordPress Integration</h2>
                        </div>
                        
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Syncing scholarship postings to the church website is automated. Copy the JSON API feed endpoint below to integrate with your WordPress theme or RSS polling plugins.
                        </p>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Announcements JSON Feed</label>
                            <div className="flex items-center border rounded-lg bg-slate-50 p-2 text-xs font-mono text-slate-600 relative overflow-hidden group">
                                <span className="truncate pr-8 w-full">/api/announcements</span>
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    onClick={copyFeedUrl}
                                    className="h-6 w-6 absolute right-1.5 top-1.5 text-slate-400 hover:text-slate-700"
                                >
                                    {copiedFeed ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                                </Button>
                            </div>
                        </div>

                        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-xs text-indigo-800 space-y-2">
                            <h4 className="font-bold">Instructions:</h4>
                            <ul className="list-decimal pl-4 space-y-1.5">
                                <li>The feed returns published announcements in reverse chronological order.</li>
                                <li>CORS is pre-configured with wildcard policies permitting direct client-side fetch from the church website.</li>
                                <li>HTML/Markdown content is formatted natively inside the JSON response.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal Form */}
            {showFormModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 w-full max-w-lg shadow-2xl space-y-4 animate-scale-in">
                        <div className="flex justify-between items-center border-b pb-2.5">
                            <h3 className="text-lg font-bold text-slate-800">
                                {editingId ? "Edit Announcement" : "Create New Announcement"}
                            </h3>
                            <Button variant="ghost" size="icon" onClick={() => setShowFormModal(false)} className="h-7 w-7 text-slate-400 hover:text-slate-600">
                                <XCircle className="h-5 w-5" />
                            </Button>
                        </div>
                        <form onSubmit={handleCreateOrUpdate} className="space-y-4 text-sm">
                            <div className="space-y-1.5">
                                <label className="font-semibold text-slate-700">Announcement Title *</label>
                                <Input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="h-10 border-slate-200 w-full"
                                    placeholder="e.g., 2026 ETF Scholarship Applications Open!"
                                    required
                                    disabled={isSaving}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-semibold text-slate-700">Content / Details *</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={8}
                                    className="flex w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-sans"
                                    placeholder="Write details of the announcement here (markdown supported)..."
                                    required
                                    disabled={isSaving}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-semibold text-slate-700">Publication Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="h-10 px-3 bg-background border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                                    disabled={isSaving}
                                >
                                    <option value="Draft">Draft (Only visible to admins)</option>
                                    <option value="Published">Published (Public feed visible)</option>
                                </select>
                            </div>

                            <div className="flex gap-2 justify-end pt-2 border-t mt-4">
                                <Button variant="outline" type="button" onClick={() => setShowFormModal(false)} disabled={isSaving}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSaving}
                                    className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold shadow-sm"
                                >
                                    {isSaving ? "Saving..." : "Save Announcement"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
