import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground mb-8">Effective Date: February 8, 2026</p>

            <div className="prose prose-lg max-w-none space-y-6">
                <section>
                    <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
                    <p>
                        The Celestial Church of Christ (CCC) Central Cathedral Abuja Education Trust Fund (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting the privacy and security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our ETF Scholarship Application Platform.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>

                    <h3 className="text-xl font-medium mb-2 mt-4">Personal Information</h3>
                    <p>We collect the following personal information when you apply for a scholarship:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Applicant Information:</strong> Name, date of birth, gender, state of origin, contact details, passport photograph</li>
                        <li><strong>Academic Information:</strong> School name, class/level, academic results, JAMB scores (for tertiary applicants)</li>
                        <li><strong>Family Information:</strong> Parent/guardian names, contact details, occupation, income information, church membership details</li>
                        <li><strong>Documents:</strong> School bills, birth certificates, academic certificates, entrance exam results, financial need letters</li>
                    </ul>

                    <h3 className="text-xl font-medium mb-2 mt-4">Automatically Collected Information</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>IP address and browser information</li>
                        <li>Login timestamps and activity logs</li>
                        <li>Application submission and status change history</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">How We Use Your Information</h2>
                    <p>We use the collected information to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Process and evaluate scholarship applications</li>
                        <li>Verify eligibility and church membership</li>
                        <li>Communicate application status and decisions</li>
                        <li>Disburse scholarship funds to approved beneficiaries</li>
                        <li>Monitor academic progress of scholarship recipients</li>
                        <li>Generate reports for the ETF Committee and Parochial Committee</li>
                        <li>Comply with legal and regulatory requirements</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">Data Sharing and Disclosure</h2>
                    <p>We may share your information with:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>ETF Committee Members:</strong> For application review and selection</li>
                        <li><strong>Church Officials:</strong> General Secretary, Treasurer, and Parochial Committee for oversight</li>
                        <li><strong>Educational Institutions:</strong> To verify enrollment and facilitate direct payment of fees</li>
                        <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                    </ul>
                    <p className="mt-3">We do <strong>not</strong> sell, rent, or trade your personal information to third parties.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
                    <p>We implement appropriate technical and organizational measures to protect your personal information, including:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Secure encrypted connections (HTTPS)</li>
                        <li>Access controls and role-based permissions</li>
                        <li>Regular security audits and updates</li>
                        <li>Secure document storage with restricted access</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">Data Retention</h2>
                    <p>We retain your personal information for:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Active Applications:</strong> Duration of the application cycle plus 12 months</li>
                        <li><strong>Scholarship Recipients:</strong> Duration of scholarship plus 7 years (as per GDPR requirements)</li>
                        <li><strong>Unsuccessful Applications:</strong> 24 months after application cycle completion</li>
                    </ul>
                    <p className="mt-3">After the retention period, personal data will be securely deleted or anonymized.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Access your personal information</li>
                        <li>Request correction of inaccurate data</li>
                        <li>Request deletion of your data (subject to legal obligations)</li>
                        <li>Withdraw consent for data processing</li>
                        <li>Object to processing of your data</li>
                        <li>Request a copy of your data in a portable format</li>
                    </ul>
                    <p className="mt-3">To exercise these rights, contact us at <a href="mailto:etf@cccabuja.org" className="text-blue-600 hover:underline">etf@cccabuja.org</a>.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">Children&apos;s Privacy</h2>
                    <p>
                        For applicants under 18 years of age, we require parent/guardian consent for data processing. Parents/guardians have the right to review, modify, or request deletion of their child&apos;s information.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy periodically. We will notify you of significant changes via email or prominent notice on our platform.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
                    <p>For questions about this Privacy Policy or our data practices, contact:</p>
                    <div className="mt-3 p-4 bg-muted rounded-lg">
                        <p className="font-semibold">ETF Committee</p>
                        <p>Celestial Church of Christ Central Cathedral, Abuja</p>
                        <p>Email: <a href="mailto:etf@cccabuja.org" className="text-blue-600 hover:underline">etf@cccabuja.org</a></p>
                    </div>
                </section>

                <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 text-sm">
                    <p className="italic">
                        This policy complies with the Nigeria Data Protection Regulation (NDPR) and incorporates GDPR principles for international best practices.
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t">
                    <Link href="/" className="text-blue-600 hover:underline">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
