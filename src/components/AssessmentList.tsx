"use client";

import { useEffect, useState } from "react";

export default function AssessmentList({ applicationId }: { applicationId: string }) {
    const [assessments, setAssessments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const res = await fetch(`/api/applications/${applicationId}/assessments`);
                if (res.ok) {
                    const data = await res.json();
                    setAssessments(data.assessments || []);
                }
            } catch (err) {
                console.error("Failed to load assessments", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAssessments();
    }, [applicationId]);

    if (loading) return <div className="text-sm text-gray-500">Loading reviews...</div>;
    if (assessments.length === 0) return <div className="text-sm text-gray-500 italic">No reviews yet.</div>;

    return (
        <div className="space-y-4">
            {assessments.map((assessment) => (
                <div key={assessment.id} className="border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-sm dark:text-gray-200">
                            {assessment.adminUser?.name || assessment.adminUser?.email || "Committee Member"}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                            Score: {assessment.totalScore}
                        </span>
                    </div>
                    {assessment.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">&quot;{assessment.notes}&quot;</p>
                    )}
                    <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-gray-500 dark:text-gray-500">
                        <div>Fin: {assessment.financialScore}</div>
                        <div>Aca: {assessment.academicScore}</div>
                        <div>Chu: {assessment.churchScore}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
