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

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight max-w-4xl">
            Transforming Lives Through <br />
            <span className="text-blue-400">Education & Faith</span>
          </h1>

          <p className="text-lg md:text-xl max-w-3xl mx-auto text-slate-200/90 leading-relaxed font-light">
            The CCC Central Cathedral Abuja Education Trust Fund nurtures the next generation of leaders through scholarships and spiritual guidance.
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
            <p className="text-lg text-slate-600">
              We are dedicated to making quality education accessible to every deserving student in our church community.
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