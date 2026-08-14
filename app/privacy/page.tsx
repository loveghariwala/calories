import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, EyeOff, UserX, ChevronRight, Award } from 'lucide-react';
import { getCanonicalUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Privacy Policy — 100% Private Local Storage (No Accounts, No Emails) | CaloriePulse',
  description:
    'CaloriePulse is built on a radical privacy-first foundation. We require no name, no email, and no user registration. All daily food logs remain encrypted on your personal device.',
  alternates: {
    canonical: getCanonicalUrl('/privacy'),
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 font-sans">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#786C62]">
        <Link href="/" className="hover:text-[#181513]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#C4552D] font-semibold">Privacy Policy</span>
      </nav>

      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF2EC] border border-[#D5E5D8] text-xs font-bold text-[#3B5842]">
          <ShieldCheck className="w-4 h-4" />
          <span>ZERO DATA COLLECTION ARCHITECTURE</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#181513]">
          Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-[#786C62] leading-relaxed">
          Last Updated: February 2026 • Effective Immediately
        </p>
      </div>

      {/* Core Privacy Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="editorial-card rounded-3xl p-6 space-y-2 bg-[#FAF8F5]">
          <UserX className="w-6 h-6 text-[#C4552D]" />
          <h3 className="font-serif font-bold text-base text-[#181513]">No Names or Emails</h3>
          <p className="text-xs text-[#786C62]">
            You will never be asked for your name, email address, phone number, or password.
          </p>
        </div>

        <div className="editorial-card rounded-3xl p-6 space-y-2 bg-[#FAF8F5]">
          <Lock className="w-6 h-6 text-[#3B5842]" />
          <h3 className="font-serif font-bold text-base text-[#181513]">100% Client-Side Storage</h3>
          <p className="text-xs text-[#786C62]">
            Your meals, calorie logs, and custom macro targets are saved strictly inside your browser's localStorage.
          </p>
        </div>

        <div className="editorial-card rounded-3xl p-6 space-y-2 bg-[#FAF8F5]">
          <EyeOff className="w-6 h-6 text-[#C9822B]" />
          <h3 className="font-serif font-bold text-base text-[#181513]">Zero Third-Party Trackers</h3>
          <p className="text-xs text-[#786C62]">
            We do not sell your telemetry, run ad network pixels, or share your data with insurance or brokers.
          </p>
        </div>
      </div>

      {/* Detailed Legal Sections */}
      <div className="editorial-card rounded-3xl p-8 sm:p-10 space-y-8 text-xs sm:text-sm text-[#181513] leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#181513]">1. Information We Do NOT Collect</h2>
          <p className="text-[#786C62]">
            CaloriePulse does not maintain user account systems, profile databases, or marketing mailing lists. When using our whole food directory, calculators, and daily meal journal, all nutritional calculations run instantly in your browser. We never collect:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#786C62]">
            <li>Personal Identifiable Information (PII) such as your legal name, email, or physical address.</li>
            <li>Financial or credit card information.</li>
            <li>Biometric health records uploaded to external cloud servers.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#181513]">2. How LocalStorage Works</h2>
          <p className="text-[#786C62]">
            To allow you to log your daily breakfast, lunch, dinner, and snacks seamlessly across sessions, CaloriePulse uses standard browser Web Storage (`localStorage`). This data lives exclusively on your local computer or phone. You can clear this data at any time by clearing your browser cache or tapping "Clear Journal" inside the meal tracker drawer.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#181513]">3. USDA Nutritional Sourcing</h2>
          <p className="text-[#786C62]">
            All food metrics and laboratory macro values are pulled from public-domain datasets provided by the United States Department of Agriculture (USDA FoodData Central).
          </p>
        </section>
      </div>
    </main>
  );
}
