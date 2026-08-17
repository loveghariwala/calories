import { getAllFoods, registerDynamicFood } from '@/data/foodDatabase';
import { searchLiveUSDA } from '@/lib/usdaApi';
import { HeroSearch } from '@/components/HeroSearch';
import { FoodCard } from '@/components/FoodCard';
import { FoodGridWithFilters } from '@/components/FoodGridWithFilters';
import { CategoryGrid } from '@/components/CategoryGrid';
import { MonetizationSection } from '@/components/MonetizationSlots';
import { HeroNutritionStudio } from '@/components/HeroNutritionStudio';
import { CircadianTimeline } from '@/components/CircadianTimeline';
import { MealBuilderDock } from '@/components/MealBuilderDock';
import { NutritionCalculators } from '@/components/NutritionCalculators';
import { DVDBouncing3DCanvas } from '@/components/DVDBouncing3DCanvas';
import { generateFaqJsonLd } from '@/lib/seo';
import { ArrowUpRight, Award } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  // Dynamically query Live USDA FoodData Central API for section foods
  const [highProteinFoods, breakfastStaples, lowCalorieSnacks] = await Promise.all([
    searchLiveUSDA('chicken breast salmon beef steak', 6),
    searchLiveUSDA('eggs oats greek yogurt milk', 6),
    searchLiveUSDA('strawberries blueberries broccoli apple', 6),
  ]);

  // Register in live dynamic cache
  [...highProteinFoods, ...breakfastStaples, ...lowCalorieSnacks].forEach(registerDynamicFood);

  const tickerItems = [
    { label: 'Wild Alaskan Salmon', detail: '22.1g Complete Protein', emoji: '🐟' },
    { label: 'Fresh Hass Avocado', detail: '6.7g Prebiotic Fiber', emoji: '🥑' },
    { label: 'Steel-Cut Oats', detail: 'Zero Added Sugars', emoji: '🌾' },
    { label: 'Pasture-Raised Eggs', detail: '373mg Brain Choline', emoji: '🥚' },
    { label: 'Nonfat Greek Yogurt', detail: 'Live Active Probiotics', emoji: '🥣' },
    { label: 'Grass-Fed Ribeye', detail: '2.4mg Bioavailable Iron', emoji: '🥩' },
  ];

  const homeFaqs = [
    {
      q: 'Where does CaloriePulse source its nutritional data?',
      a: 'All data is curated directly from the USDA FoodData Central (Agricultural Research Service), the gold-standard database utilized by clinical dietitians, sports cardiologists, and nutritional researchers across the United States and worldwide.',
    },
    {
      q: 'How does the portion atelier handle raw vs. cooked weights?',
      a: 'Every food item in our studio explicitly specifies its culinary preparation state (e.g. "Grilled Chicken Breast", "Cooked Jasmine Rice", "Dry Rolled Oats") so you can record your meals with exact laboratory precision.',
    },
    {
      q: 'Is my daily meal journal private and ad-free?',
      a: '100% private. All daily calorie logs, macro targets, and personal journal entries remain encrypted on your personal device via local browser storage. No accounts, tracking cookies, or banner ads.',
    },
    {
      q: 'How are calories computed from protein, carbohydrates, and fat?',
      a: 'Calories are calculated using the standard Atwater general factor system: 4 kcal per gram of protein, 4 kcal per gram of carbohydrate, and 9 kcal per gram of dietary fat.',
    },
  ];

  const faqSchema = generateFaqJsonLd(homeFaqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-24">
        {/* ============================================================ */}
        {/* 1. HERO SECTION: [APPLIED] 4 DVD Bouncing Shapes */}
        {/* ============================================================ */}
        <section className="space-y-10 max-w-6xl mx-auto relative min-h-[500px]">
          <DVDBouncing3DCanvas
            items={[
              { name: 'Avocado', type: 'avocado', size: 64, glowColor: 'rgba(117, 166, 50, 0.25)', initialVx: 1.2, initialVy: 0.9 },
              { name: 'Ribeye Steak', type: 'steak', size: 68, glowColor: 'rgba(217, 75, 61, 0.25)', initialVx: -1.0, initialVy: 1.2 },
              { name: 'Pancakes', type: 'pancake', size: 64, glowColor: 'rgba(227, 157, 68, 0.25)', initialVx: 1.1, initialVy: -1.1 },
              { name: 'Strawberry', type: 'strawberry', size: 58, glowColor: 'rgba(214, 24, 24, 0.25)', initialVx: -1.3, initialVy: -0.9 },
            ]}
          />

          <div className="relative z-10 space-y-6 text-center max-w-4xl mx-auto">
            {/* Gold Seal Provenance */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full gold-seal text-xs font-sans font-semibold shadow-2xs">
              <Award className="w-3.5 h-3.5 text-[#C9822B]" />
              <span>CURATED FROM USDA FOODDATA CENTRAL • 2026 EDITION</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#181513] tracking-tight leading-[1.12]">
              The thoughtful guide to <br />
              <span className="text-[#C4552D] italic font-normal">
                food calories &amp; daily macros.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#786C62] max-w-2xl mx-auto font-sans leading-relaxed">
              Search 300,000+ whole foods, calibrate portion weights in our interactive atelier, and cultivate conscious daily nourishment.
            </p>

            {/* Search Box */}
            <div className="pt-2 max-w-2xl mx-auto">
              <HeroSearch />
            </div>

            {/* Whole Food Discovery Ticker */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
              {tickerItems.map((item) => (
                <div
                  key={item.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#EAE3D9] text-xs font-sans text-[#786C62] shadow-2xs"
                >
                  <span>{item.emoji}</span>
                  <span className="font-semibold text-[#181513]">{item.label}:</span>
                  <span>{item.detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* The Luxury Nutrition Atelier (Full 6xl Width) */}
          <div className="relative z-10 w-full">
            <HeroNutritionStudio initialFoods={highProteinFoods} />
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. CATEGORIES SECTION: [SKIPPED - No 3D background shapes] */}
        {/* ============================================================ */}
        <section id="categories" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-[#786C62]">
                USDA Food Taxonomy
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513] mt-0.5">
                Nutritional Directories &amp; Whole Foods
              </h2>
            </div>
          </div>

          <CategoryGrid />
        </section>

        {/* ============================================================ */}
        {/* 3. HIGH-PROTEIN SECTION: [APPLIED] 4 DVD Bouncing Shapes */}
        {/* ============================================================ */}
        <section className="space-y-6 relative min-h-[400px]">
          <DVDBouncing3DCanvas
            items={[
              { name: 'Whole Milk', type: 'milk', size: 62, glowColor: 'rgba(80, 140, 220, 0.25)', initialVx: 1.1, initialVy: 0.8 },
              { name: 'Cheddar Cheese', type: 'cheese', size: 66, glowColor: 'rgba(235, 175, 50, 0.25)', initialVx: -1.2, initialVy: 1.0 },
              { name: 'Chicken Breast', type: 'chicken', size: 66, glowColor: 'rgba(215, 80, 50, 0.25)', initialVx: 1.0, initialVy: -1.1 },
              { name: 'Steamed Shrimp', type: 'shrimp', size: 60, glowColor: 'rgba(240, 95, 60, 0.25)', initialVx: -0.9, initialVy: -1.2 },
            ]}
          />

          <div className="relative z-10">
            <FoodGridWithFilters
              initialFoods={highProteinFoods}
              title="High-Protein Whole Foods (>15g Protein)"
              subtitle="Satiety & Muscle Retention"
              emojiIcon="🍗"
            />
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. CIRCADIAN TIMING SECTION: [SKIPPED - No 3D background shapes] */}
        {/* ============================================================ */}
        <section id="circadian">
          <CircadianTimeline />
        </section>



        {/* ============================================================ */}
        {/* 6. BREAKFAST STAPLES: [SKIPPED - No 3D background shapes] */}
        {/* ============================================================ */}
        <section className="space-y-6">
          <FoodGridWithFilters
            initialFoods={breakfastStaples}
            title="Breakfast Nutrition Staples"
            subtitle="Circadian Energy Ignition"
            emojiIcon="🍳"
          />
        </section>

        {/* ============================================================ */}
        {/* 7. LOW-CALORIE SECTION: [APPLIED] 4 DVD Bouncing Shapes */}
        {/* ============================================================ */}
        <section className="space-y-6 relative min-h-[400px]">
          <DVDBouncing3DCanvas
            items={[
              { name: 'Brewed Coffee', type: 'coffee', size: 62, glowColor: 'rgba(165, 110, 65, 0.25)', initialVx: 1.2, initialVy: 0.9 },
              { name: 'Wild Berries', type: 'berry', size: 58, glowColor: 'rgba(80, 110, 220, 0.25)', initialVx: -1.3, initialVy: 1.0 },
              { name: 'Steamed Shrimp', type: 'shrimp', size: 60, glowColor: 'rgba(245, 90, 56, 0.25)', initialVx: 1.0, initialVy: -1.2 },
              { name: 'Greek Yogurt', type: 'yogurt', size: 62, glowColor: 'rgba(110, 138, 116, 0.25)', initialVx: -1.1, initialVy: 1.1 },
            ]}
          />

          <div className="relative z-10">
            <FoodGridWithFilters
              initialFoods={lowCalorieSnacks}
              title="Low-Calorie Whole Food Staples"
              subtitle="Calorie-Deficit Volume"
              emojiIcon="🥗"
            />
          </div>
        </section>

        {/* Curated Kitchen Essentials */}
        {/* <MonetizationSection /> */}

        {/* Clinical Calorie & Body Fat Calculators */}
        <NutritionCalculators />

        {/* Editorial FAQ */}
        <section id="faq" className="editorial-card rounded-3xl p-6 sm:p-10 space-y-8">
          <div>
            <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-[#C4552D]">
              Knowledge &amp; Standards
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513] mt-0.5">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {homeFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] space-y-2"
              >
                <h3 className="font-serif font-bold text-base text-[#181513]">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-[#786C62] leading-relaxed font-sans">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating HUD Meal Journal */}
      <MealBuilderDock />
    </>
  );
}
