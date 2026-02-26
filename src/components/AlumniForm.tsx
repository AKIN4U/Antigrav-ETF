"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AlumniFormProps {
    applicantId?: string; // If creating from an applicant
    initialData?: any;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function AlumniForm({ applicantId, initialData, onSuccess, onCancel }: AlumniFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        applicantId: applicantId || initialData?.applicantId || "",
        graduationYear: initialData?.graduationYear || new Date().getFullYear(),
        institution: initialData?.institution || "",
        degree: initialData?.degree || "",
        currentStatus: initialData?.currentStatus || "Employed",
        employer: initialData?.employer || "",
        jobTitle: initialData?.jobTitle || "",
        linkedInUrl: initialData?.linkedInUrl || "",
        successStory: initialData?.successStory || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/admin/alumni", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                onSuccess();
            } else {
                alert("Failed to save profile");
            }
        } catch (error) {
            console.error(error);
            alert("Error saving profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="graduationYear">Graduation Year</Label>
                    <Input
                        id="graduationYear"
                        name="graduationYear"
                        type="number"
                        required
                        value={formData.graduationYear}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                        id="institution"
                        name="institution"
                        placeholder="e.g. University of Lagos"
                        required
                        value={formData.institution}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="degree">Degree / Qualification</Label>
                    <Input
                        id="degree"
                        name="degree"
                        placeholder="e.g. B.Sc. Computer Science"
                        value={formData.degree}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="currentStatus">Current Status</Label>
                    <Select
                        value={formData.currentStatus}
                        onValueChange={(val) => handleSelectChange("currentStatus", val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Employed">Employed</SelectItem>
                            <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                            <SelectItem value="Further Studies">Further Studies</SelectItem>
                            <SelectItem value="Seeking Employment">Seeking Employment</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="employer">Employer / Company (Optional)</Label>
                    <Input
                        id="employer"
                        name="employer"
                        value={formData.employer}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title (Optional)</Label>
                    <Input
                        id="jobTitle"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="linkedInUrl">LinkedIn URL (Optional)</Label>
                <Input
                    id="linkedInUrl"
                    name="linkedInUrl"
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={formData.linkedInUrl}
                    onChange={handleChange}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="successStory">Success Story / Comments</Label>
                <Textarea
                    id="successStory"
                    name="successStory"
                    rows={4}
                    placeholder="Share a brief testimonial or update..."
                    value={formData.successStory}
                    onChange={handleChange}
                />
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Profile"}
                </Button>
            </div>
        </form>
    );
}
