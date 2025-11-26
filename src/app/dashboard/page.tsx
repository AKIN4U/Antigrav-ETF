"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Clock, CheckCircle, AlertCircle, XCircle, Loader2 } from "lucide-react";

export default function DashboardPage() {
    const [applicant, setApplicant] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await fetch("/api/dashboard");
            const result = await response.json();
            if (result.success) {
                setApplicant(result.data);
            }
        } catch (error) {
            console.error("Error fetching dashboard:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-5xl flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // No application submitted yet
    if (!applicant || !applicant.applications || applicant.applications.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Dashboard</h1>
                </div>
                <div className="bg-card border rounded-lg p-12 shadow-sm text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">No Application Yet</h2>
                    <p className="text-muted-foreground mb-6">
                        You haven't submitted a scholarship application. Start your application to get support for your education.
                    </p>
                    <Link
                        href="/apply/form"
                        className="inline-flex px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
                    >
                        Start New Application
                    </Link>
                </div>
            </div>
        );
    }

    const latestApplication = applicant.applications[0];
    const status = latestApplication.status;

    const getStatusIcon = () => {
        switch (status) {
            case "Pending":
                return <Clock className="h-6 w-6 text-yellow-600" />;
            case "Under Review":
                return <Clock className="h-6 w-6 text-blue-600" />;
            case "Approved":
                return <CheckCircle className="h-6 w-6 text-green-600" />;
            case "Disbursed":
                return <CheckCircle className="h-6 w-6 text-green-600" />;
            case "Rejected":
                return <XCircle className="h-6 w-6 text-red-600" />;
            default:
                return <Clock className="h-6 w-6 text-gray-600" />;
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100";
            case "Under Review":
                return "bg-blue-100";
            case "Approved":
                return "bg-green-100";
            case "Disbursed":
                return "bg-green-100";
            case "Rejected":
                return "bg-red-100";
            default:
                return "bg-gray-100";
        }
    };

    const progressSteps = [
        { label: "Application Submitted", completed: true },
        { label: "Committee Review", completed: ["Under Review", "Approved", "Disbursed"].includes(status), active: status === "Under Review" },
        { label: "Verification", completed: ["Approved", "Disbursed"].includes(status), active: status === "Approved" },
        { label: "Disbursement", completed: status === "Disbursed", active: false },
    ];

    const documents = [
        { name: "School Bill", url: latestApplication.schoolBillUrl },
        { name: "Birth Certificate", url: latestApplication.birthCertUrl },
        { name: "Primary Certificate", url: latestApplication.primaryCertUrl },
        { name: "School Results", url: latestApplication.schoolResultUrl },
        { name: "Assistance Letter", url: latestApplication.assistanceLetterUrl },
    ];

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Dashboard</h1>
                <Link
                    href="/apply/form"
                    className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
                >
                    New Application
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Status Card */}
                <div className="col-span-2 bg-card border rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Application Status</h2>
                    <div className={`flex items-center gap-4 p-4 ${getStatusColor()} rounded-md`}>
                        <div className={`h-12 w-12 rounded-full ${getStatusColor()} flex items-center justify-center`}>
                            {getStatusIcon()}
                        </div>
                        <div>
                            <p className="font-medium text-lg">{status}</p>
                            <p className="text-sm text-muted-foreground">
                                Submitted on {new Date(latestApplication.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {status === "Approved" && latestApplication.approvedAmount && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-sm font-medium text-green-800">
                                Approved Amount: ₦{parseFloat(latestApplication.approvedAmount).toLocaleString()}
                            </p>
                        </div>
                    )}

                    {status === "Disbursed" && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-sm font-medium text-green-800">
                                Disbursed: ₦{parseFloat(latestApplication.approvedAmount || "0").toLocaleString()}
                            </p>
                            {latestApplication.voucherCode && (
                                <p className="text-sm text-green-700 mt-1">
                                    Voucher Code: {latestApplication.voucherCode}
                                </p>
                            )}
                        </div>
                    )}

                    {status === "Rejected" && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm font-medium text-red-800">
                                Your application was not approved at this time.
                            </p>
                        </div>
                    )}

                    <div className="mt-6 space-y-4">
                        {progressSteps.map((step, index) => (
                            <div key={index} className="flex items-center gap-3">
                                {step.completed ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : step.active ? (
                                    <div className="h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center">
                                        <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                                    </div>
                                ) : (
                                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                                )}
                                <span className={`text-sm ${step.completed || step.active ? "font-medium" : "opacity-50"}`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notifications / Actions */}
                <div className="space-y-6">
                    <div className="bg-card border rounded-lg p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-primary" />
                            Action Required
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {status === "Pending" && "Your application is pending review. No action required."}
                            {status === "Under Review" && "Your application is currently under review. No further action is required at this time."}
                            {status === "Approved" && "Your application has been approved! Payment will be processed soon."}
                            {status === "Disbursed" && "Payment has been disbursed to your school."}
                            {status === "Rejected" && "You may contact the committee for more information."}
                        </p>
                    </div>

                    <div className="bg-card border rounded-lg p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-secondary" />
                            Documents
                        </h2>
                        <ul className="space-y-2 text-sm">
                            {documents.map((doc, index) => (
                                <li key={index} className="flex justify-between">
                                    <span className="text-muted-foreground">{doc.name}</span>
                                    {doc.url ? (
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                                            View
                                        </a>
                                    ) : (
                                        <span className="text-red-600">Not Uploaded</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-card border rounded-lg p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-2">School Details</h2>
                        <p className="text-sm text-muted-foreground">{latestApplication.schoolName}</p>
                        <p className="text-sm text-muted-foreground">{latestApplication.presentClass}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
