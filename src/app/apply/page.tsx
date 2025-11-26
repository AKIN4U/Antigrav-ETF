import Link from "next/link";
import { ArrowRight, FileText, Upload, UserCheck } from "lucide-react";

export default function ApplyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="text-center space-y-6 mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-primary">Scholarship Application</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Begin your journey to educational support. Please review the requirements below before starting your application.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 mb-12">
                <div className="flex flex-col items-center text-center p-6 bg-card border rounded-lg shadow-sm">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <UserCheck className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Check Eligibility</h3>
                    <p className="text-sm text-muted-foreground">Ensure you meet all criteria outlined in the About section.</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-card border rounded-lg shadow-sm">
                    <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                        <FileText className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="font-semibold mb-2">Prepare Documents</h3>
                    <p className="text-sm text-muted-foreground">Have your school bill, admission letter, and passport photo ready.</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-card border rounded-lg shadow-sm">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                        <Upload className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">Submit Online</h3>
                    <p className="text-sm text-muted-foreground">Complete the form and upload your documents securely.</p>
                </div>
            </div>

            <div className="bg-muted/30 p-8 rounded-lg text-center space-y-6">
                <h2 className="text-2xl font-bold">Ready to Apply?</h2>
                <p className="text-muted-foreground">
                    The application process takes approximately 10-15 minutes. You can save your progress and return later.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/apply/form"
                        className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-lg font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        Start New Application <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                        href="/login"
                        className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-lg font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        Continue Application
                    </Link>
                </div>
            </div>
        </div>
    );
}
