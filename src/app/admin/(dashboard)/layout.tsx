"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, FileText, CreditCard, Settings, LogOut, BarChart3, Wallet, Heart, Shield, Menu, X, ClipboardCheck, GraduationCap } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigationLinks = [
        { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/admin/assessments", icon: ClipboardCheck, label: "Assessments" },
        { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
        { href: "/admin/audit-logs", icon: ClipboardCheck, label: "Audit Logs" },
        { href: "/admin/alumni", icon: GraduationCap, label: "Alumni" },
        { href: "/admin/applications", icon: FileText, label: "Applications" },
        { href: "/admin/beneficiaries", icon: Users, label: "Beneficiaries" },
        { href: "/admin/disbursements", icon: CreditCard, label: "Disbursements" },
        { href: "/admin/reports", icon: BarChart3, label: "Reports" },
        { href: "/admin/finance", icon: Wallet, label: "Finance" },
        { href: "/admin/donations", icon: Heart, label: "Donations" },
        { href: "/admin/users", icon: Shield, label: "Committee Members" },
        { href: "/admin/settings", icon: Settings, label: "Settings" },
    ];

    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b z-40 flex items-center justify-between px-4">
                <div>
                    <h1 className="text-lg font-bold text-primary">ETF Admin</h1>
                    <p className="text-xs text-muted-foreground">Committee Portal</p>
                </div>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 hover:bg-accent rounded-md transition-colors"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Desktop & Mobile Drawer */}
            <aside
                className={`
                    w-64 bg-card border-r flex flex-col z-50
                    md:fixed md:h-full
                    fixed h-full transition-transform duration-300 ease-in-out
                    ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                <div className="p-6 border-b hidden md:block">
                    <h1 className="text-xl font-bold text-primary">ETF Admin</h1>
                    <p className="text-xs text-muted-foreground">Committee Portal</p>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-16 md:mt-0">
                    {navigationLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            <link.icon className="h-5 w-5" />
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 pt-16 md:pt-0">
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
