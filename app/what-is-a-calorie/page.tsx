import { Metadata } from 'next';
import Link from 'next/link';
import { MealBuilderDock } from '@/components/MealBuilderDock';
import { NutritionCalculators } from '@/components/NutritionCalculators';
import {
  generateFaqJsonLd,
  generateBreadcrumbJsonLd,
  getCanonicalUrl,
  SITE_URL,
  SITE_NAME,
} from '@/lib/seo';
import {
  Award,
  ChevronRight,
  Flame,
  Zap,
  Scale,
  Calculator,
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Atom,
  Dna,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'What is a Calorie? Definition & Kcal Meaning',
  description:
    'What is a calorie? Discover the definition of calorie and kcal meaning in food. Learn how many kcal are in a cal, the 4-4-9 macro rule, and energy intake.',
  keywords: [
    'what is a calorie',
    'calorie definition',
    'define the word calorie',
    'kcal meaning',
    'whats kcal',
    'kcal definition',
    'what is kcal in food',
    'what are calories',
    'how many kcal are in a cal',
    'definition of calorie',
    'what is a calorie in terms of food',
    'what is the meaning of calories',
    'calories definition health',
    'a calorie is a unit of',
  ],
  alternates: {
    canonical: getCanonicalUrl('/what-is-a-calorie'),
  },
  openGraph: {
    title: 'What is a Calorie? Definition & Kcal Meaning | CaloriePulse',
    description:
      'What is a calorie? Discover the definition of calorie and kcal meaning in food. Learn how many kcal are in a cal, the 4-4-9 macro rule, and energy intake.',
    url: getCanonicalUrl('/what-is-a-calorie'),
    siteName: SITE_NAME,
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What is a Calorie? Definition & Kcal Meaning | CaloriePulse',
    description:
      'What is a calorie? Discover the definition of calorie and kcal meaning in food. Learn how many kcal are in a cal, the 4-4-9 macro rule, and energy intake.',
  },
};

