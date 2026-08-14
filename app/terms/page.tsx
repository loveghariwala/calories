import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ShieldCheck, ChevronRight } from 'lucide-react';
import { getCanonicalUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Terms of Service | CaloriePulse',
  description:
    'Terms of service and nutritional reference guidelines for CaloriePulse. Sourced from USDA FoodData Central.',
  alternates: {
    canonical: getCanonicalUrl('/terms'),
  },
};

export default function TermsOfServicePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 font-sans">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#786C62]">
        <Link href="/" className="hover:text-[#181513]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#C4552D] font-semibold">Terms of Service</span>
      </nav>

      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF8F5] border border-[#EAE3D9] text-xs font-bold text-[#181513]">
          <BookOpen className="w-4 h-4 text-[#C4552D]" />
          <span>TERMS OF REFERENCE &amp; USAGE</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#181513]">
          Terms of Service
        </h1>
        <p className="text-sm sm:text-base text-[#786C62] leading-relaxed">
          Last Updated: February 2026
        </p>
      </div>

      {/* Terms Content */}
      <div className="editorial-card rounded-3xl p-8 sm:p-10 space-y-8 text-xs sm:text-sm text-[#181513] leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#181513]">1. Informational &amp; Educational Purpose</h2>
          <p className="text-[#786C62]">
            CaloriePulse provides whole food nutritional information, laboratory macro breakdowns, and TDEE calorie estimates for educational, personal wellness, and general informational purposes only. Nutritional data is curated from the USDA FoodData Central database.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#181513]">2. Not Medical or Clinical Advice</h2>
          <p className="text-[#786C62]">
            The content, calculators, and tools available on this website do not constitute medical, dietetic, or healthcare advice, diagnosis, or treatment. Always consult with a licensed physician, registered dietitian, or qualified healthcare professional before beginning any restrictive diet or exercise regimen.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#181513]">3. No Warranty on Agricultural Variations</h2>
          <p className="text-[#786C62]">
            While our data is cross-referenced with official USDA laboratory assays, natural agricultural variations in whole food harvests (e.g. fruit ripeness, soil composition, livestock feeding) can cause minor variances in actual caloric content.
          </p>
        </section>
      </div>
    </main>
  );
}
