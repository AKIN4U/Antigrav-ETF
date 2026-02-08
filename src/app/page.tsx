import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Users, Sparkles, Award, Heart, UserCircle, Shield, LogIn, UserPlus } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Gradient Overlay */}
      <section className="relative min-h-[800px] w-full overflow-hidden flex items-center justify-center text-center text-white">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-generated.png"
            alt="CCC ETF Hero - Children in White Robes"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-900/80 to-purple-900/80" />
          {/* Animated gradient orbs */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container px-4 space-y-8 py-20 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-white/20 text-sm font-medium mb-6 animate-fade-in shadow-lg backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="tracking-wide uppercase text-xs">Empowering Education Since 2021</span>
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-fade-in-up delay-300 w-full max-w-2xl">
            <Link
              href="/apply"
              className="group inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-full gradient-primary px-8 text-lg font-bold text-white shadow-glow-lg transition-all hover:scale-105 hover:shadow-glow hover:-translate-y-1"
            >
              Apply for Scholarship
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/donate"
              className="group inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-full bg-white text-primary border-2 border-primary/20 px-8 text-lg font-bold shadow-xl transition-all hover:scale-105 hover:-translate-y-1"
            >
              <Heart className="mr-2 h-5 w-5 text-rose-500 fill-rose-500 group-hover:scale-110 transition-transform" />
              Donate Now
            </Link>
          </div>

          {/* Stats Bar - Glass Card */}
          <div className="mt-16 p-6 rounded-2xl glass border border-white/10 bg-white/5 backdrop-blur-md grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 animate-fade-in delay-500 shadow-2xl max-w-4xl mx-auto w-full">
            <div className="text-center group hover:scale-105 transition-transform">
              <div className="text-4xl md:text-5xl font-bold text-white group-hover:text-yellow-300 transition-colors">500+</div>
              <div className="text-sm md:text-base text-blue-200 mt-2 font-medium">Students Supported</div>
            </div>
            <div className="text-center md:border-x md:border-white/10 group hover:scale-105 transition-transform">
              <div className="text-4xl md:text-5xl font-bold text-white group-hover:text-yellow-300 transition-colors">₦50M+</div>
              <div className="text-sm md:text-base text-blue-200 mt-2 font-medium">Funds Disbursed</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform">
              <div className="text-4xl md:text-5xl font-bold text-white group-hover:text-yellow-300 transition-colors">95%</div>
              <div className="text-sm md:text-base text-blue-200 mt-2 font-medium">Academic Success</div>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Selection Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-300 rounded-full blur-3xl" />
        </div>

        <div className="container px-4 mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-sm font-medium mb-4">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-blue-700">Choose Your Portal</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to <span className="text-gradient">CCC ETF</span>
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
                    <UserPlus className="h-5 w-5" />
                    Create Account
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>

                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-white border-2 border-blue-200 text-blue-700 font-semibold hover:bg-blue-50 transition-all"
                  >
                    <LogIn className="h-5 w-5" />
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
                    <UserCircle className="h-5 w-5" />
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
            {/* Card 1 */}
            <div className="group relative p-8 rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-scale-in">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Comprehensive Scholarships</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Financial support covering tuition, books, and educational materials for Primary, Secondary, and Tertiary levels.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative p-8 rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-scale-in delay-100">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Community Focused</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Supporting indigent members of CCC Central Cathedral Abuja with a commitment to spiritual and academic growth.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative p-8 rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-scale-in delay-200">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Excellence & Integrity</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Promoting academic excellence, moral standards, and character development in every beneficiary.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl" />
        </div>

        <div className="container px-4 mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto animate-fade-in delay-100">
            Join hundreds of students who have transformed their lives through education. Apply today and take the first step towards a brighter future.
          </p>
          <Link
            href="/apply"
            className="inline-flex h-14 items-center justify-center rounded-full bg-white text-blue-700 px-10 text-lg font-semibold shadow-2xl transition-all hover:scale-105 hover:shadow-glow-lg animate-fade-in delay-200"
          >
            Start Your Application
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