export default function WhatIsACaloriePage() {
  const calorieFaqs = [
    {
      question: 'What is a calorie and what is the scientific calorie definition?',
      answer:
        'A calorie is a unit of measurement for energy. In physics, one small calorie (cal) is the heat energy required to raise the temperature of 1 gram of water by 1°C. In dietary nutrition, 1 food Calorie (kcal) equals 1,000 small calories or 4.184 kilojoules (kJ).',
    },
    {
      question: 'What does kcal mean and what is kcal in food?',
      answer:
        'Kcal stands for kilocalorie. In food and nutrition, "kcal" and "Calorie" (with a capital C) are used interchangeably. When a nutrition facts label indicates a snack has 150 calories, it scientifically contains 150 kcal of metabolic energy.',
    },
    {
      question: 'How many kcal are in a cal?',
      answer:
        'There is 1 kcal in 1,000 small calories (cal). A small calorie is a chemistry laboratory measurement, whereas human dietary energy is always measured in kilocalories (kcal).',
    },
    {
      question: 'What is a calorie in terms of food energy?',
      answer:
        'In food, calories represent the chemical energy stored in macronutrients: carbohydrates (4 kcal/g), proteins (4 kcal/g), and dietary fats (9 kcal/g). Your body converts these calories into ATP to fuel basal metabolism, organ function, and physical exercise.',
    },
    {
      question: 'How many calories should an adult eat to lose weight?',
      answer:
        'To lose weight safely, health authorities recommend creating a moderate calorie deficit of 300 to 500 calories below your Total Daily Energy Expenditure (TDEE). Use our free Weight Loss Calorie Calculator to find your target.',
    },
  ];

  const faqSchema = generateFaqJsonLd(calorieFaqs);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'What is a Calorie?', url: '/what-is-a-calorie' },
  ]);

  // DefinedTerm & ScholarlyArticle Schema linking directly to Wikidata / Wikipedia entity
  const entitySchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${SITE_URL}/what-is-a-calorie#term`,
    name: 'Calorie',
    description:
      'A unit of energy widely used in nutrition and thermodynamics. One dietary calorie (kcal) equals 4,184 joules.',
    sameAs: [
      'https://en.wikipedia.org/wiki/Calorie',
      'https://www.wikidata.org/wiki/Q130964',
    ],
    inDefinedTermSet: 'https://en.wikipedia.org/wiki/International_System_of_Units',
  };

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(entitySchema) }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-sans text-[#7A6F66]">
          <Link href="/" className="hover:text-[#C85A32] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-[#9C8E82]" />
          <span className="font-semibold text-[#1A1715]">
            What is a Calorie?
          </span>
        </nav>

        {/* Hero Section */}
        <div className="editorial-card rounded-3xl p-6 sm:p-12 relative overflow-hidden space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 rounded-full gold-seal text-[11px] font-sans font-bold uppercase tracking-wider">
              Clinical Science & Thermodynamics
            </span>
            <span className="text-xs font-sans text-[#7A6F66]">USDA & Physics Standards</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1A1715] tracking-tight max-w-4xl">
            What is a Calorie? The Definitive Scientific & Nutritional Guide
          </h1>

          {/* Featured Snippet Box (Designed for Google Position 0 / AI Overview) */}
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border-2 border-[#E8DFD4] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C85A32]">
              <Zap className="w-4 h-4" />
              Direct Definition
            </div>
            <p className="text-base sm:text-lg text-[#1A1715] leading-relaxed font-sans">
              A <strong>calorie</strong> is a unit of measurement for energy. In human nutrition, dietary calories (technically <strong>kilocalories</strong> or <strong>kcal</strong>) measure the chemical energy released when your body breaks down carbohydrates (4 kcal/g), proteins (4 kcal/g), and fats (9 kcal/g) to fuel basal metabolism, cellular repair, and physical activity.
            </p>
          </div>
        </div>

        {/* Physics vs Nutrition Comparison Matrix */}
        <section className="space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-[#C85A32]">
              Thermodynamic Foundations
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1715]">
              Small Calorie (cal) vs. Food Calorie (kcal)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card rounded-2xl p-6 space-y-3 border border-[#E8DFD4]">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DFD4] flex items-center justify-center text-[#C85A32]">
                <Atom className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1A1715]">1 Small Calorie (cal)</h3>
              <p className="text-xs text-[#7A6F66] leading-relaxed">
                The precise amount of thermal heat required to raise the temperature of <strong>1 gram of water by 1°C</strong> at standard atmospheric pressure. Used in physics and laboratory chemistry.
              </p>
              <div className="text-xs font-mono font-bold text-[#C85A32] pt-2 border-t border-[#E8DFD4]">
                1 cal = 4.184 Joules (J)
              </div>
            </div>

            <div className="editorial-card rounded-2xl p-6 space-y-3 border-2 border-[#C85A32]/40 bg-[#FAF7F2]">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E8DFD4] flex items-center justify-center text-[#C85A32]">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1A1715]">1 Food Calorie (kcal / Cal)</h3>
              <p className="text-xs text-[#7A6F66] leading-relaxed">
                Equal to <strong>1,000 small calories</strong>. This is the standard unit printed on all FDA nutrition facts labels and used by dietitians worldwide to measure human dietary energy.
              </p>
              <div className="text-xs font-mono font-bold text-[#C85A32] pt-2 border-t border-[#E8DFD4]">
                1 kcal = 1,000 cal = 4.184 kJ
              </div>
            </div>

            <div className="editorial-card rounded-2xl p-6 space-y-3 border border-[#E8DFD4]">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DFD4] flex items-center justify-center text-[#C85A32]">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1A1715]">1 Kilojoule (kJ)</h3>
              <p className="text-xs text-[#7A6F66] leading-relaxed">
                The official International System of Units (SI) measure of energy. Widely used on food packaging across the UK, Australia, and European Union.
              </p>
              <div className="text-xs font-mono font-bold text-[#C85A32] pt-2 border-t border-[#E8DFD4]">
                1 kJ = 0.239 kcal (Calories)
              </div>
            </div>
          </div>
        </section>

        {/* The 4-4-9 Atwater System */}
        <section className="editorial-card rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-[#C85A32]">
              The Atwater Energy System
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1715]">
              How Macronutrients Provide Calories
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6F66]">
              Developed by Wilbur Olin Atwater in the late 19th century, the Atwater system calculates available metabolic energy per gram of macronutrient.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD4] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3D5A45]">Carbohydrates</span>
              <div className="text-2xl font-serif font-bold text-[#1A1715]">4 kcal / gram</div>
              <p className="text-xs text-[#7A6F66]">Primary fast-acting energy source for brain and muscle glucose.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD4] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3D5A45]">Proteins</span>
              <div className="text-2xl font-serif font-bold text-[#1A1715]">4 kcal / gram</div>
              <p className="text-xs text-[#7A6F66]">Essential amino acids for muscle protein synthesis, enzymes, and tissue repair.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD4] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32]">Fats (Lipids)</span>
              <div className="text-2xl font-serif font-bold text-[#1A1715]">9 kcal / gram</div>
              <p className="text-xs text-[#7A6F66]">Dense long-term energy storage, hormone production, and cell membrane structure.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD4] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6F66]">Alcohol (Ethanol)</span>
              <div className="text-2xl font-serif font-bold text-[#1A1715]">7 kcal / gram</div>
              <p className="text-xs text-[#7A6F66]">Metabolized directly by the liver; provides non-nutritive empty energy.</p>
            </div>
          </div>
        </section>

        {/* Interactive Calorie Engine */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-[#C85A32]">
                Interactive Laboratory
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1715] mt-0.5">
                Calculate Your Personal Daily Calorie Needs
              </h2>
            </div>
            <Link
              href="/calorie-calculator"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#C85A32] hover:underline"
            >
              Full Calculator Studio &rarr;
            </Link>
          </div>

          <NutritionCalculators />
        </section>

        {/* Frequently Asked Questions */}
        <section className="editorial-card rounded-3xl p-6 sm:p-10 space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1715]">
            Frequently Asked Questions About Calories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {calorieFaqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD4] space-y-2">
                <h3 className="font-serif font-bold text-sm text-[#1A1715]">{faq.question}</h3>
                <p className="text-xs text-[#7A6F66] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <MealBuilderDock />
    </>
  );
}
