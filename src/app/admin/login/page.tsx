"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

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

            // Check if user is approved
            const statusResponse = await fetch("/api/admin/users/check-status");
            const statusData = await statusResponse.json();

            if (!statusResponse.ok || !statusData.approved) {
                // Sign out the user
                await supabase.auth.signOut();

                if (statusData.status === "Pending") {
                    setError("Your account is pending approval by a Super Admin. Please wait for confirmation.");
                } else if (statusData.status === "Rejected") {
                    setError("Your account registration has been rejected. Please contact support.");
                } else {
                    setError("You are not authorized to access this portal.");
                }
                return;
            }

            router.push("/admin/applications");
            router.refresh();
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center bg-muted/20">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center items-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Committee Access</h1>
                    <p className="text-sm text-muted-foreground">
                        Authorized personnel only. Please sign in.
                    </p>
                </div>
                <div className="grid gap-6 bg-card p-6 border rounded-lg shadow-sm">
                    <form onSubmit={handleLogin}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Official Email</Label>
                                <Input
                                    id="email"
                                    placeholder="committee@ccchet.org"
                                    type="email"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    disabled={isLoading}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {error && (
                                <div className="text-sm text-red-500 text-center">
                                    {error}
                                </div>
                            )}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Access Dashboard
                            </Button>
                        </div>
                    </form>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-primary underline underline-offset-4">
                        Return to Public Portal
                    </Link>
                </div>
            </div>
        </div>
    );
}