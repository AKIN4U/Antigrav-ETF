import { CheckCircle, AlertCircle } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-primary">About the ETF</h1>
                    <p className="text-xl text-muted-foreground">
                        The CCC Central Cathedral Abuja Education Trust Fund (ETF) is designed to support the educational aspirations of our youth.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    <div className="bg-card rounded-lg border p-6 shadow-sm">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                            <CheckCircle className="h-6 w-6 text-secondary" />
                            Eligibility Criteria
                        </h2>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                Must be a registered member of CCC Central Cathedral Abuja.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                Genuine student in an eligible institution (Primary, Secondary, or Tertiary).
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                Demonstrable financial need (indigent status).
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                One child per family policy applies.
                            </li>
                        </ul>
                    </div>

                    <div className="bg-card rounded-lg border p-6 shadow-sm">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                            <AlertCircle className="h-6 w-6 text-secondary" />
                            Funding Ceilings
                        </h2>
                        <ul className="space-y-4">
                            <li className="flex justify-between items-center border-b pb-2">
                                <span>Primary School</span>
                                <span className="font-bold text-primary">Up to ₦30,000</span>
                            </li>
                            <li className="flex justify-between items-center border-b pb-2">
                                <span>JSS / SSS</span>
                                <span className="font-bold text-primary">Up to ₦50,000</span>
                            </li>
                            <li className="flex justify-between items-center border-b pb-2">
                                <span>Tertiary Institution</span>
                                <span className="font-bold text-primary">Up to ₦60,000</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-8">
                    <h2 className="text-2xl font-bold mb-4">Application Process</h2>
                    <div className="grid gap-6 md:grid-cols-4">
                        <div className="space-y-2">
                            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
                            <h3 className="font-semibold">Apply</h3>
                            <p className="text-sm text-muted-foreground">Submit application online or offline with required documents.</p>
                        </div>
                        <div className="space-y-2">
                            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
                            <h3 className="font-semibold">Screening</h3>
                            <p className="text-sm text-muted-foreground">Committee reviews eligibility and conducts interviews.</p>
                        </div>
                        <div className="space-y-2">
                            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
                            <h3 className="font-semibold">Verification</h3>
                            <p className="text-sm text-muted-foreground">School bills and enrollment status are verified.</p>
                        </div>
                        <div className="space-y-2">
                            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">4</div>
                            <h3 className="font-semibold">Disbursement</h3>
                            <p className="text-sm text-muted-foreground">Funds paid directly to the school account.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
