"use client";

import { useState, useEffect } from "react";
import { Heart, ShieldCheck, Globe, Users, ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

declare global {
    interface Window {
        PaystackPop: any;
    }
}

export default function DonatePage() {
    const [amount, setAmount] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [purpose, setPurpose] = useState("General Support");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [reference, setReference] = useState("");

    const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

    const handleButtonClick = (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || !email) {
            alert("Please enter both amount and email to proceed.");
            return;
        }

        if (parseFloat(amount) < 100) {
            alert("Minimum donation is ₦100");
            return;
        }

        setIsProcessing(true);

        const handler = window.PaystackPop.setup({
            key: paystackPublicKey,
            email: email,
            amount: parseFloat(amount) * 100, // in kobo
            currency: "NGN",
            ref: `ETFDON-${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`,
            metadata: {
                donorName: name || (isAnonymous ? "Anonymous Donor" : "Unknown"),
                isAnonymous: isAnonymous,
                purpose: purpose,
                donationType: "One-time"
            },
            callback: function (response: any) {
                setReference(response.reference);
                verifyTransaction(response.reference);
            },
            onClose: function () {
                setIsProcessing(false);
            }
        });

        handler.openIframe();
    };

    const verifyTransaction = async (ref: string) => {
        try {
            const res = await fetch(`/api/donations/verify?reference=${ref}`);
            const result = await res.json();
            if (result.success) {
                setShowSuccess(true);
            } else {
                alert("Payment was successful but we couldn't verify it immediately. We'll send you an email once confirmed.");
            }
        } catch (error) {
            console.error("Verification error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (showSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Thank You!</h2>
                    <p className="text-slate-600 mb-8">
                        Your generous donation of <span className="font-bold text-slate-900">₦{parseFloat(amount).toLocaleString()}</span> has been received.
                        A receipt has been sent to your email.
                    </p>
                    <div className="space-y-4">
                        <Link
                            href="/"
                            className="block w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                        >
                            Return Home
                        </Link>
                        <p className="text-xs text-slate-400">Transaction Reference: {reference}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 overflow-hidden font-sans">
            <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

            {/* Elegant Background Decoration */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-400 rounded-full blur-[120px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Visual Content Section */}
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border text-primary font-bold text-sm animate-bounce-slow">
                        <Sparkles className="w-4 h-4" />
                        CCC Education Trust Fund
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1]">
                        Every Child <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Deserves</span> a Future.
                    </h1>
                    <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
                        Your contribution directly funds tuition, textbooks, and resources for talented children in our community who lack the means to continue their education.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="p-4 bg-white rounded-2xl shadow-sm border hover:shadow-md transition-all">
                            <Users className="w-8 h-8 text-blue-500 mb-2" />
                            <h4 className="font-bold">250+</h4>
                            <p className="text-xs text-slate-500">Students Supported</p>
                        </div>
                        <div className="p-4 bg-white rounded-2xl shadow-sm border hover:shadow-md transition-all">
                            <Globe className="w-8 h-8 text-green-500 mb-2" />
                            <h4 className="font-bold">15+</h4>
                            <p className="text-xs text-slate-500">Parishes Involved</p>
                        </div>
                        <div className="p-4 bg-white rounded-2xl shadow-sm border hover:shadow-md transition-all">
                            <ShieldCheck className="w-8 h-8 text-purple-500 mb-2" />
                            <h4 className="font-bold">100%</h4>
                            <p className="text-xs text-slate-500">Transparent Fund</p>
                        </div>
                    </div>
                </div>

                {/* Donation Form Section */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-white rounded-[2rem] shadow-2xl p-8 md:p-10 border border-slate-100">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                                <Heart className="w-6 h-6 fill-current" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">Make a Donation</h3>
                                <p className="text-slate-500 text-sm italic">Invest in the next generation</p>
                            </div>
                        </div>

                        <form onSubmit={handleButtonClick} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Donation Amount (₦)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₦</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full pl-10 pr-4 py-4 bg-slate-50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl transition-all text-xl font-bold text-slate-900"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {["5000", "10000", "50000"].map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => setAmount(preset)}
                                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${amount === preset
                                                    ? "bg-primary text-white shadow-md"
                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                }`}
                                        >
                                            ₦{parseInt(preset).toLocaleString()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl transition-all font-medium"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={isAnonymous}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address *</label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl transition-all font-medium"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Donation Purpose</label>
                                <select
                                    className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl transition-all font-medium"
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                >
                                    <option>General Support</option>
                                    <option>Scholarship Fund</option>
                                    <option>Infrastructure Development</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                                <input
                                    type="checkbox"
                                    id="anonymous"
                                    className="w-5 h-5 rounded-md text-primary focus:ring-primary"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                />
                                <label htmlFor="anonymous" className="text-sm font-medium text-slate-600 cursor-pointer select-none">
                                    Make this donation anonymous
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full py-5 bg-gradient-to-r from-primary to-blue-600 text-white rounded-[1.25rem] font-black text-lg shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Inititalizing Safe Payment...
                                    </>
                                ) : (
                                    <>
                                        Complete Donation
                                        <ArrowRight className="w-6 h-6" />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                                Secured by Paystack • PCI-DSS Compliant
                            </p>
                        </form>
                    </div>
                </div>
            </div>

            {/* Minimal Footer */}
            <div className="max-w-7xl mx-auto px-4 py-8 border-t flex flex-col md:row justify-between items-center text-slate-500 text-xs gap-4">
                <p>© {new Date().getFullYear()} CCC Central Cathedral Abuja - Education Trust Fund</p>
                <div className="flex gap-6">
                    <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                </div>
            </div>
        </div>
    );
}
