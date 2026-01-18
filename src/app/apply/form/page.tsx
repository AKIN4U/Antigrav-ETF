"use client";

import { useState } from "react";
import { StepIndicator } from "@/components/apply/StepIndicator";
import { PersonalInfoStep } from "@/components/apply/PersonalInfoStep";
import { AcademicInfoStep } from "@/components/apply/AcademicInfoStep";
import { FamilyInfoStep } from "@/components/apply/FamilyInfoStep";
import { DocumentUploadStep } from "@/components/apply/DocumentUploadStep";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = ["Personal Info", "Academic Info", "Family Info", "Documents", "Review"];

export default function ApplicationFormPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({});

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
        setIsLoading(true);
        try {
            const response = await fetch("/api/apply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
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
        setFormData((prev) => ({ ...prev, ...data }));
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-bold text-center mb-8">Scholarship Application</h1>
            <StepIndicator steps={STEPS} currentStep={currentStep} />

            <div className="bg-card border rounded-lg p-6 shadow-sm min-h-[400px]">
                {currentStep === 0 && <PersonalInfoStep updateData={updateFormData} data={formData} />}
                {currentStep === 1 && <AcademicInfoStep updateData={updateFormData} data={formData} />}
                {currentStep === 2 && <FamilyInfoStep updateData={updateFormData} data={formData} />}
                {currentStep === 3 && <DocumentUploadStep updateData={updateFormData} data={formData} />}
                {currentStep === 4 && (
                    <div className="text-center space-y-4">
                        <h2 className="text-xl font-semibold">Review Application</h2>
                        <p className="text-muted-foreground">Please review your details before submitting.</p>
                        <pre className="text-left bg-muted p-4 rounded-md overflow-auto text-xs max-h-[400px]">
                            {JSON.stringify(formData, null, 2)}
                        </pre>
                    </div>
                )}
            </div>

            <div className="flex justify-between mt-8">
                <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0 || isLoading}
                >
                    Back
                </Button>
                <Button onClick={handleNext} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {currentStep === STEPS.length - 1 ? "Submit Application" : "Next Step"}
                </Button>
            </div>
        </div>
    );
}