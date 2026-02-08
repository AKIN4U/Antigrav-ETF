import { useState } from "react";
import { UploadCloud, CheckCircle, Loader2, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface DocumentUploadStepProps {
    updateData: (data: any) => void;
    data: any;
}

export function DocumentUploadStep({ updateData, data }: DocumentUploadStepProps) {
    const [uploading, setUploading] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const supabase = createClient();

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (!e.target.files || !e.target.files[0]) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

        // Get user ID for application-specific folder
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setErrors((prev) => ({ ...prev, [field]: "You must be logged in to upload documents." }));
            return;
        }

        // Store in user-specific folder (will be moved to application folder on submission)
        const filePath = `applications/temp_${user.id}/${fileName}`;

        setUploading((prev) => ({ ...prev, [field]: true }));
        setErrors((prev) => ({ ...prev, [field]: "" }));

        try {
            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Store only the file path, not a public URL
            updateData({ [field]: filePath });
        } catch (error: any) {
            console.error("Upload error:", error);
            setErrors((prev) => ({ ...prev, [field]: "Upload failed. Please try again." }));
        } finally {
            setUploading((prev) => ({ ...prev, [field]: false }));
        }
    };

    const documents = [
        { id: "schoolFeesBill", label: "Present Annual School Fees (Bill)" },
        { id: "birthCertificate", label: "Recipient's Birth Certificate" },
        { id: "primaryCertificate", label: "Primary School Certificate" },
        { id: "schoolResults", label: "Latest School Results" },
        { id: "assistanceLetter", label: "One Page Letter Explaining Financial Need" },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Document Upload</h2>
            <p className="text-sm text-muted-foreground mb-6">
                Please upload clear copies of the following documents. Supported formats: PDF, JPG, PNG.
            </p>

            <div className="grid gap-6">
                {documents.map((doc) => (
                    <div key={doc.id} className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors ${data[doc.id] ? "bg-green-50 border-green-200" : "hover:bg-muted/50"}`}>
                        {data[doc.id] ? (
                            <>
                                <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                                <p className="text-sm font-medium text-green-700">Uploaded Successfully</p>
                                <a href={data[doc.id]} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 underline mt-1">
                                    View File
                                </a>
                            </>
                        ) : (
                            <>
                                {uploading[doc.id] ? (
                                    <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                                ) : (
                                    <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                                )}
                                <label htmlFor={doc.id} className={`text-sm font-medium ${uploading[doc.id] ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
                                    {uploading[doc.id] ? "Uploading..." : doc.label}
                                </label>
                                <input
                                    id={doc.id}
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => handleFileUpload(e, doc.id)}
                                    disabled={uploading[doc.id]}
                                />
                            </>
                        )}
                        {errors[doc.id] && (
                            <div className="flex items-center gap-1 mt-2 text-red-500 text-xs">
                                <XCircle className="h-3 w-3" />
                                {errors[doc.id]}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
