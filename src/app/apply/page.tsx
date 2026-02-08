import Link from "next/link";
import { ArrowRight, FileText, Upload, UserCheck, AlertCircle, CheckCircle2, Calendar, DollarSign, Users } from "lucide-react";

export default function ApplyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="text-center space-y-6 mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-primary">Bursary Application</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Begin your journey to educational support. Please review the requirements below before starting your application.
                </p>
            </div>

            {/* How It Works Section */}
            <div className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>

                {/* Who Can Apply */}
                <div className="bg-card border rounded-lg p-6 mb-6 shadow-sm">
                    <div className="flex items-start gap-3 mb-4">
                        <Users className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Who Can Apply?</h3>
                            <p className="text-muted-foreground mb-3">To be eligible for the ETF Bursary, you must meet the following criteria:</p>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>Parents/Guardian or student must be member(s) of CCC Central Cathedral Parish</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span><strong>One (1) child per family</strong> - Only one child from each family may receive a bursary at any given time</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>Child must be a genuine student of a public institution (Primary School, Secondary School, University, Polytechnic, or College of Education)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>Parents/Guardian must demonstrate financial need</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>For tertiary students: Maintain a minimum 2.1 CGPA for continued support</span>
                                </li>
                            </ul>
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-800 flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <span><strong>Not Eligible:</strong> Postgraduate and other Higher degree students are NOT eligible for this bursary program.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* What is Funded */}
                <div className="bg-card border rounded-lg p-6 mb-6 shadow-sm">
                    <div className="flex items-start gap-3 mb-4">
                        <DollarSign className="h-6 w-6 text-primary mt-1" />
                        <div className="w-full">
                            <h3 className="text-xl font-semibold mb-2">What is Funded?</h3>
                            <p className="text-muted-foreground mb-4">The bursary covers tuition fees, books, and certificate examination fees, with the following ceilings:</p>

                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-700">₦30,000</div>
                                    <div className="text-sm text-blue-600 font-medium">Primary Schools</div>
                                </div>
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="text-2xl font-bold text-green-700">₦50,000</div>
                                    <div className="text-sm text-green-600 font-medium">JSS & SSS</div>
                                </div>
                                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-700">₦60,000</div>
                                    <div className="text-sm text-purple-600 font-medium">Tertiary Institutions</div>
                                </div>
                            </div>

                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                                <p className="text-sm text-amber-800">
                                    <strong>Note:</strong> Fees are capped at the average paid in public schools of the same category. Parents should use discretion when choosing schools for their children.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-card border rounded-lg p-6 mb-6 shadow-sm">
                    <div className="flex items-start gap-3 mb-4">
                        <Calendar className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Application Timeline</h3>
                            <p className="text-muted-foreground mb-3">The bursary process follows these phases:</p>
                            <ol className="space-y-3 text-sm">
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
                                    <div>
                                        <strong>Public Announcement:</strong> Applications open at the beginning of the school year. Forms are available from the Church Secretariat or online.
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
                                    <div>
                                        <strong>Interview & Screening:</strong> Applicants and parents/guardians attend an interview with the ETF Committee to assess eligibility.
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
                                    <div>
                                        <strong>Verification:</strong> The ETF Secretariat verifies all claims and authenticates submitted documents.
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">4</span>
                                    <div>
                                        <strong>Disbursement:</strong> Approved funds are paid directly to schools or to scholars as per policy.
                                    </div>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Required Documents */}
                <div className="bg-card border rounded-lg p-6 shadow-sm">
                    <div className="flex items-start gap-3 mb-4">
                        <FileText className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Required Documents</h3>
                            <p className="text-muted-foreground mb-3">Please have the following documents ready before starting your application:</p>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <span>Passport photograph of the applicant</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <span>Present annual school fees bill (official receipt)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <span>Recipient&apos;s birth certificate</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <span>Latest school results (from current or previous institution)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <span>Primary school certificate (for secondary applicants)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <span><strong>For tertiary applicants:</strong> Secondary/High school leaving certificate (WAEC, NECO, or equivalent)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <span><strong>For tertiary applicants:</strong> JAMB/University entrance examination result slip</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <span>One-page letter explaining why you require financial assistance</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Process Steps */}
            <div className="grid gap-8 md:grid-cols-3 mb-12">
                <div className="flex flex-col items-center text-center p-6 bg-card border rounded-lg shadow-sm">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <UserCheck className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Check Eligibility</h3>
                    <p className="text-sm text-muted-foreground">Ensure you meet all criteria outlined above.</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-card border rounded-lg shadow-sm">
                    <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                        <FileText className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="font-semibold mb-2">Prepare Documents</h3>
                    <p className="text-sm text-muted-foreground">Gather all required documents listed above.</p>
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
