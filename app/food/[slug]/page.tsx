import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllFoods, getFoodBySlug, getRelatedFoods } from '@/data/foodDatabase';
import { getLiveUSDAFoodById } from '@/lib/usdaApi';
import { InteractiveNutritionStudio } from '@/components/InteractiveNutritionStudio';
import { FoodCard } from '@/components/FoodCard';
import { MonetizationSection } from '@/components/MonetizationSlots';
import { MealBuilderDock } from '@/components/MealBuilderDock';
import { Food3DAsset } from '@/components/Food3DAsset';
import { InteractiveTilt } from '@/components/InteractiveTilt';
import {
  generateFoodJsonLd,
  generateBreadcrumbJsonLd,
  generateFaqJsonLd,
  generateFoodMetaTitle,
  generateFoodMetaDescription,
  getCanonicalUrl,
} from '@/lib/seo';
import { ChevronRight } from 'lucide-react';

interface FoodPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const foods = getAllFoods();
  return foods.map((food) => ({
    slug: food.slug,
  }));
}

export async function generateMetadata({ params }: FoodPageProps): Promise<Metadata> {
  const { slug } = await params;
  let food = getFoodBySlug(slug);

  if (!food && slug.startsWith('usda-')) {
    const fdcId = slug.split('-')[1];
    food = (await getLiveUSDAFoodById(fdcId)) || undefined;
  }

  if (!food) {
    return {
      title: 'Food Not Found | CaloriePulse',
      description: 'The requested food specimen could not be found.',
    };
  }

  const title = generateFoodMetaTitle(food);
  const description = generateFoodMetaDescription(food);
  const canonical = getCanonicalUrl(`/food/${food.slug}`);

  return {
    title,
    description,
    keywords: [
      `${food.name.toLowerCase()} calories`,
      `${food.name.toLowerCase()} protein`,
      `${food.name.toLowerCase()} nutrition facts`,
      'usda food calories',
      'macro breakdown',
      ...food.tags,
    ],
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
  };
}

export default async function FoodPage({ params }: FoodPageProps) {
  const { slug } = await params;
  let food = getFoodBySlug(slug);

  if (!food && slug.startsWith('usda-')) {
    const fdcId = slug.split('-')[1];
    food = (await getLiveUSDAFoodById(fdcId)) || undefined;
  }

  if (!food) {
    notFound();
  }

  const relatedFoods = getRelatedFoods(food, 3);
  const defaultServing = food.servings.find((s) => s.isDefault) || food.servings[0];
  const ratio = (defaultServing ? defaultServing.weightGrams : 100) / 100;
  const n = food.nutrientsPer100g;

  const cals = Math.round(n.calories * ratio);
  const prot = Math.round(n.protein * ratio * 10) / 10;
  const carbs = Math.round(n.carbohydrates * ratio * 10) / 10;
  const fat = Math.round(n.fat * ratio * 10) / 10;

  // JSON-LD structured data
  const foodJsonLd = generateFoodJsonLd(food);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: food.categoryName, url: `/category/${food.category}` },
    { name: food.name, url: `/food/${food.slug}` },
  ]);

  const defaultFaqs = [
    {
      q: `How many calories are in ${food.name}?`,
      a: `There are ${cals} calories in a ${defaultServing.label} serving of ${food.name}, providing ${prot}g protein, ${carbs}g carbohydrates, and ${fat}g fat.`,
    },
    {
      q: `What is the protein density of ${food.name}?`,
      a: `${food.name} contains ${n.protein}g protein per 100g. It is lab-verified by USDA FoodData Central.`,
    },
  ];

  const faqs = food.faqs && food.faqs.length > 0 ? food.faqs : defaultFaqs;
  const faqJsonLd = generateFaqJsonLd(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(foodJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 font-sans">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-sans text-[#786C62]">
          <Link href="/" className="hover:text-[#C4552D] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-[#9C8E82]" />
          <Link href={`/category/${food.category}`} className="hover:text-[#C4552D] transition-colors">
            {food.categoryName}
          </Link>
          <ChevronRight className="w-3 h-3 text-[#9C8E82]" />
          <span className="font-semibold text-[#181513] truncate max-w-xs">{food.name}</span>
        </nav>

        {/* Hero Header */}
        <InteractiveTilt maxTilt={4} scale={1.01} className="w-full">
          <div className="editorial-card rounded-3xl p-6 sm:p-10 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-[#FAF8F5] border border-[#EAE3D9] shadow-sm">
                  {food.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={food.imageUrl}
                      alt={food.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-5xl">
                      {food.emoji}
                    </span>
                  )}
                  <span className="absolute bottom-1.5 right-1.5 text-base bg-white/80 backdrop-blur-xs rounded-full px-1.5 shadow-2xs">
                    {food.emoji}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full gold-seal text-[10px] font-sans font-bold uppercase tracking-wider">
                      USDA #{food.usdaId || '8841'}
                    </span>
                    <span className="text-xs font-sans text-[#786C62]">{food.categoryName}</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#181513] tracking-tight">
                    {food.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#786C62] max-w-2xl leading-relaxed">
                    {food.description}
                  </p>
                </div>
              </div>

              {/* Quick Macro Pills */}
              <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] self-start md:self-auto min-w-[240px]">
                <div>
                  <span className="text-[10px] font-bold text-[#3B5842] uppercase block">Protein</span>
                  <span className="text-lg font-serif font-bold text-[#181513]">{prot}g</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#C9822B] uppercase block">Carbs</span>
                  <span className="text-lg font-serif font-bold text-[#181513]">{carbs}g</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#C4552D] uppercase block">Fat</span>
                  <span className="text-lg font-serif font-bold text-[#181513]">{fat}g</span>
                </div>
              </div>
            </div>
          </div>
        </InteractiveTilt>

        {/* Live Portion Laboratory */}
        <InteractiveNutritionStudio food={food} />

        {/* Related Whole Foods */}
        {relatedFoods.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-[#C4552D]">
                  Culinary Relatives
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#181513] mt-0.5">
                  Explore Similar Whole Foods
                </h3>
              </div>
              <Link
                href={`/category/${food.category}`}
                className="text-xs font-sans font-semibold text-[#C4552D] hover:underline"
              >
                View Category &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedFoods.map((item, idx) => (
                <FoodCard key={`${item.id}-${idx}`} food={item} />
              ))}
            </div>
          </section>
        )}

        {/* FAQs */}
        <section className="editorial-card rounded-3xl p-6 sm:p-10 space-y-6">
          <h3 className="font-serif text-2xl font-bold text-[#181513]">
            Frequently Asked Questions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => {
              const qText = 'q' in faq ? faq.q : faq.question;
              const aText = 'a' in faq ? faq.a : faq.answer;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] space-y-2">
                  <h4 className="font-serif font-bold text-sm text-[#181513]">{qText}</h4>
                  <p className="text-xs text-[#786C62] leading-relaxed">{aText}</p>
                </div>
              );
            })}
          </div>
        </section>

        <MonetizationSection />
      </main>

      <MealBuilderDock />
    </>
  );
}
