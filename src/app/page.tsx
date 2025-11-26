import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Users, Sparkles, Award, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Gradient Overlay */}
      <section className="relative min-h-[700px] w-full overflow-hidden flex items-center justify-center text-center text-white">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-new.png"
            alt="CCC ETF Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-purple-900/90" />
          {/* Animated gradient orbs */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container px-4 space-y-8 py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 text-sm font-medium mb-4 animate-fade-in">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span>Empowering Education Since 2021</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-fade-in-up">
            Transform Lives Through
            <br />
            <span className="text-gradient bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
              Education & Faith
            </span>
          </h1>

          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-100 leading-relaxed animate-fade-in-up delay-200">
            The CCC Central Cathedral Abuja Education Trust Fund provides scholarships and financial support to deserving students, nurturing the next generation of leaders.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-fade-in-up delay-300">
            <Link
              href="/apply"
              className="group inline-flex h-14 items-center justify-center rounded-full gradient-primary px-10 text-lg font-semibold text-white shadow-glow-lg transition-all hover:scale-105 hover:shadow-glow"
            >
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about"
              className="inline-flex h-14 items-center justify-center rounded-full glass border border-white/30 px-10 text-lg font-semibold text-white shadow-lg transition-all hover:bg-white/20 hover:scale-105"
            >
              Learn More
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12 animate-fade-in delay-500">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-300">500+</div>
              <div className="text-sm text-gray-300 mt-1">Students Supported</div>
            </div>
            <div className="text-center border-x border-white/20">
              <div className="text-4xl font-bold text-yellow-300">₦50M+</div>
              <div className="text-sm text-gray-300 mt-1">Disbursed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-300">95%</div>
              <div className="text-sm text-gray-300 mt-1">Success Rate</div>
            </div>
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
              We're committed to making quality education accessible to every deserving student in our community.
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
