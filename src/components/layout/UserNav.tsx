"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import { LogOut, LayoutDashboard, Loader2 } from "lucide-react";

export function UserNav() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<string>("Applicant");
    const router = useRouter();
    const supabase = createClient();

    const getDisplayRole = (roleKey: string) => {
        switch (roleKey) {
            case "SuperAdmin":
                return "Super Admin";
            case "Admin":
                return "Committee Admin";
            case "Committee":
                return "Committee Member";
            case "Treasurer":
                return "Treasurer";
            case "ParochialCommittee":
                return "Parochial Committee";
            case "GeneralSecretary":
                return "General Secretary";
            case "Applicant":
                return "Applicant";
            default:
                return roleKey ? roleKey.charAt(0).toUpperCase() + roleKey.slice(1) : "Applicant";
        }
    };

    useEffect(() => {
        const fetchUserRole = async (currentUser: User) => {
            try {
                const metaRole = currentUser.user_metadata?.role;
                if (metaRole) {
                    setRole(metaRole);
                }
                
                const res = await fetch("/api/admin/users/check-status");
                if (res.ok) {
                    const data = await res.json();
                    if (data.role) {
                        setRole(data.role);
                    }
                } else if (!metaRole) {
                    setRole("Applicant");
                }
            } catch (err) {
                if (!currentUser.user_metadata?.role) {
                    setRole("Applicant");
                }
            }
        };

        const getUserInfo = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (currentUser) {
                setUser(currentUser);
                await fetchUserRole(currentUser);
            } else {
                setUser(null);
                setRole("Applicant");
            }
            setLoading(false);
        };

        getUserInfo();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                fetchUserRole(currentUser);
            } else {
                setRole("Applicant");
            }
            setLoading(false);
            router.refresh();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, router]);

    const handleSignOut = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    if (loading) {
        return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
    }

    if (user) {
        const getDashboardHref = () => {
            if (role === 'SuperAdmin' || role === 'Admin' || role === 'Committee') {
                return "/admin/dashboard";
            }
            if (role === 'Treasurer') {
                return "/treasurer/dashboard";
            }
            return "/dashboard";
        };

        return (
            <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-medium">{user.user_metadata?.name || user.email}</span>
                    <span className="text-xs text-muted-foreground capitalize">{getDisplayRole(role)}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href={getDashboardHref()}
                        className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                        title="Dashboard"
                    >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Dashboard</span>
                    </Link>

                    <button
                        onClick={handleSignOut}
                        className="inline-flex h-9 items-center justify-center rounded-md bg-destructive/10 px-3 text-sm font-medium text-destructive shadow-sm transition-colors hover:bg-destructive/20"
                        title="Sign Out"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <Link
                href="/login"
                className="text-sm font-medium hover:text-primary transition-colors"
            >
                Log In
            </Link>
            <Link
                href="/register"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
                Get Started
            </Link>
        </div>
    );
}
