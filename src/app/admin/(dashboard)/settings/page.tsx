"use client";

import { useState, useEffect } from "react";
import { Loader2, Mail, Calendar, DollarSign, Save, CheckCircle, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<"general" | "emails">("general");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Settings State
    const [ceilings, setCeilings] = useState({
        Primary: 30000,
        JSS: 50000,
        SSS: 50000,
        Tertiary: 60000
    });

    const [activeCycle, setActiveCycle] = useState<any>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [emailTemplates, setEmailTemplates] = useState({
        applicant_received: { subject: "", body: "" },
        admin_new_application: { subject: "", body: "" },
        status_update: { subject: "", body: "" }
    });

    const [activeEmailTab, setActiveEmailTab] = useState<"applicant_received" | "admin_new_application" | "status_update">("applicant_received");

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/admin/settings");
            const result = await response.json();
            if (result.success && result.data) {
                if (result.data.ceilings) setCeilings(result.data.ceilings);
                if (result.data.emailTemplates) setEmailTemplates(result.data.emailTemplates);
                if (result.data.activeCycle) {
                    setActiveCycle(result.data.activeCycle);
                    setStartDate(new Date(result.data.activeCycle.startDate).toISOString().split("T")[0]);
                    setEndDate(new Date(result.data.activeCycle.endDate).toISOString().split("T")[0]);
                }
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
            setErrorMessage("Failed to load settings from server.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        try {
            const payload = {
                ceilings,
                emailTemplates,
                activeCycleDates: activeCycle ? { startDate, endDate } : null
            };

            const response = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.success) {
                setSuccessMessage("✓ Settings updated successfully!");
                // Clear success after 4 seconds
                setTimeout(() => setSuccessMessage(null), 4000);
            } else {
                setErrorMessage(result.error || "Failed to save settings.");
            }
        } catch (error) {
            console.error("Error saving settings:", error);
            setErrorMessage("An error occurred while saving settings.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCeilingChange = (level: string, value: string) => {
        const numVal = parseInt(value) || 0;
        setCeilings(prev => ({
            ...prev,
            [level]: numVal
        }));
    };

    const handleTemplateChange = (templateName: string, field: "subject" | "body", value: string) => {
        setEmailTemplates(prev => ({
            ...prev,
            [templateName]: {
                ...prev[templateName as keyof typeof prev],
                [field]: value
            }
        }));
    };

    const insertVariable = (templateName: string, field: "subject" | "body", variable: string) => {
        const currentValue = emailTemplates[templateName as keyof typeof emailTemplates][field];
        handleTemplateChange(templateName, field, currentValue + variable);
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                    System Settings
                </h1>
                <p className="text-muted-foreground mt-1">Configure scholarship cycles, ceilings, and customize system emails.</p>
            </div>

            {/* Notification messages */}
            {successMessage && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center gap-2 animate-slide-in">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">{successMessage}</span>
                </div>
            )}

            {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2 animate-slide-in">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="font-semibold">{errorMessage}</span>
                </div>
            )}

            {/* Main Tabs */}
            <div className="flex gap-2 border-b">
                <button
                    onClick={() => setActiveTab("general")}
                    className={`pb-4 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 transition-all ${activeTab === "general" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                    <Calendar className="h-4 w-4" />
                    Ceilings & Cycle Dates
                </button>
                <button
                    onClick={() => setActiveTab("emails")}
                    className={`pb-4 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 transition-all ${activeTab === "emails" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                    <Mail className="h-4 w-4" />
                    Email Templates
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {activeTab === "general" && (
                    <div className="space-y-6">
                        {/* Scholarship Ceilings Card */}
                        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
                            <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
                                <DollarSign className="h-5 w-5 text-primary" />
                                Scholarship Ceilings (₦)
                            </h2>
                            <p className="text-sm text-muted-foreground">Define the maximum award amount permitted per student level.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Primary School Ceiling</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">₦</span>
                                        <input
                                            type="number"
                                            value={ceilings.Primary}
                                            onChange={(e) => handleCeilingChange("Primary", e.target.value)}
                                            className="w-full pl-7 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Junior Secondary (JSS) Ceiling</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">₦</span>
                                        <input
                                            type="number"
                                            value={ceilings.JSS}
                                            onChange={(e) => handleCeilingChange("JSS", e.target.value)}
                                            className="w-full pl-7 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Senior Secondary (SSS) Ceiling</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">₦</span>
                                        <input
                                            type="number"
                                            value={ceilings.SSS}
                                            onChange={(e) => handleCeilingChange("SSS", e.target.value)}
                                            className="w-full pl-7 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Tertiary Institution Ceiling</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">₦</span>
                                        <input
                                            type="number"
                                            value={ceilings.Tertiary}
                                            onChange={(e) => handleCeilingChange("Tertiary", e.target.value)}
                                            className="w-full pl-7 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Active Cycle Deadlines Card */}
                        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
                            <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                Active Cycle Deadlines
                            </h2>

                            {activeCycle ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-muted/30 border rounded-xl flex items-center justify-between">
                                        <div>
                                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Cycle</span>
                                            <h4 className="font-bold text-lg text-primary">{activeCycle.name} ({activeCycle.year})</h4>
                                        </div>
                                        <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-semibold uppercase">
                                            {activeCycle.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Start Date (Applications Open)</label>
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">End Date (Application Deadline)</label>
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 text-center bg-yellow-50/50 border border-yellow-200 rounded-xl space-y-2">
                                    <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto" />
                                    <h4 className="font-bold text-yellow-800">No Active Cycle Found</h4>
                                    <p className="text-sm text-yellow-700 max-w-md mx-auto">
                                        To set application deadlines, you must first create and activate a cycle in the Scholarship Cycles tab.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "emails" && (
                    <div className="space-y-6">
                        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
                                <Mail className="h-5 w-5 text-primary" />
                                Email Customization
                            </h2>
                            <p className="text-sm text-muted-foreground">Select a trigger below to customize the automated emails sent by the system.</p>

                            {/* Email Subtabs */}
                            <div className="flex flex-wrap gap-2 border-b pb-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveEmailTab("applicant_received")}
                                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${activeEmailTab === "applicant_received" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"}`}
                                >
                                    Applicant Received
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveEmailTab("admin_new_application")}
                                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${activeEmailTab === "admin_new_application" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"}`}
                                >
                                    Admin Notification
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveEmailTab("status_update")}
                                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${activeEmailTab === "status_update" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"}`}
                                >
                                    Status Update
                                </button>
                            </div>

                            {/* Template Editor */}
                            <div className="space-y-4 pt-2">
                                {activeEmailTab === "applicant_received" && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center bg-blue-50/50 border border-blue-100 p-3 rounded-lg">
                                            <p className="text-xs text-blue-800 font-medium flex items-center gap-1">
                                                <HelpCircle className="h-4 w-4" /> Triggered when an applicant submits their scholarship application.
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Subject Line</label>
                                            <input
                                                type="text"
                                                value={emailTemplates.applicant_received.subject}
                                                onChange={(e) => handleTemplateChange("applicant_received", "subject", e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-semibold">Body Content (Plain text / markdown styling)</label>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Placeholders:</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => insertVariable("applicant_received", "body", "{name}")}
                                                        className="px-1.5 py-0.5 border rounded text-[10px] hover:bg-accent bg-card font-mono"
                                                    >
                                                        &#123;name&#125;
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => insertVariable("applicant_received", "body", "{applicationId}")}
                                                        className="px-1.5 py-0.5 border rounded text-[10px] hover:bg-accent bg-card font-mono"
                                                    >
                                                        &#123;applicationId&#125;
                                                    </button>
                                                </div>
                                            </div>
                                            <textarea
                                                rows={8}
                                                value={emailTemplates.applicant_received.body}
                                                onChange={(e) => handleTemplateChange("applicant_received", "body", e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeEmailTab === "admin_new_application" && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center bg-blue-50/50 border border-blue-100 p-3 rounded-lg">
                                            <p className="text-xs text-blue-800 font-medium flex items-center gap-1">
                                                <HelpCircle className="h-4 w-4" /> Triggered when a new application is submitted, alerting the ETF Committee.
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Subject Line</label>
                                            <input
                                                type="text"
                                                value={emailTemplates.admin_new_application.subject}
                                                onChange={(e) => handleTemplateChange("admin_new_application", "subject", e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-semibold">Body Content</label>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Placeholders:</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => insertVariable("admin_new_application", "body", "{applicantName}")}
                                                        className="px-1.5 py-0.5 border rounded text-[10px] hover:bg-accent bg-card font-mono"
                                                    >
                                                        &#123;applicantName&#125;
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => insertVariable("admin_new_application", "body", "{applicationId}")}
                                                        className="px-1.5 py-0.5 border rounded text-[10px] hover:bg-accent bg-card font-mono"
                                                    >
                                                        &#123;applicationId&#125;
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => insertVariable("admin_new_application", "body", "{appLink}")}
                                                        className="px-1.5 py-0.5 border rounded text-[10px] hover:bg-accent bg-card font-mono"
                                                    >
                                                        &#123;appLink&#125;
                                                    </button>
                                                </div>
                                            </div>
                                            <textarea
                                                rows={8}
                                                value={emailTemplates.admin_new_application.body}
                                                onChange={(e) => handleTemplateChange("admin_new_application", "body", e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeEmailTab === "status_update" && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center bg-blue-50/50 border border-blue-100 p-3 rounded-lg">
                                            <p className="text-xs text-blue-800 font-medium flex items-center gap-1">
                                                <HelpCircle className="h-4 w-4" /> Triggered when the ETF Committee approves, rejects, or returns an application.
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Subject Line</label>
                                            <input
                                                type="text"
                                                value={emailTemplates.status_update.subject}
                                                onChange={(e) => handleTemplateChange("status_update", "subject", e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-semibold">Body Content</label>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Placeholders:</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => insertVariable("status_update", "body", "{name}")}
                                                        className="px-1.5 py-0.5 border rounded text-[10px] hover:bg-accent bg-card font-mono"
                                                    >
                                                        &#123;name&#125;
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => insertVariable("status_update", "body", "{status}")}
                                                        className="px-1.5 py-0.5 border rounded text-[10px] hover:bg-accent bg-card font-mono"
                                                    >
                                                        &#123;status&#125;
                                                    </button>
                                                </div>
                                            </div>
                                            <textarea
                                                rows={8}
                                                value={emailTemplates.status_update.body}
                                                onChange={(e) => handleTemplateChange("status_update", "body", e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isSaving} className="w-full md:w-auto px-6 py-5 rounded-xl font-bold flex items-center justify-center gap-2">
                        {isSaving ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Saving Settings...
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                Save Configuration
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
