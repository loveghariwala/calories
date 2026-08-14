import { Metadata } from 'next';
import Link from 'next/link';
import { NutritionCalculators } from '@/components/NutritionCalculators';
import { MealBuilderDock } from '@/components/MealBuilderDock';
import { generateFaqJsonLd, getCanonicalUrl } from '@/lib/seo';
import { Award, ChevronRight, CheckCircle2, Flame, ArrowRight, Zap, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Calorie Calculator — Free Daily Calorie & TDEE Macro Planner | CaloriePulse',
  description:
    'Free scientific calorie calculator based on the clinical Mifflin-St Jeor equation. Calculate your exact maintenance calories, TDEE, and calorie deficit for fat loss or muscle gain.',
  keywords: [
    'calorie calculator',
    'free calorie calculator',
    'daily calorie calculator',
    'calorie deficit calculator',
    'maintenance calorie calculator',
    'tdee calculator',
    'how many calories should i eat',
    'macro calculator',
    'bmr calculator',
  ],
  alternates: {
    canonical: getCanonicalUrl('/calorie-calculator'),
  },
  openGraph: {
    title: 'Calorie Calculator — Free Daily Calorie & TDEE Macro Planner',
    description:
      'Calculate your exact maintenance calories, TDEE, and calorie deficit for fat loss or muscle gain with clinical accuracy.',
    url: getCanonicalUrl('/calorie-calculator'),
    siteName: 'CaloriePulse',
    type: 'website',
  },
};

export default function CalorieCalculatorPage() {
  const calculatorFaqs = [
    {
      q: 'How does this calorie calculator work?',
      a: 'This calculator utilizes the Mifflin-St Jeor formula, widely recognized by the Academy of Nutrition and Dietetics and clinical dietitians as the most accurate method for calculating Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).',
    },
    {
      q: 'What is a calorie deficit and how do I calculate it?',
      a: 'A calorie deficit occurs when you consume fewer calories than your body burns in a day. For safe and sustainable fat loss of approximately 1 pound per week, a moderate deficit of 300 to 500 calories below your TDEE is clinically recommended.',
    },
    {
      q: 'How many calories should I eat to lose weight?',
      a: 'Subtract 300-500 calories from your Total Daily Energy Expenditure (TDEE). For example, if your maintenance TDEE is 2,300 kcal/day, eating 1,800-2,000 kcal/day will result in steady, healthy fat loss while preserving lean muscle mass.',
    },
    {
      q: 'What is the difference between BMR and TDEE?',
      a: 'BMR (Basal Metabolic Rate) is the minimum calories your body requires just to stay alive at complete rest (breathing, organ function). TDEE (Total Daily Energy Expenditure) is your BMR multiplied by your physical activity level and represents your true daily calorie burn.',
    },
  ];

  const faqSchema = generateFaqJsonLd(calculatorFaqs);

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'CaloriePulse Scientific Calorie Calculator',
    url: getCanonicalUrl('/calorie-calculator'),
    applicationCategory: 'HealthApplication',
    operatingSystem: 'All',
    description: 'Free scientific calorie and macro calculator based on the Mifflin-St Jeor formula.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-sans text-[#786C62]">
          <Link href="/" className="hover:text-[#181513]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#C4552D] font-semibold">Calorie Calculator</span>
        </nav>

        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full gold-seal text-xs font-sans font-semibold shadow-2xs">
            <Award className="w-3.5 h-3.5 text-[#C9822B]" />
            <span>MIFFLIN-ST JEOR CLINICAL EQUATION</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#181513] tracking-tight leading-[1.15]">
            Scientific <span className="text-[#C4552D] italic font-normal">Calorie Calculator</span>
          </h1>

          <p className="text-base sm:text-lg text-[#786C62] font-sans leading-relaxed">
            Calculate your exact daily maintenance calories, BMR, TDEE, and macro targets for fat loss, maintenance, or muscle growth with laboratory precision.
          </p>
        </div>

        {/* The Calculator Suite */}
        <NutritionCalculators />

        {/* Clinical Breakdown Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="editorial-card rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FDF2EE] text-[#C4552D] flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#181513]">1. Basal Metabolism (BMR)</h3>
            <p className="text-xs sm:text-sm text-[#786C62] leading-relaxed">
              The essential caloric energy your vital organs, brain, and cellular processes burn every 24 hours at complete rest.
            </p>
          </div>

          <div className="editorial-card rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EBF2EC] text-[#3B5842] flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#181513]">2. Total Daily Burn (TDEE)</h3>
            <p className="text-xs sm:text-sm text-[#786C62] leading-relaxed">
              Your real-world caloric expenditure factoring in non-exercise activity (NEAT), workouts, and dietary thermogenesis.
            </p>
          </div>

          <div className="editorial-card rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FBF4E8] text-[#C9822B] flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#181513]">3. Deficit / Surplus Target</h3>
            <p className="text-xs sm:text-sm text-[#786C62] leading-relaxed">
              Tailored macro prescription (Protein, Carbs, Fat) designed to preserve muscle tissue while shedding body fat.
            </p>
          </div>
        </div>

        {/* SEO FAQ Section */}
        <section className="editorial-card rounded-3xl p-6 sm:p-10 space-y-8">
          <div>
            <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-[#C4552D]">
              Evidence-Based FAQ
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513] mt-0.5">
              Frequently Asked Questions About Calories &amp; TDEE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {calculatorFaqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] space-y-2">
                <h3 className="font-serif font-bold text-base text-[#181513]">{faq.q}</h3>
                <p className="text-xs sm:text-sm text-[#786C62] leading-relaxed font-sans">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <MealBuilderDock />
    </>
  );
}
