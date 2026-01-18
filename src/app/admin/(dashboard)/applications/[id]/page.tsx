"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, XCircle, FileText, User, GraduationCap, Church } from "lucide-react";
import AssessmentForm from "@/components/AssessmentForm";
import AssessmentList from "@/components/AssessmentList";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ApplicationDetail, ApiResponse } from "@/types";
import { Button } from "@/components/ui/button";

export default function ApplicationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [application, setApplication] = useState<ApplicationDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const response = await fetch(`/api/admin/applications/${params.id}`);
                const result: ApiResponse<ApplicationDetail> = await response.json();
                if (result.success && result.data) {
                    setApplication(result.data);
                }
            } catch (error) {
                console.error("Error fetching application:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchApplication();
        }
    }, [params.id]);

    const handleStatusUpdate = async (newStatus: string) => {
        if (!application) return;
        if (!confirm(`Are you sure you want to ${newStatus} this application?`)) return;

        setIsSaving(true);
        try {
            const response = await fetch(`/api/admin/applications/${params.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                setApplication({ ...application, status: newStatus });
                alert(`Application ${newStatus} successfully!`);
                router.refresh();
            } else {
                alert("Failed to update status.");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("An error occurred.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading application details...</div>;
    }

    if (!application) {
        return <div className="p-8 text-center">Application not found.</div>;
    }

    const { applicant } = application;
    const { familyInfo } = applicant;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
                <Button asChild variant="ghost" size="icon" className="h-9 w-9">
                    <Link href="/admin/applications">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-primary">
                        {applicant.surname} {applicant.firstName}
                    </h1>
                    <p className="text-muted-foreground">
                        {application.schoolName} • {application.presentClass}
                    </p>
                </div>
                <div className="ml-auto flex gap-2 items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${application.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
                        application.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                            'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}>
                        {application.status}
                    </span>
                    <Button
                        onClick={() => handleStatusUpdate("Approved")}
                        disabled={isSaving || application.status === "Approved"}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <CheckCircle className="h-4 w-4 mr-2" /> Approve
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleStatusUpdate("Rejected")}
                        disabled={isSaving || application.status === "Rejected"}
                    >
                        <XCircle className="h-4 w-4 mr-2" /> Reject
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Info */}
                    <div className="bg-card border rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 border-b pb-2">
                            <User className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold">Personal Information</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Full Name</p>
                                <p className="font-medium">{applicant.surname} {applicant.firstName} {applicant.middleName}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Date of Birth</p>
                                <p className="font-medium">{new Date(applicant.dob).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Gender</p>
                                <p className="font-medium">{applicant.sex}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">State of Origin</p>
                                <p className="font-medium">{applicant.stateOrigin}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">LGA</p>
                                <p className="font-medium">{applicant.lga}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Town</p>
                                <p className="font-medium">{applicant.town}</p>
                            </div>
                        </div>
                    </div>

                    {/* Academic Info */}
                    <div className="bg-card border rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 border-b pb-2">
                            <GraduationCap className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold">Academic Information</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">School Name</p>
                                <p className="font-medium">{application.schoolName}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">School Address</p>
                                <p className="font-medium">{application.schoolAddress}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Present Class</p>
                                <p className="font-medium">{application.presentClass}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">School Fees</p>
                                <p className="font-medium">{application.schoolFees}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Last Result</p>
                                <p className="font-medium">{application.lastResult || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Family Info */}
                    {familyInfo && (
                        <div className="bg-card border rounded-lg p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 border-b pb-2">
                                <Church className="h-5 w-5 text-primary" />
                                <h2 className="text-lg font-semibold">Family & Church Info</h2>
                            </div>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <h3 className="font-medium text-primary mb-2">Father</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <p><span className="text-muted-foreground">Name:</span> {familyInfo.fatherSurname} {familyInfo.fatherFirstName}</p>
                                        <p><span className="text-muted-foreground">Phone:</span> {familyInfo.fatherPhone}</p>
                                        <p><span className="text-muted-foreground">Occupation:</span> {familyInfo.fatherOccupation}</p>
                                        <p><span className="text-muted-foreground">Church Position:</span> {familyInfo.fatherChurchPosition}</p>
                                    </div>
                                </div>
                                <div className="border-t pt-2">
                                    <h3 className="font-medium text-primary mb-2">Mother</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <p><span className="text-muted-foreground">Name:</span> {familyInfo.motherSurname} {familyInfo.motherFirstName}</p>
                                        <p><span className="text-muted-foreground">Phone:</span> {familyInfo.motherPhone}</p>
                                        <p><span className="text-muted-foreground">Occupation:</span> {familyInfo.motherOccupation}</p>
                                        <p><span className="text-muted-foreground">Church Position:</span> {familyInfo.motherChurchPosition}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    {/* Documents */}
                    <div className="bg-card border rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 border-b pb-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold">Documents</h2>
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: "School Bill", value: application.schoolBillUrl },
                                { label: "Admission Letter", value: application.admissionLetterUrl },
                                { label: "Passport", value: application.passportUrl },
                                { label: "Birth Certificate", value: application.birthCertUrl },
                                { label: "School Results", value: application.schoolResultUrl },
                            ].map((doc, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                                    <span className="text-sm font-medium">{doc.label}</span>
                                    {doc.value ? (
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Uploaded</span>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">Pending</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Committee Assessments */}
                    <div className="space-y-6">
                        <div className="bg-card border rounded-lg p-6 shadow-sm">
                            <h2 className="text-lg font-semibold mb-4">My Assessment</h2>
                            <AssessmentForm applicationId={params.id as string} onSuccess={() => router.refresh()} />
                        </div>

                        {/* List of other assessments (could be restricted to admins in future) */}
                        <div className="bg-card border rounded-lg p-6 shadow-sm">
                            <h2 className="text-lg font-semibold mb-4">Committee Reviews</h2>
                            <AssessmentList applicationId={params.id as string} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}