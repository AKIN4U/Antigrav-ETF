"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const supabase = createClient();

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/api/auth/callback?type=recovery`,
            });

            if (error) {
                setError(error.message);
            } else {
                setMessage("Check your email for the password reset link.");
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
                        <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Forgot Password</h1>
                    <p className="text-sm text-muted-foreground whitespace-normal max-w-[300px]">
                        Enter your email address and we&apos;ll send you a link to reset your password.
                    </p>
                </div>

                <div className="grid gap-6 bg-card p-6 border rounded-lg shadow-sm">
                    {message ? (
                        <div className="space-y-4 text-center py-4">
                            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
                                {message}
                            </div>
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center text-sm font-medium hover:text-primary transition-colors underline underline-offset-4"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Return to login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleResetRequest}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none" htmlFor="email">
                                        Email Address
                                    </label>
                                    <input
                                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        id="email"
                                        placeholder="name@example.com"
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
                                    Send Reset Link
                                </button>
                                <Link
                                    href="/login"
                                    className="text-center text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Return to login
                                </Link>
                            </div>
                        </form>
                    )}
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
