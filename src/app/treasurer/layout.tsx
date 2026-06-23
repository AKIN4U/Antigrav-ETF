"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Landmark, LogOut, Loader2, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function TreasurerLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const checkAuth = async () => {
            if (pathname === "/treasurer/login") {
                setIsLoading(false);
                return;
            }

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/treasurer/login");
                return;
            }

            // Verify user status and Treasurer role
            try {
                const res = await fetch("/api/admin/users/check-status");
                const data = await res.json();

                if (!res.ok || !data.approved || (data.role !== "Treasurer" && data.role !== "SuperAdmin")) {
                    await supabase.auth.signOut();
                    router.push("/treasurer/login");
                    return;
                }

                setUserEmail(user.email ?? null);
            } catch (err) {
                console.error("Auth check failed:", err);
                router.push("/treasurer/login");
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [pathname, router, supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/treasurer/login");
    };

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
                <div className="text-center space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-700 mx-auto" />
                    <p className="text-sm font-medium text-slate-600">Verifying credentials...</p>
                </div>
            </div>
        );
    }

    if (pathname === "/treasurer/login") {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-slate-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-6 shadow-xl z-20">
                <div className="space-y-8">
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
                        <div className="h-10 w-10 bg-indigo-700 rounded-lg flex items-center justify-center shadow-md">
                            <Landmark className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-lg leading-tight block">CCC ETF</span>
                            <span className="text-xs text-indigo-400 font-semibold tracking-wider uppercase">Treasurer</span>
                        </div>
                    </div>

                    <nav className="space-y-1.5">
                        <Link
                            href="/treasurer/dashboard"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                pathname === "/treasurer/dashboard"
                                    ? "bg-indigo-700 text-white shadow-md shadow-indigo-900/30"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`}
                        >
                            <Landmark className="h-4 w-4" />
                            Disbursements Log
                        </Link>
                    </nav>
                </div>

                <div className="border-t border-slate-800 pt-5 space-y-4">
                    <div className="flex items-center gap-3 px-2">
                        <div className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                            <User className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs text-slate-500 font-medium truncate">Logged in as</p>
                            <p className="text-sm text-slate-300 font-bold truncate">{userEmail}</p>
                        </div>
                    </div>

                    <Button
                        onClick={handleSignOut}
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-800 px-4 py-3 h-auto rounded-lg text-sm font-medium transition-colors"
                    >
                        <LogOut className="h-4 w-4 mr-3" />
                        Secure Sign-out
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Landmark className="h-5 w-5 text-indigo-700" />
                        <span className="font-semibold text-slate-700">Educational Trust Fund Disbursements Dashboard</span>
                    </div>
                </header>
                <div className="p-8 max-w-7xl w-full mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
