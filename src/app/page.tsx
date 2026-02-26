import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Award, Heart, Shield, GraduationCap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ===== Hero Section ===== */}
      <section className="relative flex min-h-[700px] w-full items-center justify-center text-center text-white">
        {/* Background Image with Solid Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.png"
            alt="Students in a church community"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container px-4 py-20 -mt-35 flex flex-col items-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 -mb-1 rounded-full border border-white/20 bg-white/10 text-sm font-medium backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span className="tracking-wide text-md">Empowering Education Since 2021</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight animate-fade-in-up leading-tight">
            Transform Lives Through
            <br />
            <span className="text-gradient bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-sm">
              Bursary Enrolment & Support
            </span>
          </h1>

          <p className="text-lg md:text-2xl max-w-3xl mx-auto text-blue-50/90 leading-relaxed animate-fade-in-up delay-200 font-light">
            The CCC Central Cathedral Abuja Education Trust Fund provides bursary support to deserving students from our church community, empowering them through education and faith.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 w-full max-w-md">
            <Button asChild size="lg" className="group w-full sm:w-auto font-bold bg-amber-500 text-white hover:bg-amber-400 shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5">
              <Link href="/apply">
                Apply for Scholarship
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="group w-full sm:w-auto border-white/40 bg-white/10 text-white shadow-md hover:bg-white/20 hover:-translate-y-0.5 backdrop-blur-sm">
              <Link href="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Our Commitment to the Community
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the portal that matches your role to get started
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Scholar Portal Card */}
            <div className="group relative p-10 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-scale-in">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                {/* Icon */}
                <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <GraduationCap className="h-10 w-10 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-3xl font-bold mb-3 text-gray-900">Bursary Applicant Portal</h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  For students and families seeking bursary support for primary, secondary, and tertiary education
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    href="/register"
                    className="group/btn flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    Create Account
                  </Link>

                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-white border-2 border-blue-200 text-blue-700 font-semibold hover:bg-blue-50 transition-all"
                  >
                    Login to Dashboard
                  </Link>

                  <Link
                    href="/apply"
                    className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 transition-all"
                  >
                    <BookOpen className="h-5 w-5" />
                    View Application Info
                  </Link>
                </div>

                {/* Badge */}
                <div className="mt-6 pt-6 border-t border-blue-200">
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-medium">500+ Students Supported</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Committee Portal Card */}
            <div className="group relative p-10 rounded-3xl bg-gradient-to-br from-purple-50 to-purple-100/50 border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-scale-in delay-100">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                {/* Icon */}
                <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Shield className="h-10 w-10 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-3xl font-bold mb-3 text-gray-900">Committee Portal</h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  For ETF committee members and administrators to manage applications and operations
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    href="/admin/login"
                    className="group/btn flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    <Shield className="h-5 w-5" />
                    Admin Login
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>

                  <div className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-purple-100 text-purple-700 font-medium cursor-not-allowed opacity-60">
                    Invitation Only
                  </div>
                </div>

                {/* Info Box */}
                <div className="mt-6 pt-6 border-t border-purple-200">
                  <div className="space-y-2 text-sm text-purple-700">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      <span className="font-medium">Secure Access Control</span>
                    </div>
                    <p className="text-xs text-muted-foreground pl-6">
                      Committee access requires administrator approval
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="text-center mt-12 animate-fade-in delay-300">
            <p className="text-sm text-muted-foreground">
              Need help? Contact us at{" "}
              <a href="mailto:etf@cccabuja.org" className="text-blue-600 hover:text-blue-700 font-medium underline">
                etf@cccabuja.org
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Features Section with Modern Cards */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-200 rounded-full blur-3xl" />
        </div>

        <div className="container px-4 mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-gradient">Antigrav ETF</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We&apos;re committed to making quality education accessible to every deserving student in our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="group relative p-8 rounded-xl bg-white border border-slate-200 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-lg bg-blue-600 text-white shadow-md">
                <GraduationCap className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Comprehensive Scholarships</h3>
              <p className="text-slate-600 leading-relaxed">
                Financial support covering tuition, books, and materials for Primary, Secondary, and Tertiary levels.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="group relative p-8 rounded-xl bg-white border border-slate-200 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-lg bg-rose-600 text-white shadow-md">
                <Heart className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Community Focused</h3>
              <p className="text-slate-600 leading-relaxed">
                Supporting indigent members of CCC Central Cathedral Abuja with a focus on spiritual and academic growth.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="group relative p-8 rounded-xl bg-white border border-slate-200 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-lg bg-indigo-600 text-white shadow-md">
                <Award className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Excellence & Integrity</h3>
              <p className="text-slate-600 leading-relaxed">
                Promoting academic excellence, moral standards, and character development in every beneficiary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="py-20 sm:py-24 bg-slate-900 text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-5">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
            Join hundreds of students who have transformed their lives. Apply today and take the first step towards a brighter future.
          </p>
          <Button asChild size="lg" className="group font-bold bg-amber-500 text-slate-900 hover:bg-amber-400 shadow-lg transition-transform hover:scale-105 px-10">
            <Link href="/apply">
              Start Your Application
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}