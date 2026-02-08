"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { StepIndicator } from "@/components/apply/StepIndicator";
import { PersonalInfoStep } from "@/components/apply/PersonalInfoStep";
import { AcademicInfoStep } from "@/components/apply/AcademicInfoStep";
import { FamilyInfoStep } from "@/components/apply/FamilyInfoStep";
import { DocumentUploadStep } from "@/components/apply/DocumentUploadStep";
import { Loader2, Save } from "lucide-react";

const STEPS = ["Personal Info", "Academic Info", "Family Info", "Documents", "Review"];

export default function ApplicationFormPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [draftId, setDraftId] = useState<string | null>(null);
    const [draftLoaded, setDraftLoaded] = useState(false);
    const [consentData, setConsentData] = useState(false);
    const [consentTerms, setConsentTerms] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkUserStatus = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                // Check if user is a committee member
                try {
                    const response = await fetch("/api/admin/users/check-status");
                    if (response.ok) {
                        const data = await response.json();
                        if (data.approved) {
                            alert("Creating an application is restricted for committee members.");
                            router.push("/admin/dashboard");
                        }
                    }
                } catch (error) {
                    console.error("Error checking user status:", error);
                }

                // Load existing draft if available
                if (!draftLoaded) {
                    loadDraft();
                }
            }
        };
        checkUserStatus();
    }, [router, supabase, draftLoaded]);

    const loadDraft = async () => {
        try {
            const response = await fetch("/api/apply/draft");
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.draft) {
                    setFormData(result.draft);
                    setDraftId(result.draft.draftId);
                    console.log("Draft loaded successfully");
                }
            }
        } catch (error) {
            console.error("Error loading draft:", error);
        } finally {
            setDraftLoaded(true);
        }
    };

    const handleSaveDraft = async () => {
        setIsSavingDraft(true);
        try {
            const response = await fetch("/api/apply/draft", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData, draftId }),
            });

            const result = await response.json();

            if (result.success) {
                setDraftId(result.draftId);
                alert("Draft saved successfully! You can continue later.");
            } else {
                alert("Failed to save draft: " + result.error);
            }
        } catch (error) {
            console.error("Error saving draft:", error);
            alert("An error occurred while saving draft.");
        } finally {
            setIsSavingDraft(false);
        }
    };

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        // Validate consent checkboxes
        if (!consentData || !consentTerms) {
            alert("Please accept both consent checkboxes before submitting your application.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/apply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData, draftId }),
            });

            const result = await response.json();

            if (result.success) {
                alert("Application Submitted Successfully! ID: " + result.applicantId);
                // Ideally redirect to dashboard or success page
                window.location.href = "/dashboard";
            } else {
                alert("Failed to submit application: " + result.error);
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("An error occurred during submission.");
        } finally {
            setIsLoading(false);
        }
    };

    const updateFormData = (data: any) => {
        setFormData((prev: any) => ({ ...prev, ...data }));
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Bursary Application</h1>
                <button
                    onClick={handleSaveDraft}
                    disabled={isSavingDraft}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 text-sm"
                >
                    {isSavingDraft ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                    Save as Draft
                </button>
            </div>

            {draftId && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                    <strong>Draft loaded:</strong> You can continue from where you left off.
                </div>
            )}

            <StepIndicator steps={STEPS} currentStep={currentStep} />

            <div className="bg-card border rounded-lg p-6 shadow-sm min-h-[400px]">
                {currentStep === 0 && <PersonalInfoStep updateData={updateFormData} data={formData} />}
                {currentStep === 1 && <AcademicInfoStep updateData={updateFormData} data={formData} />}
                {currentStep === 2 && <FamilyInfoStep updateData={updateFormData} data={formData} />}
                {currentStep === 3 && <DocumentUploadStep updateData={updateFormData} data={formData} />}
                {currentStep === 4 && (
                    <div className="space-y-6">
                        <div className="text-center space-y-4">
                            <h2 className="text-xl font-semibold">Review Application</h2>
                            <p className="text-muted-foreground">Please review your details before submitting.</p>
                            <pre className="text-left bg-muted p-4 rounded-md overflow-auto text-xs max-h-[300px]">
                                {JSON.stringify(formData, null, 2)}
                            </pre>
                        </div>

                        {/* Consent Checkboxes */}
                        <div className="border-t pt-6 space-y-4">
                            <h3 className="font-semibold text-lg">Required Consents</h3>

                            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-md">
                                <input
                                    type="checkbox"
                                    id="consentData"
                                    checked={consentData}
                                    onChange={(e) => setConsentData(e.target.checked)}
                                    className="mt-1 h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="consentData" className="text-sm cursor-pointer">
                                    <strong>Data Processing Consent:</strong> I consent to the collection, processing, and storage of my personal data for the purpose of this bursary application. I understand that my data will be handled in accordance with the <a href="/privacy" target="_blank" className="text-primary underline">Privacy Policy</a>.
                                </label>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-md">
                                <input
                                    type="checkbox"
                                    id="consentTerms"
                                    checked={consentTerms}
                                    onChange={(e) => setConsentTerms(e.target.checked)}
                                    className="mt-1 h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="consentTerms" className="text-sm cursor-pointer">
                                    <strong>Terms of Use:</strong> I have read and agree to the <a href="/terms" target="_blank" className="text-primary underline">Terms of Use</a>. I understand that providing false information may result in disqualification and that only one child per family may receive a bursary at any given time.
                                </label>
                            </div>

                            {(!consentData || !consentTerms) && (
                                <p className="text-sm text-red-600">
                                    * Both consents are required to submit your application.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between mt-8">
                <button
                    onClick={handleBack}
                    disabled={currentStep === 0 || isLoading}
                    className="px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                >
                    Back
                </button>
                <button
                    onClick={handleNext}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center"
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {currentStep === STEPS.length - 1 ? "Submit Application" : "Next Step"}
                </button>
            </div>
        </div>
    );
}
