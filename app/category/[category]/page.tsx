import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES, getFoodsByCategory, getCategoryBySlug } from '@/data/foodDatabase';
import { FoodCard } from '@/components/FoodCard';
import { MonetizationSection } from '@/components/MonetizationSlots';
import { MealBuilderDock } from '@/components/MealBuilderDock';
import {
  generateBreadcrumbJsonLd,
  generateCategoryMetaTitle,
  generateCategoryMetaDescription,
  getCanonicalUrl,
} from '@/lib/seo';
import { Sparkles, ChevronRight, Apple, ArrowRight } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const catMeta = getCategoryBySlug(category);

  if (!catMeta) {
    return {
      title: 'Category Not Found | CaloriePulse',
      description: 'The requested food category could not be found.',
    };
  }

  const title = generateCategoryMetaTitle(catMeta.name);
  const description = generateCategoryMetaDescription(catMeta.name, catMeta.description);
  const canonical = getCanonicalUrl(`/category/${catMeta.slug}`);

  return {
    title,
    description,
    keywords: [
      `${catMeta.name.toLowerCase()} calories`,
      `${catMeta.name.toLowerCase()} nutrition`,
      'food calorie lookup',
      'macro calculator',
      'protein list',
      'usda food database',
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'CaloriePulse',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const catMeta = getCategoryBySlug(category);

  if (!catMeta) {
    notFound();
  }

  let foods = getFoodsByCategory(catMeta.slug);
  if (foods.length === 0) {
    foods = await searchLiveUSDA(catMeta.name, 12);
  }

  // Averages calculation
  const avgCalories = Math.round(
    foods.reduce((sum, f) => sum + (f.nutrientsPer100g?.calories || 0), 0) / (foods.length || 1)
  );
  const avgProtein =
    Math.round(
      (foods.reduce((sum, f) => sum + (f.nutrientsPer100g?.protein || 0), 0) / (foods.length || 1)) * 10
    ) / 10;
  const avgCarbs =
    Math.round(
      (foods.reduce((sum, f) => sum + (f.nutrientsPer100g?.carbohydrates || 0), 0) / (foods.length || 1)) *
        10
    ) / 10;
  const avgFat =
    Math.round(
      (foods.reduce((sum, f) => sum + (f.nutrientsPer100g?.fat || 0), 0) / (foods.length || 1)) * 10
    ) / 10;

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: catMeta.name, url: `/category/${catMeta.slug}` },
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
            {catMeta.name}
          </span>
        </nav>

        {/* Hero Category Banner */}
        <div className="editorial-card rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-4">
                <span className="text-5xl p-3.5 rounded-3xl bg-[#FAF7F2] border border-[#E8DFD4]">
                  {catMeta.emoji}
                </span>
                <div>
                  <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#C85A32]">
                    Whole Food Category
                  </span>
                  <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1A1715] tracking-tight">
                    {catMeta.name}
                  </h1>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#7A6F66] leading-relaxed font-sans pt-1">
                {catMeta.description} Compare portion calories, protein density, and nutrient facts across {foods.length} lab-verified USDA foods.
              </p>
            </div>

            {/* Category Averages */}
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD4] space-y-3 min-w-[260px]">
              <div className="text-xs font-sans font-semibold text-[#7A6F66] uppercase tracking-wider">
                Category Averages (Per 100g)
              </div>
              <div className="text-3xl font-serif font-bold text-[#1A1715]">
                {avgCalories} <span className="text-xs font-sans font-normal text-[#C85A32]">kcal avg</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-[#E8DFD4]">
                <div className="p-2 bg-white rounded-xl border border-[#E8DFD4]">
                  <span className="text-[10px] text-[#3D5A45] font-bold block uppercase">Protein</span>
                  <span className="font-serif font-bold text-sm text-[#1A1715]">{avgProtein}g</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-[#E8DFD4]">
                  <span className="text-[10px] text-[#D48B38] font-bold block uppercase">Carbs</span>
                  <span className="font-serif font-bold text-sm text-[#1A1715]">{avgCarbs}g</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-[#E8DFD4]">
                  <span className="text-[10px] text-[#C85A32] font-bold block uppercase">Fat</span>
                  <span className="font-serif font-bold text-sm text-[#1A1715]">{avgFat}g</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Food Directory Cards */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1715]">
              Whole Food Specimens ({foods.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </section>

        <MonetizationSection />
      </main>

      <MealBuilderDock />
    </>
  );
}
