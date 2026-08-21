import { Metadata } from 'next';
import Link from 'next/link';
import { Award, ShieldCheck, Heart, Sparkles, ChevronRight, UserX, Database, Scale } from 'lucide-react';
import { getCanonicalUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About Us — Whole Food Nutrition & Mission',
  description:
    'CaloriePulse was created to bring transparency, clinical accuracy, and radical privacy to whole food calorie lookup and daily meal tracking.',
  alternates: {
    canonical: getCanonicalUrl('/about'),
  },
  openGraph: {
    title: 'About Us — Whole Food Nutrition & Mission | CaloriePulse',
    description:
      'CaloriePulse was created to bring transparency, clinical accuracy, and radical privacy to whole food calorie lookup and daily meal tracking.',
    url: getCanonicalUrl('/about'),
    siteName: 'CaloriePulse',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us — Whole Food Nutrition & Mission | CaloriePulse',
    description:
      'CaloriePulse was created to bring transparency, clinical accuracy, and radical privacy to whole food calorie lookup and daily meal tracking.',
  },
};

export default function AboutUsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 font-sans">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#786C62]">
        <Link href="/" className="hover:text-[#181513]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#C4552D] font-semibold">About Us</span>
      </nav>

      {/* Hero Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full gold-seal text-xs font-bold shadow-2xs">
          <Award className="w-4 h-4 text-[#C9822B]" />
          <span>OUR EDITORIAL MISSION</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#181513] tracking-tight leading-[1.12]">
          Thoughtful, Honest <br />
          <span className="text-[#C4552D] italic font-normal">Nutrition Intelligence.</span>
        </h1>

        <p className="text-base sm:text-lg text-[#786C62] leading-relaxed">
          Built for conscious eaters, athletes, and clinicians who demand laboratory precision without surveillance capitalism.
        </p>
      </div>

      {/* 3 Core Editorial Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="editorial-card rounded-3xl p-6 sm:p-8 space-y-3 bg-[#FAF8F5]">
          <div className="w-10 h-10 rounded-2xl bg-[#EBF2EC] text-[#3B5842] flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#181513]">USDA Gold Standard</h3>
          <p className="text-xs sm:text-sm text-[#786C62] leading-relaxed">
            Every macro gram and micronutrient profile is pulled directly from USDA FoodData Central research assays.
          </p>
        </div>

        <div className="editorial-card rounded-3xl p-6 sm:p-8 space-y-3 bg-[#FAF8F5]">
          <div className="w-10 h-10 rounded-2xl bg-[#FDF2EE] text-[#C4552D] flex items-center justify-center font-bold">
            <UserX className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#181513]">Zero Account Friction</h3>
          <p className="text-xs sm:text-sm text-[#786C62] leading-relaxed">
            No signup forms, no email verifications, and no credit cards. Start logging meals instantly in 1 click.
          </p>
        </div>

        <div className="editorial-card rounded-3xl p-6 sm:p-8 space-y-3 bg-[#FAF8F5]">
          <div className="w-10 h-10 rounded-2xl bg-[#FBF4E8] text-[#C9822B] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#181513]">Encrypted Local Journal</h3>
          <p className="text-xs sm:text-sm text-[#786C62] leading-relaxed">
            Your daily food logs remain 100% private on your own device through browser LocalStorage.
          </p>
        </div>
      </div>

      {/* Story & Philosophy */}
      <div className="editorial-card rounded-3xl p-8 sm:p-12 space-y-6 text-sm sm:text-base text-[#181513] leading-relaxed">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513]">
          Why We Built CaloriePulse
        </h2>
        <p className="text-[#786C62]">
          Most modern calorie tracking apps are bloated with invasive ads, forced monthly subscriptions, paywalled barcode scanners, and aggressive telemetry tracking that sells your personal health data to brokers.
        </p>
        <p className="text-[#786C62]">
          We believed there had to be a better way: a serene, beautiful editorial studio where you can explore whole food density, calibrate kitchen scale grams, and cultivate healthy eating habits in total privacy.
        </p>

        <div className="pt-4 border-t border-[#EAE3D9] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#786C62]">
            Ready to explore? Browse our curated whole food directory or calculate your daily calorie targets.
          </div>
          <Link
            href="/#categories"
            className="px-6 py-2.5 rounded-full bg-[#181513] text-white hover:bg-[#C4552D] text-xs font-bold transition-colors whitespace-nowrap"
          >
            Explore Food Directory &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
