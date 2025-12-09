"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";
import { LogOut, User as UserIcon, LayoutDashboard, Loader2 } from "lucide-react";

export function UserNav() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
            router.refresh(); // Refresh server components when auth state changes
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
        return (
            <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-medium">{user.user_metadata?.name || user.email}</span>
                    <span className="text-xs text-muted-foreground capitalize">{user.user_metadata?.role || 'User'}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href={user.user_metadata?.role === 'SuperAdmin' || user.user_metadata?.role === 'Admin' ? "/admin/dashboard" : "/dashboard"}
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
