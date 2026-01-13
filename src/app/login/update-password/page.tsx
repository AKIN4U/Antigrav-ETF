"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, KeyRound, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const supabase = createClient();

    // Check if we have a session (the callback should have set one)
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // If no session, they shouldn't be here
                // Note: In some Supabase configs, the session is already active here
                // if they came from the recovery link.
            }
        };
        checkSession();
    }, [supabase]);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                setError(error.message);
            } else {
                setIsSuccess(true);
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            }
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center bg-muted/20 px-4">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                <div className="flex flex-col space-y-2 text-center items-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <KeyRound className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Set New Password</h1>
                    <p className="text-sm text-muted-foreground">
                        Please enter your new password below.
                    </p>
                </div>

                <div className="grid gap-6 bg-card p-6 border rounded-lg shadow-sm">
                    {isSuccess ? (
                        <div className="space-y-4 text-center py-4">
                            <div className="flex justify-center mb-2">
                                <CheckCircle2 className="h-12 w-12 text-green-500 animate-in zoom-in duration-300" />
                            </div>
                            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm font-medium">
                                Password successfully updated!
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Redirecting you to login in a few seconds...
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center text-sm font-medium text-primary hover:underline underline-offset-4"
                            >
                                Go to login now
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdatePassword}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none" htmlFor="password">
                                        New Password
                                    </label>
                                    <input
                                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        id="password"
                                        placeholder="••••••••"
                                        type="password"
                                        disabled={isLoading}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none" htmlFor="confirm-password">
                                        Confirm New Password
                                    </label>
                                    <input
                                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        id="confirm-password"
                                        placeholder="••••••••"
                                        type="password"
                                        disabled={isLoading}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                {error && (
                                    <div className="text-sm text-red-500 text-center font-medium">
                                        {error}
                                    </div>
                                )}
                                <button
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2"
                                    disabled={isLoading}
                                >
                                    {isLoading && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Update Password
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
