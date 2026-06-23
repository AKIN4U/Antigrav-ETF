"use client";

import { useState, useEffect } from "react";
import { Loader2, Upload, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

interface AcademicRecord {
    id: string;
    academicYear: string;
    semester: string | null;
    level: string;
    cgpaOrAverage: string;
    resultUrl: string;
    status: string;
    reviewerNotes: string | null;
    createdAt: string;
}

export default function AcademicProgress({ applicationId }: { applicationId: string }) {
    const [records, setRecords] = useState<AcademicRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        academicYear: "",
        semester: "",
        level: "",
        cgpaOrAverage: "",
    });

    const supabase = createClient();

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const response = await fetch("/api/academic-records");
            const result = await response.json();
            if (result.success) {
                setRecords(result.data);
            }
        } catch (error) {
            console.error("Error fetching academic records:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a result document to upload.");
            return;
        }

        setIsSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `results/${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("applications")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from("applications")
                .getPublicUrl(filePath);

            const response = await fetch("/api/academic-records", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    resultUrl: urlData.publicUrl,
                    applicationId
                })
            });

            const result = await response.json();
            if (result.success) {
                alert("Result submitted successfully!");
                setFormData({ academicYear: "", semester: "", level: "", cgpaOrAverage: "" });
                setFile(null);
                fetchRecords();
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            console.error("Error submitting result:", error);
            alert(`Submission failed: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-6"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-8">
            <div className="bg-card border rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Submit New Result</h2>
                <p className="text-sm text-muted-foreground mb-6">
                    To maintain your scholarship eligibility, please upload your latest academic results at the end of each term or semester.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="academicYear">Academic Year (e.g. 2025/2026)</Label>
                            <Input id="academicYear" name="academicYear" value={formData.academicYear} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="semester">Semester/Term</Label>
                            <Input id="semester" name="semester" value={formData.semester} onChange={handleInputChange} placeholder="e.g. First Semester" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="level">Level/Class</Label>
                            <Input id="level" name="level" value={formData.level} onChange={handleInputChange} placeholder="e.g. 200 Level" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cgpaOrAverage">CGPA or Average Score</Label>
                            <Input id="cgpaOrAverage" name="cgpaOrAverage" value={formData.cgpaOrAverage} onChange={handleInputChange} placeholder="e.g. 3.5 or 85%" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="resultDocument">Result Document (PDF/Image)</Label>
                        <Input id="resultDocument" type="file" onChange={handleFileChange} accept="image/*,.pdf" required />
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Upload className="mr-2 h-4 w-4" />}
                        Submit Result
                    </Button>
                </form>
            </div>

            {records.length > 0 && (
                <div className="bg-card border rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Submission History</h2>
                    <div className="space-y-4">
                        {records.map((record) => (
                            <div key={record.id} className="border rounded-md p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="font-medium">{record.level} - {record.semester} ({record.academicYear})</h3>
                                    <p className="text-sm text-muted-foreground">Score/CGPA: {record.cgpaOrAverage}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Submitted: {new Date(record.createdAt).toLocaleDateString()}</p>
                                    {record.reviewerNotes && (
                                        <div className="mt-2 text-sm bg-muted/50 p-2 rounded">
                                            <span className="font-medium">Admin Notes: </span> {record.reviewerNotes}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-2">
                                        {record.status === "Pending Review" && <span className="flex items-center text-yellow-600 text-sm"><Clock className="h-4 w-4 mr-1"/> Pending Review</span>}
                                        {record.status === "Approved" && <span className="flex items-center text-green-600 text-sm"><CheckCircle className="h-4 w-4 mr-1"/> Approved</span>}
                                        {record.status === "Rejected" && <span className="flex items-center text-red-600 text-sm"><XCircle className="h-4 w-4 mr-1"/> Rejected</span>}
                                    </div>
                                    <a href={record.resultUrl} target="_blank" rel="noreferrer" className="text-primary text-sm flex items-center hover:underline">
                                        <FileText className="h-4 w-4 mr-1" /> View Document
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
