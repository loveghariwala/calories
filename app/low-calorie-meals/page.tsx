import { Metadata } from 'next';
import Link from 'next/link';
import { getAllFoods } from '@/data/foodDatabase';
import { FoodCard } from '@/components/FoodCard';
import { MealBuilderDock } from '@/components/MealBuilderDock';
import { generateFaqJsonLd, getCanonicalUrl } from '@/lib/seo';
import { Award, ChevronRight, Sparkles, Flame, Utensils, ArrowRight, Dumbbell } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Low Calorie Meals & High Protein Recipes',
  description:
    'Browse low calorie meals and recipe ideas under 300, 400, and 500 calories. High protein, nutrient-dense meals with USDA nutrition facts labels.',
  keywords: [
    'low calorie meals',
    'high protein low calorie meals',
    '300 calorie meals',
    '400 calorie meals',
    'healthy meals for weight loss',
  ],
  alternates: {
    canonical: getCanonicalUrl('/low-calorie-meals'),
  },
  openGraph: {
    title: 'Low Calorie Meals & High Protein Recipes | CaloriePulse',
    description:
      'Browse low calorie meals and recipe ideas under 300, 400, and 500 calories. High protein, nutrient-dense meals with USDA nutrition facts labels.',
    url: getCanonicalUrl('/low-calorie-meals'),
    siteName: 'CaloriePulse',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Low Calorie Meals & High Protein Recipes | CaloriePulse',
    description:
      'Browse low calorie meals and recipe ideas under 300, 400, and 500 calories. High protein, nutrient-dense meals with USDA nutrition facts labels.',
  },
};

export default function LowCalorieMealsPage() {
  const allFoods = getAllFoods();

  const curatedMealTemplates = [
    {
      title: 'Grilled Lemon Herb Chicken & Steamed Broccoli',
      calories: 320,
      protein: 48,
      carbs: 14,
      fat: 6,
      items: ['Grilled Chicken Breast (180g)', 'Steamed Broccoli Florets (150g)'],
      badge: '🔥 Under 350 kcal',
      color: 'bg-[#EBF2EC] text-[#3B5842] border-[#D5E5D8]',
    },
    {
      title: 'Atlantic Salmon, Jasmine Rice & Asparagus',
      calories: 420,
      protein: 38,
      carbs: 35,
      fat: 14,
      items: ['Baked Salmon Fillet (150g)', 'Cooked Jasmine Rice (100g)'],
      badge: '🌊 Omega-3 Rich',
      color: 'bg-[#FDF2EE] text-[#C4552D] border-[#F2C5B3]',
    },
    {
      title: 'Power Scramble: Whole Eggs, Whites & Sourdough',
      calories: 345,
      protein: 32,
      carbs: 26,
      fat: 11,
      items: ['Whole Egg (1 large)', 'Liquid Egg Whites (150g)', 'Artisan Sourdough Toast (1 slice)'],
      badge: '🌅 Breakfast Staple',
      color: 'bg-[#FDF6EC] text-[#9E5D0E] border-[#E8CEAB]',
    },
    {
      title: 'Greek Yogurt Super Bowl with Blueberries & Honey',
      calories: 235,
      protein: 24,
      carbs: 31,
      fat: 1.5,
      items: ['Nonfat Plain Greek Yogurt (200g)', 'Fresh Blueberries (80g)'],
      badge: '🫐 High Prebiotic',
      color: 'bg-[#F8F2F9] text-[#783872] border-[#DFC2DE]',
    },
  ];

  const mealFaqs = [
    {
      q: 'How many calories should be in a low calorie meal?',
      a: 'A standard low calorie meal for weight loss typically ranges between 300 to 450 calories for women and 400 to 600 calories for men, while providing at least 30 to 45 grams of protein to maximize satiety.',
    },
    {
      q: 'What is the secret to making low calorie meals filling?',
      a: 'The key is "Caloric Volume Optimization": pairing lean proteins (chicken breast, shrimp, egg whites, tilapia) with high-fiber, high-water whole vegetables (broccoli, zucchini, leafy greens) to physically fill your stomach without excess energy.',
    },
    {
      q: 'Can I build muscle while eating low calorie meals?',
      a: 'Yes, as long as you maintain a high protein intake (1.6 to 2.2 grams of protein per kilogram of body weight per day) and engage in progressive resistance training.',
    },
  ];

  const faqSchema = generateFaqJsonLd(mealFaqs);

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
          <span className="text-[#C4552D] font-semibold">Low Calorie Meals</span>
        </nav>

        {/* Masthead Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full gold-seal text-xs font-sans font-semibold shadow-2xs">
            <Award className="w-3.5 h-3.5 text-[#C9822B]" />
            <span>CLINICAL MACRO CALIBRATION</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#181513] tracking-tight leading-[1.15]">
            High-Protein <span className="text-[#C4552D] italic font-normal">Low Calorie Meals</span>
          </h1>

          <p className="text-base sm:text-lg text-[#786C62] font-sans leading-relaxed">
            Nutrient-dense meal blueprints under 300, 400, and 500 calories designed for high satiety, lean muscle retention, and continuous fat loss.
          </p>
        </div>

        {/* Curated Whole Food Meal Blueprints */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {curatedMealTemplates.map((meal, idx) => (
            <div
              key={idx}
              className="editorial-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#C4552D] transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-sans font-bold px-3 py-1 rounded-full border ${meal.color}`}>
                    {meal.badge}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-serif font-bold text-[#181513]">{meal.calories}</span>
                    <span className="text-xs text-[#786C62] ml-1">kcal</span>
                  </div>
                </div>

                <h3 className="font-serif font-bold text-xl text-[#181513]">
                  {meal.title}
                </h3>

                <div className="space-y-1 text-xs text-[#786C62]">
                  {meal.items.map((it, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C4552D]" />
                      <span>{it}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Macro Pill Row */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#EAE3D9] text-center text-xs">
                <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9]">
                  <span className="text-[10px] font-bold text-[#3B5842] uppercase block">Protein</span>
                  <span className="font-bold text-[#181513]">{meal.protein}g</span>
                </div>
                <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9]">
                  <span className="text-[10px] font-bold text-[#C9822B] uppercase block">Carbs</span>
                  <span className="font-bold text-[#181513]">{meal.carbs}g</span>
                </div>
                <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9]">
                  <span className="text-[10px] font-bold text-[#C4552D] uppercase block">Fat</span>
                  <span className="font-bold text-[#181513]">{meal.fat}g</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <section className="editorial-card rounded-3xl p-6 sm:p-10 space-y-8">
          <div>
            <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-[#C4552D]">
              Nutrition Knowledge
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513] mt-0.5">
              Frequently Asked Questions About Low Calorie Meals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mealFaqs.map((faq, idx) => (
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
