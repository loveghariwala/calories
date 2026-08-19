import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getFoodBySlug, getTopComparisonPairs } from '@/data/foodDatabase';
import { searchLiveUSDA, getLiveUSDAFoodById } from '@/lib/usdaApi';
import { FoodComparisonView } from '@/components/FoodComparisonView';
import { MonetizationSection } from '@/components/MonetizationSlots';
import { MealBuilderDock } from '@/components/MealBuilderDock';
import {
  generateBreadcrumbJsonLd,
  generateComparisonMetaTitle,
  generateComparisonMetaDescription,
  getCanonicalUrl,
} from '@/lib/seo';
import { ChevronRight } from 'lucide-react';

interface ComparisonPairPageProps {
  params: Promise<{
    pair: string;
  }>;
}

export async function generateStaticParams() {
  const pairs = getTopComparisonPairs();
  return pairs.map((p) => ({
    pair: p.slug,
  }));
}

export async function generateMetadata({ params }: ComparisonPairPageProps): Promise<Metadata> {
  const { pair } = await params;
  const parts = pair.split('-vs-');
  if (parts.length !== 2) {
    return { title: 'Comparison | CaloriePulse' };
  }

  let food1 = getFoodBySlug(parts[0]);
  let food2 = getFoodBySlug(parts[1]);

  if (!food1) {
    const fdcId = parts[0].startsWith('usda-') ? parts[0].split('-')[1] : null;
    food1 = (fdcId ? await getLiveUSDAFoodById(fdcId) : (await searchLiveUSDA(parts[0].replace(/-/g, ' '), 1))[0]) || undefined;
  }

  if (!food2) {
    const fdcId = parts[1].startsWith('usda-') ? parts[1].split('-')[1] : null;
    food2 = (fdcId ? await getLiveUSDAFoodById(fdcId) : (await searchLiveUSDA(parts[1].replace(/-/g, ' '), 1))[0]) || undefined;
  }

  if (!food1 || !food2) {
    return { title: 'Food Comparison | CaloriePulse' };
  }

  const title = generateComparisonMetaTitle(food1, food2);
  const description = generateComparisonMetaDescription(food1, food2);
  const canonical = getCanonicalUrl(`/compare/${pair}`);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'CaloriePulse',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ComparisonPairPage({ params }: ComparisonPairPageProps) {
  const { pair } = await params;
  const parts = pair.split('-vs-');
  if (parts.length !== 2) {
    notFound();
  }

  let food1 = getFoodBySlug(parts[0]);
  let food2 = getFoodBySlug(parts[1]);

  if (!food1) {
    const fdcId = parts[0].startsWith('usda-') ? parts[0].split('-')[1] : null;
    food1 = (fdcId ? await getLiveUSDAFoodById(fdcId) : (await searchLiveUSDA(parts[0].replace(/-/g, ' '), 1))[0]) || undefined;
  }

  if (!food2) {
    const fdcId = parts[1].startsWith('usda-') ? parts[1].split('-')[1] : null;
    food2 = (fdcId ? await getLiveUSDAFoodById(fdcId) : (await searchLiveUSDA(parts[1].replace(/-/g, ' '), 1))[0]) || undefined;
  }

  if (!food1 || !food2) {
    notFound();
  }

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Food Face-Off', url: '/compare' },
    { name: `${food1.name} vs ${food2.name}`, url: `/compare/${pair}` },
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
          <Link href="/compare" className="hover:text-[#C85A32] transition-colors">
            Food Face-Off
          </Link>
          <ChevronRight className="w-3 h-3 text-[#9C8E82]" />
          <span className="font-semibold text-[#1A1715]">
            {food1.name} vs {food2.name}
          </span>
        </nav>

        {/* Hero Header */}
        <div className="editorial-card rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-4xl p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD4] shadow-xs">
              {food1.emoji} vs {food2.emoji}
            </span>
            <div>
              <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#C85A32]">
                Side-by-Side Face-Off
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1A1715] tracking-tight">
                {food1.name} vs {food2.name}
              </h1>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#7A6F66] max-w-3xl leading-relaxed font-sans">
            Compare calories, protein efficiency, carbohydrates, and dietary lipids per 100g and standard portion weights.
          </p>
        </div>

        {/* Comparison Engine */}
        <FoodComparisonView initialFood1={food1} initialFood2={food2} />

        <MonetizationSection />
      </main>

      <MealBuilderDock />
    </>
  );
}
