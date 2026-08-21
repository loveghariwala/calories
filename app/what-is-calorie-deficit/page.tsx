import { Metadata } from 'next';
import Link from 'next/link';
import { MealBuilderDock } from '@/components/MealBuilderDock';
import { generateFaqJsonLd, getCanonicalUrl } from '@/lib/seo';
import { Award, ChevronRight, CheckCircle2, Flame, ArrowRight, Scale, Calculator, Dumbbell } from 'lucide-react';

export const metadata: Metadata = {
  title: 'What is a Calorie Deficit & How to Calculate It',
  description:
    'Understand calorie deficit basics for weight loss. Learn what a calorie deficit is, how to calculate your exact deficit, and how many calories to eat to lose weight.',
  keywords: [
    'what is a calorie deficit',
    'what is calorie deficit',
    'how to calculate calorie deficit',
    'how much calories should i eat to lose weight',
    'how to be in a calorie deficit',
    'calorie deficit for weight loss',
  ],
  alternates: {
    canonical: getCanonicalUrl('/what-is-calorie-deficit'),
  },
  openGraph: {
    title: 'What is a Calorie Deficit & How to Calculate It | CaloriePulse',
    description:
      'Understand calorie deficit basics for weight loss. Learn what a calorie deficit is, how to calculate your exact deficit, and how many calories to eat to lose weight.',
    url: getCanonicalUrl('/what-is-calorie-deficit'),
    siteName: 'CaloriePulse',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What is a Calorie Deficit & How to Calculate It | CaloriePulse',
    description:
      'Understand calorie deficit basics for weight loss. Learn what a calorie deficit is, how to calculate your exact deficit, and how many calories to eat to lose weight.',
  },
};

export default function WhatIsCalorieDeficitPage() {
  const deficitFaqs = [
    {
      q: 'What is a calorie deficit in simple terms?',
      a: 'A calorie deficit occurs when you consume fewer calories from food and drinks than your body burns through basal metabolism, daily movement, and exercise. When this happens, your body must tap into stored adipose tissue (body fat) for energy, resulting in weight loss.',
    },
    {
      q: 'How do you calculate your calorie deficit?',
      a: '1. Calculate your TDEE (Total Daily Energy Expenditure) based on your age, weight, height, and activity level. 2. Subtract 300 to 500 calories from your TDEE. For example, if your TDEE is 2,200 calories, your daily deficit target is 1,700 to 1,900 calories.',
    },
    {
      q: 'What is a safe and healthy calorie deficit?',
      a: 'A moderate deficit of 300 to 500 calories per day (leading to roughly 0.5 to 1.0 pound of fat loss per week) is considered the gold standard by clinical dietitians. It maximizes fat loss while preventing muscle loss, hormone disruption, or fatigue.',
    },
    {
      q: 'How do I eat in a calorie deficit without feeling hungry?',
      a: 'Prioritize high-satiety whole foods: 1. Keep protein high (0.8-1.0g per lb of body weight). 2. Eat high-volume, low-calorie foods like leafy greens, broccoli, and berries. 3. Drink plenty of water and prioritize quality sleep.',
    },
  ];

  const faqSchema = generateFaqJsonLd(deficitFaqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-sans text-[#786C62]">
          <Link href="/" className="hover:text-[#181513]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#C4552D] font-semibold">What is a Calorie Deficit?</span>
        </nav>

        {/* Hero Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full gold-seal text-xs font-sans font-semibold shadow-2xs">
            <Award className="w-3.5 h-3.5 text-[#C9822B]" />
            <span>CLINICAL NUTRITION GUIDE • 2026 EDITION</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#181513] tracking-tight leading-[1.15]">
            What is a <span className="text-[#C4552D] italic font-normal">Calorie Deficit?</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#786C62] font-sans leading-relaxed">
            The fundamental biological principle behind human fat loss, explained with clinical precision and actionable formulas.
          </p>
        </div>

        {/* Quick Definition Box (Targeting Google Featured Snippet Position 0) */}
        <div className="editorial-card rounded-3xl p-6 sm:p-8 bg-[#FDF2EE] border-[#F2C5B3] space-y-3">
          <div className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#C4552D]">
            Key Takeaway (Definition)
          </div>
          <p className="font-serif text-lg sm:text-xl text-[#181513] leading-relaxed font-bold">
            A <strong>calorie deficit</strong> is a state in which you consume fewer calories than your body expends over a 24-hour period. Because of the First Law of Thermodynamics, your body compensates for this energy shortfall by metabolizing stored adipose tissue (fat), resulting in body weight reduction.
          </p>
        </div>

        {/* 3-Step Formula to Calculate Deficit */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513]">
            How to Calculate Your Calorie Deficit in 3 Steps
          </h2>

          <div className="space-y-4">
            <div className="editorial-card rounded-3xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#181513] text-white flex items-center justify-center font-bold font-serif shrink-0">
                1
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-[#181513]">Find Your BMR (Basal Metabolic Rate)</h3>
                <p className="text-xs sm:text-sm text-[#786C62] leading-relaxed">
                  Use the Mifflin-St Jeor equation to determine how many calories your body burns at complete rest:
                  <br />
                  <code className="text-[11px] bg-[#FAF8F5] p-1 rounded font-mono text-[#C4552D] block mt-1">
                    Men: (10 × wt in kg) + (6.25 × ht in cm) - (5 × age) + 5
                    <br />
                    Women: (10 × wt in kg) + (6.25 × ht in cm) - (5 × age) - 161
                  </code>
                </p>
              </div>
            </div>

            <div className="editorial-card rounded-3xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#181513] text-white flex items-center justify-center font-bold font-serif shrink-0">
                2
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-[#181513]">Calculate Your Total Burn (TDEE)</h3>
                <p className="text-xs sm:text-sm text-[#786C62] leading-relaxed">
                  Multiply your BMR by your physical activity multiplier (Sedentary: 1.2x, Moderate: 1.55x, Very Active: 1.725x).
                </p>
              </div>
            </div>

            <div className="editorial-card rounded-3xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#181513] text-white flex items-center justify-center font-bold font-serif shrink-0">
                3
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-[#181513]">Apply the 300–500 kcal Deficit</h3>
                <p className="text-xs sm:text-sm text-[#786C62] leading-relaxed">
                  Subtract 300 to 500 calories from your TDEE. This yields roughly 0.5 to 1.0 lb of weekly fat loss without muscle catabolism or hormonal stress.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/calorie-calculator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C4552D] hover:bg-[#A03E1B] text-white font-sans font-bold text-sm shadow-sm transition-all"
            >
              <Calculator className="w-4 h-4" />
              <span>Open Interactive Calorie &amp; Deficit Calculator &rarr;</span>
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="editorial-card rounded-3xl p-6 sm:p-10 space-y-8">
          <div>
            <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-[#C4552D]">
              People Also Ask
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513] mt-0.5">
              Frequently Asked Questions on Calorie Deficit
            </h2>
          </div>

          <div className="space-y-4">
            {deficitFaqs.map((faq, idx) => (
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
