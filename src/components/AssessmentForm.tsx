"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface AssessmentFormProps {
    applicationId: string;
    existingAssessment?: any;
    onSuccess?: () => void;
}

export default function AssessmentForm({ applicationId, existingAssessment, onSuccess }: AssessmentFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [scores, setScores] = useState({
        financialScore: existingAssessment?.financialScore || 0,
        academicScore: existingAssessment?.academicScore || 0,
        churchScore: existingAssessment?.churchScore || 0,
        notes: existingAssessment?.notes || "",
    });

    const totalScore = (Number(scores.financialScore) || 0) + (Number(scores.academicScore) || 0) + (Number(scores.churchScore) || 0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setScores((prev) => ({
            ...prev,
            [name]: name === "notes" ? value : Number(value),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

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

            router.refresh();
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Committee Assessment</h3>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm dark:bg-red-900/30 dark:text-red-400">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                        Financial Need (0-100)
                    </label>
                    <input
                        type="number"
                        name="financialScore"
                        min="0"
                        max="100"
                        value={scores.financialScore}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                        Academic Perf. (0-100)
                    </label>
                    <input
                        type="number"
                        name="academicScore"
                        min="0"
                        max="100"
                        value={scores.academicScore}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                        Church Part. (0-100)
                    </label>
                    <input
                        type="number"
                        name="churchScore"
                        min="0"
                        max="100"
                        value={scores.churchScore}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md dark:bg-gray-700/50">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Total Score:</span>
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{totalScore}</span>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                    Committee Notes / Comments
                </label>
                <textarea
                    name="notes"
                    rows={3}
                    value={scores.notes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter your observations..."
                />
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Assessment"}
                </Button>
            </div>
        </form>
    );
}