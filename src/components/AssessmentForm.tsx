"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AssessmentFormProps {
    applicationId: string;
    existingAssessment?: any;
    onSuccess?: () => void;
}

export default function AssessmentForm({ applicationId, existingAssessment, onSuccess }: AssessmentFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [scores, setScores] = useState({
        financialScore: 0,
        academicScore: 0,
        churchScore: 0,
        notes: "",
    });

    // Load existing assessment if not provided via props
    useEffect(() => {
        if (existingAssessment) {
            setScores({
                financialScore: existingAssessment.financialScore || 0,
                academicScore: existingAssessment.academicScore || 0,
                churchScore: existingAssessment.churchScore || 0,
                notes: existingAssessment.notes || "",
            });
            return;
        }

        const loadMyAssessment = async () => {
            try {
                const res = await fetch(`/api/assessments?applicationId=${applicationId}`);
                if (res.ok) {
                    const data = await res.json();
                    // API returns list, find ours (should be only one due to server filtering)
                    // But server returns { assessments: [] }
                    if (data.assessments && data.assessments.length > 0) {
                        const mine = data.assessments[0];
                        setScores({
                            financialScore: mine.financialScore || 0,
                            academicScore: mine.academicScore || 0,
                            churchScore: mine.churchScore || 0,
                            notes: mine.notes || "",
                        });
                    }
                }
            } catch (e) {
                console.error("Failed to load existing assessment", e);
            }
        };

        loadMyAssessment();
    }, [applicationId, existingAssessment]);

    const totalScore = (Number(scores.financialScore) || 0) + (Number(scores.academicScore) || 0) + (Number(scores.churchScore) || 0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setScores((prev) => ({
            ...prev,
            [name]: name === "notes" ? value : Number(value),
        }));
        // Clear messages when user types
        if (error) setError(null);
        if (successMessage) setSuccessMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const res = await fetch("/api/assessments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    applicationId,
                    ...scores,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to submit assessment");
            }

            setSuccessMessage("Assessment submitted");
            router.refresh();
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold">Committee Assessment</h3>

            {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-md text-sm">
                    {successMessage}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="financialScore">Financial Need (0-100)</Label>
                    <Input
                        id="financialScore"
                        type="number"
                        name="financialScore"
                        min="0"
                        max="100"
                        value={scores.financialScore}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="academicScore">Academic Perf. (0-100)</Label>
                    <Input
                        id="academicScore"
                        type="number"
                        name="academicScore"
                        min="0"
                        max="100"
                        value={scores.academicScore}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="churchScore">Church Part. (0-100)</Label>
                    <Input
                        id="churchScore"
                        type="number"
                        name="churchScore"
                        min="0"
                        max="100"
                        value={scores.churchScore}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center bg-muted/50 p-3 rounded-md">
                    <span className="font-medium text-muted-foreground">Total Score:</span>
                    <span className="text-xl font-bold text-primary">{totalScore}</span>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Committee Notes / Comments</Label>
                <Textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={scores.notes}
                    onChange={handleChange}
                    placeholder="Enter your observations..."
                />
            </div>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save Assessment"}
                </Button>
            </div>
        </form>
    );
}