"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, FileText, Upload, UserCheck, AlertCircle, CheckCircle2, Calendar, DollarSign, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function ApplyPage() {
    const [activeCycle, setActiveCycle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/cycles/active")
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    setActiveCycle(result.data);
                }
            })
            .catch(err => console.error("Error fetching active cycle:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="text-center space-y-6 mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-primary">Bursary Application</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Begin your journey to educational support. Please review the requirements below before starting your application.
                </p>
            </div>

            {/* Active Cycle Status */}
            <div className="mb-12">
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Checking application status...</span>
                    </div>
                ) : activeCycle ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-green-900">Applications are OPEN</h3>
                                <p className="text-green-700">Currently accepting applications for: <strong>{activeCycle.name}</strong></p>
                            </div>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-sm font-medium text-green-800">Deadline</p>
                            <p className="text-2xl font-bold text-green-900">
                                {format(new Date(activeCycle.endDate), "MMMM d, yyyy")}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                                <AlertCircle className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-amber-900">Applications are CLOSED</h3>
                                <p className="text-amber-700">Check back later for the next scholarship cycle.</p>
                            </div>
                        </div>
                        <div className="text-sm text-amber-800 italic">
                            Expected: Next academic session
                        </div>
                    </div>
                )}
            </div>

            {/* Rest of the content... (I will keep the same content but wrap in the layout) */}
            {/* ... abbreviated for brevity in replace_file_content ... */}

            {/* Keeping original sections but I'll need to specify them exactly for replace_file_content to work */}
            {/* I'll use a larger block or multiple edits if needed, but for now I'll try to replace the whole middle part carefully */}

            <div className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>

                {/* Who Can Apply */}
                <div className="bg-card border rounded-lg p-6 mb-6 shadow-sm">
                    <div className="flex items-start gap-3 mb-4">
                        <Users className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Who Can Apply?</h3>
                            <p className="text-muted-foreground mb-3">To be eligible for the ETF Bursary, you must meet the following criteria:</p>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>Parents/Guardian or student must be member(s) of CCC Central Cathedral Parish</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span><strong>One (1) child per family</strong> - Only one child from each family may receive a bursary at any given time</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>Child must be a genuine student of a public institution (Primary School, Secondary School, University, Polytechnic, or College of Education)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>Parents/Guardian must demonstrate financial need</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>For tertiary students: Maintain a minimum 2.1 CGPA for continued support</span>
                                </li>
                            </ul>
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-800 flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <span><strong>Not Eligible:</strong> Postgraduate and other Higher degree students are NOT eligible for this bursary program.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* What is Funded */}
                <div className="bg-card border rounded-lg p-6 mb-6 shadow-sm">
                    <div className="flex items-start gap-3 mb-4">
                        <DollarSign className="h-6 w-6 text-primary mt-1" />
                        <div className="w-full">
                            <h3 className="text-xl font-semibold mb-2">What is Funded?</h3>
                            <p className="text-muted-foreground mb-4">The bursary covers tuition fees, books, and certificate examination fees, with the following ceilings:</p>

                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-700">₦30,000</div>
                                    <div className="text-sm text-blue-600 font-medium">Primary Schools</div>
                                </div>
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="text-2xl font-bold text-green-700">₦50,000</div>
                                    <div className="text-sm text-green-600 font-medium">JSS & SSS</div>
                                </div>
                                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-700">₦60,000</div>
                                    <div className="text-sm text-purple-600 font-medium">Tertiary Institutions</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Required Documents */}
                <div className="bg-card border rounded-lg p-6 shadow-sm">
                    <div className="flex items-start gap-3 mb-4">
                        <FileText className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Required Documents</h3>
                            <p className="text-muted-foreground mb-3">Please have the following documents ready before starting your application:</p>
                            <ul className="space-y-1 text-sm">
                                <li className="flex items-center gap-2 pb-1 border-b italic">Birth certificate</li>
                                <li className="flex items-center gap-2 pb-1 border-b italic">Last school result</li>
                                <li className="flex items-center gap-2 pb-1 border-b italic">School fee receipt/bill</li>
                                <li className="flex items-center gap-2 pb-1 border-b italic">Passport photo</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-muted/30 p-8 rounded-lg text-center space-y-6">
                <h2 className="text-2xl font-bold">Ready to Apply?</h2>
                {!loading && !activeCycle && (
                    <div className="p-4 bg-amber-100 border border-amber-200 rounded-md text-amber-800 text-sm max-w-md mx-auto">
                        Applications are currently closed. You can still log in to view past applications, but new submissions are not accepted at this time.
                    </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" disabled={!activeCycle}>
                        {activeCycle ? (
                            <Link href="/apply/form">
                                Start New Application <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        ) : (
                            <span className="opacity-50 cursor-not-allowed inline-flex items-center">
                                Start New Application <ArrowRight className="ml-2 h-5 w-5" />
                            </span>
                        )}
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link href="/login">
                            Continue Application
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
