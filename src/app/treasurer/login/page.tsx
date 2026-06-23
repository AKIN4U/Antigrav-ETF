"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Landmark } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TreasurerLoginPage() {
    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        let isMounted = true;
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user && isMounted) {
                try {
                    const statusResponse = await fetch("/api/admin/users/check-status");
                    const statusData = await statusResponse.json();
                    if (isMounted) {
                        if (statusResponse.ok && statusData.approved && (statusData.role === "Treasurer" || statusData.role === "SuperAdmin")) {
                            router.push("/treasurer/dashboard");
                        } else {
                            setCheckingAuth(false);
                        }
                    }
                } catch (err) {
                    if (isMounted) setCheckingAuth(false);
                }
            } else if (isMounted) {
                setCheckingAuth(false);
            }
        };
        checkUser();
        return () => {
            isMounted = false;
        };
    }, [supabase, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                return;
            }

            // Check if user is approved and verify they have the Treasurer role
            const statusResponse = await fetch("/api/admin/users/check-status");
            const statusData = await statusResponse.json();

            if (!statusResponse.ok || !statusData.approved) {
                await supabase.auth.signOut();
                if (statusData.status === "Pending") {
                    setError("Your account is pending approval by a Super Admin.");
                } else {
                    setError("You are not authorized to access this portal.");
                }
                return;
            }

            if (statusData.role !== "Treasurer" && statusData.role !== "SuperAdmin") {
                await supabase.auth.signOut();
                setError("Access Denied: You do not have the Treasurer role.");
                return;
            }

            router.push("/treasurer/dashboard");
            router.refresh();
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (checkingAuth) {
        return (
            <div className="container flex h-screen w-screen flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-tr from-blue-50 via-indigo-50 to-slate-50">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-indigo-100">
                <div className="flex flex-col space-y-2 text-center items-center">
                    <div className="h-14 w-14 bg-indigo-100/80 rounded-full flex items-center justify-center mb-2 shadow-inner">
                        <Landmark className="h-7 w-7 text-indigo-700 animate-pulse" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">Treasurer Portal</h1>
                    <p className="text-sm text-muted-foreground max-w-xs">
                        Educational Trust Fund disbursements and financial sign-off.
                    </p>
                </div>
                <div className="grid gap-6">
                    <form onSubmit={handleLogin}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-slate-700 font-medium">Treasurer Email</Label>
                                <Input
                                    id="email"
                                    placeholder="treasurer@ccchet.org"
                                    type="email"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    required
                                    className="border-indigo-100 focus:border-indigo-500 focus:ring-indigo-500 h-11"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    disabled={isLoading}
                                    required
                                    className="border-indigo-100 focus:border-indigo-500 focus:ring-indigo-500 h-11"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {error && (
                                <div className="text-sm text-red-600 font-medium bg-red-50 border border-red-100 rounded-lg py-2.5 px-3 text-center">
                                    {error}
                                </div>
                            )}
                            <Button
                                type="submit"
                                className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-semibold h-11 rounded-lg transition-all shadow-md hover:shadow-indigo-200"
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Secure Sign-in
                            </Button>
                        </div>
                    </form>
                </div>
                <div className="text-center text-xs text-muted-foreground border-t pt-4">
                    <Link href="/" className="hover:text-indigo-700 underline underline-offset-4 font-medium transition-colors">
                        Return to Public Portal
                    </Link>
                </div>
            </div>
        </div>
    );
}
