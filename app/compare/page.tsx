import { Metadata } from 'next';
import { getAllFoods, getFoodBySlug, getTopComparisonPairs } from '@/data/foodDatabase';
import { searchLiveUSDA } from '@/lib/usdaApi';
import { FoodComparisonView } from '@/components/FoodComparisonView';
import { MonetizationSection } from '@/components/MonetizationSlots';
import { MealBuilderDock } from '@/components/MealBuilderDock';
import { generateBreadcrumbJsonLd, getCanonicalUrl } from '@/lib/seo';
import { Scale, ChevronRight, Swords, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Food Face-Off Arena — Compare Food Calories, Protein & Macros Side-by-Side | CaloriePulse',
  description:
    'Compare any two whole foods head-to-head. Analyze calories, protein density, carbs, healthy fats, fiber, and micronutrients side-by-side.',
  alternates: {
    canonical: getCanonicalUrl('/compare'),
  },
  openGraph: {
    title: 'Food Face-Off Arena — Side-by-Side Nutritional Comparison',
    description: 'Compare any two whole foods head-to-head. Powered by USDA FoodData Central.',
    url: getCanonicalUrl('/compare'),
    siteName: 'CaloriePulse',
    type: 'website',
  },
};

interface ComparePageProps {
  searchParams: Promise<{
    food1?: string;
    food2?: string;
  }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { food1: f1Slug, food2: f2Slug } = await searchParams;
  const allFoods = getAllFoods();
  const topPairs = getTopComparisonPairs();

  let food1 = f1Slug ? getFoodBySlug(f1Slug) : allFoods[0];
  let food2 = f2Slug ? getFoodBySlug(f2Slug) : (allFoods[1] || allFoods[0]);

  if (!food1) {
    const results = await searchLiveUSDA(f1Slug ? f1Slug.replace(/-/g, ' ') : 'chicken breast', 1);
    food1 = results[0];
  }

  if (!food2) {
    const results = await searchLiveUSDA(f2Slug ? f2Slug.replace(/-/g, ' ') : 'salmon fillet', 1);
    food2 = results[0];
  }

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Food Face-Off', url: '/compare' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-sans text-[#7A6F66]">
          <Link href="/" className="hover:text-[#C85A32] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-[#9C8E82]" />
          <span className="font-semibold text-[#1A1715]">
            Food Face-Off Arena
          </span>
        </nav>

        {/* Hero Header */}
        <div className="editorial-card rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-4xl p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD4] shadow-xs">
              ⚖️
            </span>
            <div>
              <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#C85A32]">
                Side-by-Side Face-Off
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1A1715] tracking-tight">
                Compare Any Two Foods Head-to-Head
              </h1>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#7A6F66] max-w-3xl leading-relaxed font-sans">
            Which food is more nutrient-dense? Select any two foods below to analyze calories, protein efficiency, and macronutrient breakdowns side-by-side.
          </p>
        </div>

        {/* Comparison Engine */}
        <FoodComparisonView initialFood1={food1} initialFood2={food2} />

        {/* Top Comparison Matches */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1715]">
            Popular Food Face-Offs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topPairs.map((pair) => (
              <Link
                key={pair.slug}
                href={`/compare/${pair.slug}`}
                className="p-5 rounded-2xl bg-white border border-[#E8DFD4] hover:border-[#C85A32] transition-colors group shadow-xs"
              >
                <div className="flex items-center justify-between text-2xl mb-3">
                  <span>{pair.food1.emoji}</span>
                  <span className="text-[10px] font-sans font-bold text-[#C85A32] px-2 py-0.5 rounded-full bg-[#F7EDE7]">
                    VS
                  </span>
                  <span>{pair.food2.emoji}</span>
                </div>
                <h3 className="font-serif font-bold text-sm text-[#1A1715] group-hover:text-[#C85A32] transition-colors line-clamp-1">
                  {pair.food1.name} vs {pair.food2.name}
                </h3>
                <div className="text-xs font-sans text-[#7A6F66] mt-1">
                  {pair.food1.nutrientsPer100g.calories} kcal vs {pair.food2.nutrientsPer100g.calories} kcal
                </div>
              </Link>
            ))}
          </div>
        </section>

        <MonetizationSection />
      </main>

      <MealBuilderDock />
    </>
  );
}
