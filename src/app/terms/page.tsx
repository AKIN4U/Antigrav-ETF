import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-6">Terms of Use</h1>
            <p className="text-sm text-muted-foreground mb-8">Effective Date: February 8, 2026</p>

            <div className="prose prose-lg max-w-none space-y-6">
                <section>
                    <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using the CCC Central Cathedral Abuja Education Trust Fund (ETF) Scholarship Application Platform (&quot;Platform&quot;), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Platform.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">2. Eligibility</h2>
                    <p>To use this Platform and apply for scholarships, you must meet the following criteria:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Be a member of CCC Central Cathedral Abuja Parish, or have a parent/guardian who is a member</li>
                        <li>Be enrolled or seeking enrollment in a recognized educational institution (Primary, Secondary, or Tertiary)</li>
                        <li>Meet the specific eligibility criteria outlined in the ETF Policy Guidelines</li>
                        <li>Provide truthful and accurate information in your application</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
                    <h3 className="text-xl font-medium mb-2 mt-4">Account Creation</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>You must create an account to submit a scholarship application</li>
                        <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                        <li>You must notify us immediately of any unauthorized use of your account</li>
                        <li>You are responsible for all activities that occur under your account</li>
                    </ul>

                    <h3 className="text-xl font-medium mb-2 mt-4">Account Termination</h3>
                    <p>We reserve the right to suspend or terminate accounts that:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Violate these Terms of Use</li>
                        <li>Provide false or misleading information</li>
                        <li>Engage in fraudulent activities</li>
                        <li>Abuse or misuse the Platform</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">4. Application Process</h2>
                    <h3 className="text-xl font-medium mb-2 mt-4">Truthfulness and Accuracy</h3>
                    <p>
                        You agree to provide complete, accurate, and truthful information in your scholarship application. Providing false information may result in:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Immediate disqualification from the scholarship program</li>
                        <li>Revocation of any awarded scholarship</li>
                        <li>Permanent ban from future ETF programs</li>
                        <li>Legal action if fraud is suspected</li>
                    </ul>

                    <h3 className="text-xl font-medium mb-2 mt-4">Document Submissions</h3>
                    <p>All documents submitted must be:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Authentic and unaltered</li>
                        <li>Clear and legible</li>
                        <li>In the required format (PDF, JPG, or PNG)</li>
                        <li>Within the specified file size limits</li>
                    </ul>

                    <h3 className="text-xl font-medium mb-2 mt-4">One Child Per Family Policy</h3>
                    <p>
                        In accordance with ETF policy, only one child per family may receive a scholarship at any given time. Attempting to circumvent this policy through multiple applications will result in disqualification of all applications from that family.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">5. Scholarship Awards</h2>
                    <h3 className="text-xl font-medium mb-2 mt-4">Selection Process</h3>
                    <p>
                        Scholarship recipients are selected by the ETF Committee based on:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Demonstrated financial need</li>
                        <li>Academic merit and performance</li>
                        <li>Church membership and participation</li>
                        <li>Availability of funds</li>
                    </ul>
                    <p className="mt-3">
                        The ETF Committee&apos;s decisions are final. We do not guarantee that all eligible applicants will receive scholarships.
                    </p>

                    <h3 className="text-xl font-medium mb-2 mt-4">Scholarship Continuation</h3>
                    <p>Continued receipt of scholarship funds is contingent upon:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Maintaining satisfactory academic performance (minimum 2.1 CGPA for tertiary students)</li>
                        <li>Submitting required academic progress reports</li>
                        <li>Continued church membership</li>
                        <li>Good conduct at home, school, and church</li>
                    </ul>

                    <h3 className="text-xl font-medium mb-2 mt-4">Scholarship Discontinuation</h3>
                    <p>Scholarships may be discontinued if the recipient:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Completes the educational level for which the scholarship was granted</li>
                        <li>Fails to submit required progress reports</li>
                        <li>Falls below minimum academic performance standards</li>
                        <li>Engages in misconduct</li>
                        <li>Ceases to be a member of CCC Central Cathedral Abuja</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">6. Intellectual Property</h2>
                    <p>
                        All content on this Platform, including text, graphics, logos, and software, is the property of CCC Central Cathedral Abuja or its licensors and is protected by copyright and other intellectual property laws.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">7. Prohibited Conduct</h2>
                    <p>You agree not to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Use the Platform for any unlawful purpose</li>
                        <li>Submit false, misleading, or fraudulent information</li>
                        <li>Attempt to gain unauthorized access to the Platform or other users&apos; accounts</li>
                        <li>Interfere with or disrupt the Platform&apos;s operation</li>
                        <li>Upload viruses, malware, or other harmful code</li>
                        <li>Harass, abuse, or harm other users or committee members</li>
                        <li>Scrape, copy, or download content without authorization</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">8. Limitation of Liability</h2>
                    <p>
                        To the fullest extent permitted by law, CCC Central Cathedral Abuja and the ETF Committee shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform or participation in the scholarship program.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">9. Indemnification</h2>
                    <p>
                        You agree to indemnify and hold harmless CCC Central Cathedral Abuja, the ETF Committee, and their respective officers, members, and agents from any claims, damages, losses, or expenses arising from your violation of these Terms of Use or misuse of the Platform.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">10. Changes to Terms</h2>
                    <p>
                        We reserve the right to modify these Terms of Use at any time. Changes will be effective immediately upon posting to the Platform. Your continued use of the Platform after changes are posted constitutes acceptance of the modified terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">11. Governing Law</h2>
                    <p>
                        These Terms of Use are governed by the laws of the Federal Republic of Nigeria. Any disputes arising from these terms shall be resolved in the courts of Abuja, Nigeria.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">12. Contact Information</h2>
                    <p>For questions about these Terms of Use, contact:</p>
                    <div className="mt-3 p-4 bg-muted rounded-lg">
                        <p className="font-semibold">ETF Committee</p>
                        <p>Celestial Church of Christ Central Cathedral, Abuja</p>
                        <p>Email: <a href="mailto:etf@cccabuja.org" className="text-blue-600 hover:underline">etf@cccabuja.org</a></p>
                    </div>
                </section>

                <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 text-sm">
                    <p>
                        <strong>By using this Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and our Privacy Policy.</strong>
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
