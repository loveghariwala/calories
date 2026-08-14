import { Metadata } from 'next';
import Link from 'next/link';
import { getAllFoods } from '@/data/foodDatabase';
import { FoodCard } from '@/components/FoodCard';
import { MealBuilderDock } from '@/components/MealBuilderDock';
import { generateFaqJsonLd, getCanonicalUrl } from '@/lib/seo';
import { Award, ChevronRight, Sparkles, Flame, Apple, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Low Calorie Snacks — 50+ Healthy Snacks Under 100 Calories | CaloriePulse',
  description:
    'Discover the best low calorie snacks under 50, 100, and 150 calories. High protein, fiber-rich whole foods, and filling snack ideas with exact USDA calorie & macro counts.',
  keywords: [
    'low calorie snacks',
    'healthy low calorie snacks',
    'low calorie snacks under 100 calories',
    'filling low calorie snacks',
    'high protein low calorie snacks',
    'low calorie snack ideas',
    'snacks for weight loss',
    'zero calorie snacks',
  ],
  alternates: {
    canonical: getCanonicalUrl('/low-calorie-snacks'),
  },
  openGraph: {
    title: 'Low Calorie Snacks — 50+ Healthy Snacks Under 100 Calories',
    description:
      'Curated list of filling, nutrient-dense low calorie snacks for fat loss with complete USDA nutrition facts.',
    url: getCanonicalUrl('/low-calorie-snacks'),
    siteName: 'CaloriePulse',
    type: 'website',
  },
};

export default function LowCalorieSnacksPage() {
  const allFoods = getAllFoods();
  const lowCalSnacks = allFoods
    .filter(
      (f) =>
        f.tags.includes('snack') ||
        f.tags.includes('low-calorie') ||
        f.category === 'fruits' ||
        f.nutrientsPer100g.calories <= 130
    )
    .sort((a, b) => a.nutrientsPer100g.calories - b.nutrientsPer100g.calories);

  const under50Cal = lowCalSnacks.filter((f) => f.nutrientsPer100g.calories <= 55);
  const under100Cal = lowCalSnacks.filter(
    (f) => f.nutrientsPer100g.calories > 55 && f.nutrientsPer100g.calories <= 100
  );
  const highProteinSnacks = lowCalSnacks.filter((f) => f.nutrientsPer100g.protein >= 10);

  const snackFaqs = [
    {
      q: 'What are the most filling low calorie snacks for weight loss?',
      a: 'The most satiating low calorie snacks are high in protein and water volume or prebiotic dietary fiber. Top choices include Nonfat Plain Greek Yogurt (100 kcal, 17.5g protein), Low-Fat Cottage Cheese (95 kcal, 12.4g protein), Fresh Strawberries (32 kcal/100g), and Fuji Apples (52 kcal/100g).',
    },
    {
      q: 'What are snacks with under 50 calories?',
      a: 'Fresh strawberries (32 kcal/100g), watermelon cubes (30 kcal/100g), cucumber slices (15 kcal/100g), celery stalks with sea salt (14 kcal/100g), and egg whites (17 kcal per large white) are excellent snacks under 50 calories.',
    },
    {
      q: 'Can I eat snacks while in a calorie deficit?',
      a: 'Yes! Incorporating high-protein, fiber-dense low calorie snacks helps stabilize blood sugar, prevents hunger crashes, and makes sticking to your daily caloric budget effortless.',
    },
  ];

  const faqSchema = generateFaqJsonLd(snackFaqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-sans text-[#786C62]">
          <Link href="/" className="hover:text-[#181513]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#C4552D] font-semibold">Low Calorie Snacks</span>
        </nav>

        {/* Masthead Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full gold-seal text-xs font-sans font-semibold shadow-2xs">
            <Award className="w-3.5 h-3.5 text-[#C9822B]" />
            <span>SATIETY-MAXIMIZED WHOLE FOOD SNACKS</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#181513] tracking-tight leading-[1.15]">
            Healthy <span className="text-[#C4552D] italic font-normal">Low Calorie Snacks</span>
          </h1>

          <p className="text-base sm:text-lg text-[#786C62] font-sans leading-relaxed">
            High-protein, fiber-rich snacks under 50, 100, and 150 calories. Calibrated for maximum fullness and effortless fat loss.
          </p>
        </div>

        {/* Quick Density Anchor Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="#under-50"
            className="px-4 py-2 rounded-full bg-white border border-[#EAE3D9] hover:border-[#C4552D] text-xs font-bold text-[#181513] shadow-2xs transition-colors"
          >
            🔥 Under 50 kcal Snacks ({under50Cal.length})
          </a>
          <a
            href="#under-100"
            className="px-4 py-2 rounded-full bg-white border border-[#EAE3D9] hover:border-[#C4552D] text-xs font-bold text-[#181513] shadow-2xs transition-colors"
          >
            🥗 50–100 kcal Snacks ({under100Cal.length})
          </a>
          <a
            href="#high-protein-snacks"
            className="px-4 py-2 rounded-full bg-white border border-[#EAE3D9] hover:border-[#C4552D] text-xs font-bold text-[#181513] shadow-2xs transition-colors"
          >
            🏋️ High-Protein Snacks (&gt;10g P)
          </a>
        </div>

        {/* Section 1: Under 50 Cal Snacks */}
        <section id="under-50" className="space-y-6">
          <div>
            <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-[#3B5842]">
              Ultra-Low Density Volume
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513] mt-0.5">
              Snacks Under 50 Calories (Per 100g)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {under50Cal.slice(0, 6).map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </section>

        {/* Section 2: 50-100 Cal Snacks */}
        <section id="under-100" className="space-y-6">
          <div>
            <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-[#C9822B]">
              Balanced Energy Satiety
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513] mt-0.5">
              Snacks Between 50 to 100 Calories
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {under100Cal.slice(0, 6).map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </section>

        {/* Section 3: High Protein Snacks */}
        <section id="high-protein-snacks" className="space-y-6">
          <div>
            <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-[#C4552D]">
              Muscle Preservation &amp; Hunger Control
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513] mt-0.5">
              High-Protein Low Calorie Snacks
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {highProteinSnacks.slice(0, 6).map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="editorial-card rounded-3xl p-6 sm:p-10 space-y-8">
          <div>
            <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-[#C4552D]">
              Nutrition Knowledge
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513] mt-0.5">
              Low Calorie Snack FAQs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {snackFaqs.map((faq, idx) => (
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
