"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, XCircle, FileText, User, GraduationCap, Church, AlertCircle, X, Clock, Calendar } from "lucide-react";
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
    const [refreshKey, setRefreshKey] = useState(0);

    // Approval state
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [approvedAmountInput, setApprovedAmountInput] = useState("");
    const [approvalNotes, setApprovalNotes] = useState("");

    // Verification state
    const [verificationStatus, setVerificationStatus] = useState("Unverified");
    const [checklist, setChecklist] = useState<Record<string, boolean>>({});

    // Interview Management state
    const [interviewDate, setInterviewDate] = useState("");
    const [interviewAttendees, setInterviewAttendees] = useState("");
    const [interviewNotes, setInterviewNotes] = useState("");
    const [isSavingInterview, setIsSavingInterview] = useState(false);

    useEffect(() => {
        if (application) {
            setVerificationStatus((application as any).verificationStatus || "Unverified");
            try {
                setChecklist(JSON.parse((application as any).verificationChecklist || "{}"));
            } catch {
                setChecklist({});
            }

            // Format interview date for datetime-local input (YYYY-MM-DDThh:mm)
            if (application.interviewDate) {
                const dateObj = new Date(application.interviewDate);
                const pad = (n: number) => n.toString().padStart(2, '0');
                const yyyy = dateObj.getFullYear();
                const MM = pad(dateObj.getMonth() + 1);
                const dd = pad(dateObj.getDate());
                const hh = pad(dateObj.getHours());
                const mm = pad(dateObj.getMinutes());
                setInterviewDate(`${yyyy}-${MM}-${dd}T${hh}:${mm}`);
            } else {
                setInterviewDate("");
            }
            setInterviewAttendees(application.interviewAttendees || "");
            setInterviewNotes(application.interviewNotes || "");
        }
    }, [application]);

    const getFileUrl = (path: string | null) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        const projectRef = "meszezrqfjemgclbbwxq";
        return `https://${projectRef}.supabase.co/storage/v1/object/public/documents/${path}`;
    };

    const toggleChecklistItem = async (itemKey: string) => {
        if (!application) return;
        const updatedChecklist = {
            ...checklist,
            [itemKey]: !checklist[itemKey]
        };
        setChecklist(updatedChecklist);
        
        try {
            await fetch(`/api/admin/applications/${params.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    verificationChecklist: JSON.stringify(updatedChecklist)
                })
            });
        } catch (error) {
            console.error("Failed to save verification item:", error);
        }
    };

    const handleVerificationStatusChange = async (newStatus: string) => {
        if (!application) return;
        setVerificationStatus(newStatus);
        try {
            await fetch(`/api/admin/applications/${params.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    verificationStatus: newStatus
                })
            });
            alert(`Verification status updated to: ${newStatus}`);
        } catch (error) {
            console.error("Failed to update verification status:", error);
        }
    };
    const [ceilings, setCeilings] = useState<any>({
        Primary: 30000,
        JSS: 50000,
        SSS: 50000,
        Tertiary: 60000
    });

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const response = await fetch(`/api/admin/applications/${params.id}`);
                const result: ApiResponse<ApplicationDetail> = await response.json() as any;
                if (result.success && result.data) {
                    setApplication(result.data);
                }
            } catch (error) {
                console.error("Error fetching application:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchCeilings = async () => {
            try {
                const res = await fetch("/api/admin/settings");
                const json = await res.json() as any;
                if (json.success && json.data?.ceilings) {
                    setCeilings(json.data.ceilings);
                }
            } catch (error) {
                console.error("Failed to load settings ceilings:", error);
            }
        };

        if (params.id) {
            fetchApplication();
            fetchCeilings();
        }
    }, [params.id]);

    const getCategoryFromClass = (presentClass: string): "Primary" | "JSS" | "SSS" | "Tertiary" => {
        const cls = `${presentClass}`.toLowerCase();
        if (cls.includes("jss") || cls.includes("junior")) return "JSS";
        if (cls.includes("sss") || cls.includes("ss") || cls.includes("senior")) return "SSS";
        if (cls.includes("primary") || cls.includes("pry") || cls.includes("class") || cls.includes("basic") || cls.includes("grade")) return "Primary";
        return "Tertiary";
    };

    const submitApproval = async () => {
        if (!application || !approvedAmountInput) return;
        setIsSaving(true);
        try {
            const response = await fetch(`/api/admin/applications/${params.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: "Approved",
                    approvedAmount: approvedAmountInput,
                    committeeNotes: approvalNotes || undefined
                }),
            });

            if (response.ok) {
                setApplication({ 
                    ...application, 
                    status: "Approved", 
                    approvedAmount: approvedAmountInput,
                    committeeNotes: approvalNotes || null
                });
                setShowApproveModal(false);
                alert("Application Approved successfully!");
                router.refresh();
            } else {
                alert("Failed to approve application.");
            }
        } catch (error) {
            console.error("Error approving application:", error);
            alert("An error occurred.");
        } finally {
            setIsSaving(false);
        }
    };

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

    const handleReturnForCorrection = async () => {
        if (!application) return;

        const correctionNotes = prompt("Please enter the corrections needed (this will be visible to the applicant):");
        if (!correctionNotes || correctionNotes.trim() === "") {
            alert("Correction notes are required.");
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch(`/api/admin/applications/${params.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: "Returned for Correction",
                    committeeNotes: correctionNotes
                }),
            });

            if (response.ok) {
                setApplication({ ...application, status: "Returned for Correction", committeeNotes: correctionNotes });
                alert("Application returned for correction. Applicant will be notified.");
                router.refresh();
            } else {
                alert("Failed to return application for correction.");
            }
        } catch (error) {
            console.error("Error returning application:", error);
            alert("An error occurred.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveInterviewDetails = async () => {
        if (!application) return;
        setIsSavingInterview(true);
        try {
            const formattedDate = interviewDate ? new Date(interviewDate).toISOString() : null;
            const response = await fetch(`/api/admin/applications/${params.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    interviewDate: formattedDate,
                    interviewAttendees: interviewAttendees || null,
                    interviewNotes: interviewNotes || null,
                })
            });

            if (response.ok) {
                setApplication({
                    ...application,
                    interviewDate: formattedDate,
                    interviewAttendees: interviewAttendees || null,
                    interviewNotes: interviewNotes || null,
                });
                alert("Interview details saved successfully!");
                router.refresh();
            } else {
                alert("Failed to save interview details.");
            }
        } catch (error) {
            console.error("Error saving interview details:", error);
            alert("An error occurred while saving interview details.");
        } finally {
            setIsSavingInterview(false);
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
                        application.status === 'Recommended for Award' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        application.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                        application.status === 'Waitlisted' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        application.status === 'Not Recommended' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                            'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}>
                        {application.status}
                    </span>
                    <Button
                        onClick={() => handleStatusUpdate("Recommended for Award")}
                        disabled={isSaving || application.status === "Recommended for Award" || application.status === "Approved"}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <CheckCircle className="h-4 w-4 mr-2" /> Recommend
                    </Button>
                    <Button
                        onClick={() => handleStatusUpdate("Waitlisted")}
                        disabled={isSaving || application.status === "Waitlisted" || application.status === "Approved"}
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                        <Clock className="h-4 w-4 mr-2" /> Waitlist
                    </Button>
                    <Button
                        onClick={() => handleStatusUpdate("Not Recommended")}
                        disabled={isSaving || application.status === "Not Recommended" || application.status === "Approved"}
                        size="sm"
                        className="bg-rose-600 hover:bg-rose-700 text-white"
                    >
                        <XCircle className="h-4 w-4 mr-2" /> Not Recommend
                    </Button>
                    <Button
                        onClick={() => {
                            const cat = getCategoryFromClass(application.presentClass);
                            const ceiling = ceilings[cat] || 60000;
                            const parsed = parseInt(application.schoolFees.replace(/[^0-9]/g, '')) || 0;
                            const recVal = parsed > 0 ? Math.min(parsed, ceiling) : ceiling;
                            
                            setApprovedAmountInput(recVal.toString());
                            setApprovalNotes(application.committeeNotes || "");
                            setShowApproveModal(true);
                        }}
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
                    <Button
                        onClick={handleReturnForCorrection}
                        disabled={isSaving || application.status === "Returned for Correction"}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
                    >
                        <AlertCircle className="h-4 w-4 mr-2" /> Return for Correction
                    </Button>
                </div>
            </div>

            {/* Duplicate Candidate Flagging Banner */}
            {(application as any).duplicates && (application as any).duplicates.length > 0 && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-5 flex gap-4 animate-fade-in mb-4">
                    <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                        <h4 className="font-bold text-base text-red-900">⚠️ Potential Sibling/Family Duplicate Flagged (Rule: One Child per Family)</h4>
                        <p className="text-sm">
                            The system detected other active applications in the same scholarship cycle with identical parent phone numbers, parent names, or student details:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                            {(application as any).duplicates.map((dup: any) => (
                                <div key={dup.id} className="p-3 bg-white border border-red-100 rounded-md shadow-sm text-sm">
                                    <div className="font-semibold text-red-950">
                                        <Link href={`/admin/applications/${dup.id}`} className="underline hover:text-red-800">
                                            {dup.applicant?.surname} {dup.applicant?.firstName}
                                        </Link>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">{dup.schoolName} • {dup.presentClass}</p>
                                    <div className="flex gap-2 items-center mt-2">
                                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">{dup.status}</span>
                                        <span className="text-xs text-muted-foreground">Cycle: {dup.cycleId ? "Active" : "Standard"}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

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
                                { label: "Passport Picture", value: application.passportUrl },
                                { label: "School Bill", value: application.schoolBillUrl },
                                { label: "Birth Certificate", value: application.birthCertUrl },
                                { label: "Primary Certificate", value: application.primaryCertUrl },
                                { label: "School Results", value: application.schoolResultUrl },
                                { label: "Admission Letter", value: application.admissionLetterUrl },
                                { label: "WAEC/NECO Result", value: (application as any).waecCertUrl },
                                { label: "JAMB Slip", value: (application as any).jambSlipUrl },
                                { label: "Assistance Letter", value: application.assistanceLetterUrl },
                            ].filter(doc => doc.value).map((doc, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                                    <span className="text-sm font-medium">{doc.label}</span>
                                    <a 
                                        href={getFileUrl(doc.value)} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-xs bg-primary text-primary-foreground hover:opacity-90 px-3 py-1 rounded-md underline font-medium transition-colors"
                                    >
                                        View File
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Interview Management */}
                    <div className="bg-card border rounded-lg p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold">Interview Management</h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                                    Interview Date & Time
                                </label>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        value={interviewDate}
                                        onChange={(e) => setInterviewDate(e.target.value)}
                                        className="w-full h-10 px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                                    Attendees / Interviewers
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Akin Sowemimo, Father John"
                                    value={interviewAttendees}
                                    onChange={(e) => setInterviewAttendees(e.target.value)}
                                    className="w-full h-10 px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                                    Notes / Feedback
                                </label>
                                <textarea
                                    placeholder="Enter interview notes, performance rating, and feedback..."
                                    value={interviewNotes}
                                    onChange={(e) => setInterviewNotes(e.target.value)}
                                    className="w-full min-h-[100px] px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                                />
                            </div>

                            <Button
                                onClick={handleSaveInterviewDetails}
                                disabled={isSavingInterview}
                                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold flex items-center justify-center gap-2"
                            >
                                {isSavingInterview ? "Saving..." : "Save Interview Details"}
                            </Button>
                        </div>
                    </div>

                    {/* Verification Checklist */}
                    <div className="bg-card border rounded-lg p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <h2 className="text-lg font-semibold">Verification Checklist</h2>
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Verification Status</label>
                            <select
                                value={verificationStatus}
                                onChange={(e) => handleVerificationStatusChange(e.target.value)}
                                className="w-full h-10 px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                            >
                                <option value="Unverified">Unverified</option>
                                <option value="Under Verification">Under Verification</option>
                                <option value="Verification Complete">Verification Complete</option>
                                <option value="Requires More Information">Requires More Information</option>
                            </select>
                        </div>

                        <div className="space-y-2 pt-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Checklist Items</label>
                            {[
                                { key: "passport", label: "Verify Passport Picture match" },
                                { key: "schoolBill", label: "Verify School Fees Bill authenticity" },
                                { key: "birthCert", label: "Verify Birth Certificate age match" },
                                { key: "academic", label: "Verify School Result average grades" },
                                { key: "member", label: "Check Parish / Church Membership ID" },
                            ].map((item) => (
                                <label key={item.key} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md cursor-pointer transition-colors text-sm">
                                    <input
                                        type="checkbox"
                                        checked={checklist[item.key] || false}
                                        onChange={() => toggleChecklistItem(item.key)}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className={checklist[item.key] ? "line-through text-muted-foreground" : "font-medium"}>
                                        {item.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Committee Assessments */}
                    <div className="space-y-6">
                        <div className="bg-card border rounded-lg p-6 shadow-sm">
                            <h2 className="text-lg font-semibold mb-4">My Assessment</h2>
                            <AssessmentForm
                                applicationId={params.id as string}
                                onSuccess={() => {
                                    router.refresh();
                                    setRefreshKey(k => k + 1);
                                }}
                            />
                        </div>

                        {/* List of other assessments */}
                        <div className="bg-card border rounded-lg p-6 shadow-sm">
                            <h2 className="text-lg font-semibold mb-4">Committee Reviews</h2>
                            <AssessmentList applicationId={params.id as string} key={refreshKey} />
                        </div>
                    </div>
                </div>
            </div>
            {/* Approval Modal */}
            {showApproveModal && (() => {
                const category = getCategoryFromClass(application.presentClass);
                return (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-card rounded-2xl border p-6 w-full max-w-md shadow-2xl space-y-4 animate-scale-in">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="text-lg font-bold text-primary">Approve Application</h3>
                                <Button variant="ghost" size="icon" onClick={() => setShowApproveModal(false)} className="h-7 w-7">
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="text-muted-foreground block text-xs uppercase tracking-widest">Scholar Level / Category</span>
                                    <span className="font-semibold text-base">{application.presentClass} (Assigned: <span className="text-primary font-bold">{category}</span>)</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-muted-foreground block text-xs uppercase tracking-widest">Declared School Fees</span>
                                        <span className="font-semibold">₦{parseFloat(application.schoolFees.replace(/[^0-9]/g, ''))?.toLocaleString() || application.schoolFees}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-xs uppercase tracking-widest">System Ceiling Limit</span>
                                        <span className="font-semibold text-orange-600">₦{ceilings[category]?.toLocaleString()}</span>
                                    </div>
                                </div>
                                <hr className="border-muted/50" />
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold">Approved Amount (₦) *</label>
                                    <input
                                        type="number"
                                        value={approvedAmountInput}
                                        onChange={(e) => setApprovedAmountInput(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                    {parseInt(approvedAmountInput) > ceilings[category] && (
                                        <p className="text-xs text-yellow-600 flex items-center gap-1 mt-1 bg-yellow-50 p-1.5 rounded border border-yellow-200">
                                            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                                            Warning: Exceeds standard ceiling of ₦{ceilings[category]?.toLocaleString()} for {category}.
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold">Approval Notes / Committee Decision</label>
                                    <textarea
                                        value={approvalNotes}
                                        onChange={(e) => setApprovalNotes(e.target.value)}
                                        placeholder="Enter any notes, specific criteria met, or remarks..."
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[60px]"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" className="flex-1" onClick={() => setShowApproveModal(false)}>
                                    Cancel
                                </Button>
                                <Button 
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold" 
                                    onClick={submitApproval}
                                    disabled={!approvedAmountInput || isSaving}
                                >
                                    {isSaving ? "Approving..." : "Confirm Approval"}
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}