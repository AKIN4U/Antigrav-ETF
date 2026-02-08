"use client";

import { useState } from "react";
import { Eye, Loader2 } from "lucide-react";

interface SecureDocumentLinkProps {
    filePath: string;
    label: string;
}

export function SecureDocumentLink({ filePath, label }: SecureDocumentLinkProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleView = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const encodedPath = encodeURIComponent(filePath);
            const response = await fetch(`/api/documents/${encodedPath}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to load document');
            }

            const { signedUrl } = await response.json();

            // Open in new tab
            window.open(signedUrl, '_blank');
        } catch (err: any) {
            console.error('Error loading document:', err);
            setError(err.message || 'Failed to load document');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleView}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Eye className="h-4 w-4" />
                )}
                {label}
            </button>
            {error && (
                <span className="text-xs text-red-600">{error}</span>
            )}
        </div>
    );
}
