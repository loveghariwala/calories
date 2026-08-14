import { Metadata } from 'next';
import Link from 'next/link';
import { getAllFoods } from '@/data/foodDatabase';
import { FoodCard } from '@/components/FoodCard';
import { MealBuilderDock } from '@/components/MealBuilderDock';
import { generateFaqJsonLd, getCanonicalUrl } from '@/lib/seo';
import { Award, ChevronRight, ShieldCheck, Sparkles, Heart, Zap, Flame, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Anti-Inflammatory Diet — Complete Food List, Benefits & Meal Guide | CaloriePulse',
  description:
    'Complete evidence-based guide to the anti-inflammatory diet. Discover top anti-inflammatory foods (omega-3s, polyphenols, antioxidants), foods to avoid, and a 1-day meal blueprint with USDA nutrition facts.',
  keywords: [
    'anti inflammatory diet',
    'anti inflammatory foods',
    'anti inflammatory diet food list',
    'foods that fight inflammation',
    'anti inflammatory meal plan',
    'what is an anti inflammatory diet',
    'anti inflammatory foods list pdf',
    'best anti inflammatory foods',
  ],
  alternates: {
    canonical: getCanonicalUrl('/anti-inflammatory-diet'),
  },
  openGraph: {
    title: 'Anti-Inflammatory Diet — Complete Food List, Benefits & Meal Guide',
    description:
      'Evidence-based anti-inflammatory diet guide: food lists, omega-3 sources, antioxidants, and daily meal planning.',
    url: getCanonicalUrl('/anti-inflammatory-diet'),
    siteName: 'CaloriePulse',
    type: 'article',
  },
};

export default function AntiInflammatoryDietPage() {
  const allFoods = getAllFoods();

  // Curate anti-inflammatory power foods
  const antiInflammatoryFoods = allFoods.filter(
    (f) =>
      f.tags.includes('omega-3') ||
      f.tags.includes('antioxidants') ||
      f.tags.includes('healthy-fats') ||
      ['salmon', 'avocado', 'blueberry', 'olive', 'spinach', 'apple', 'walnut', 'almond', 'green-tea'].some((k) =>
        f.slug.includes(k)
      )
  );

  const antiInflammatoryFaqs = [
    {
      q: 'What is an anti-inflammatory diet and how does it work?',
      a: 'An anti-inflammatory diet emphasizes nutrient-dense whole foods rich in antioxidants, polyphenols, and omega-3 fatty acids that actively lower systemic chronic inflammation (C-reactive protein, IL-6, and TNF-alpha) in the body, supporting joint health, cardiovascular function, and metabolic longevity.',
    },
    {
      q: 'What are the top 10 foods that fight inflammation?',
      a: '1. Wild Alaskan Salmon (EPA/DHA Omega-3s). 2. Fresh Hass Avocado (Oleic acid). 3. Wild Blueberries (Anthocyanins). 4. Extra Virgin Olive Oil (Oleocanthal). 5. Raw Walnuts & Almonds. 6. Spinach & Leafy Greens (Lutein). 7. Green Tea (EGCG). 8. Dark Chocolate (Flavanols). 9. Turmeric & Ginger. 10. Chia & Flax Seeds.',
    },
    {
      q: 'What foods cause inflammation and should be avoided?',
      a: 'The most pro-inflammatory foods include refined seed and vegetable oils (high Omega-6), high-fructose corn syrup, refined sugar-sweetened beverages, trans fats, and deep-fried ultra-processed fast foods.',
    },
    {
      q: 'How fast can an anti-inflammatory diet reduce inflammation?',
      a: 'Clinical studies show that adopting a whole food anti-inflammatory Mediterranean-style diet can reduce inflammatory biomarkers like hs-CRP and improve joint mobility and energy levels within 2 to 4 weeks.',
    },
  ];

  const faqSchema = generateFaqJsonLd(antiInflammatoryFaqs);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'The Complete Anti-Inflammatory Diet Guide: Science, Foods & Meal Planning',
    description: 'Evidence-based guide to lowering systemic inflammation through whole food nutrition and USDA dietary guidelines.',
    author: {
      '@type': 'Organization',
      name: 'CaloriePulse Clinical Editorial Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CaloriePulse',
      url: 'https://caloriepulse.com',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-sans text-[#786C62]">
          <Link href="/" className="hover:text-[#181513]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#3B5842] font-semibold">Anti-Inflammatory Diet</span>
        </nav>

        {/* Hero Masthead Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF2EC] border border-[#D5E5D8] text-xs font-sans font-bold text-[#3B5842] shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#3B5842]" />
            <span>CLINICAL NUTRITION PROTOCOL • CELLULAR LONGEVITY</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#181513] tracking-tight leading-[1.15]">
            The <span className="text-[#3B5842] italic font-normal">Anti-Inflammatory</span> Diet Guide
          </h1>

          <p className="text-base sm:text-lg text-[#786C62] font-sans leading-relaxed">
            Lower systemic cellular inflammation, protect cardiovascular vitality, and accelerate recovery with nutrient-dense whole foods powered by official USDA research.
          </p>
        </div>

        {/* 3 Pillars of Anti-Inflammatory Nutrition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="editorial-card rounded-3xl p-6 sm:p-8 space-y-3 bg-[#FAF8F5]">
            <div className="w-10 h-10 rounded-2xl bg-[#EBF2EC] text-[#3B5842] flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#181513]">1. Omega-3 Fatty Acids (EPA &amp; DHA)</h3>
            <p className="text-xs sm:text-sm text-[#786C62] leading-relaxed">
              Inhibit pro-inflammatory cytokine cascades (TNF-α, IL-6). Plentiful in wild salmon, chia seeds, and raw walnuts.
            </p>
          </div>

          <div className="editorial-card rounded-3xl p-6 sm:p-8 space-y-3 bg-[#FAF8F5]">
            <div className="w-10 h-10 rounded-2xl bg-[#FDF2EE] text-[#C4552D] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#181513]">2. Polyphenols &amp; Anthocyanins</h3>
            <p className="text-xs sm:text-sm text-[#786C62] leading-relaxed">
              Potent free-radical scavengers found in wild blueberries, apples, and dark chocolate that neutralize cellular oxidative stress.
            </p>
          </div>

          <div className="editorial-card rounded-3xl p-6 sm:p-8 space-y-3 bg-[#FAF8F5]">
            <div className="w-10 h-10 rounded-2xl bg-[#FBF4E8] text-[#C9822B] flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#181513]">3. Monounsaturated Oleic Acid</h3>
            <p className="text-xs sm:text-sm text-[#786C62] leading-relaxed">
              Found in fresh avocados and extra virgin olive oil to improve arterial endothelial lining and balance lipid ratios.
            </p>
          </div>
        </div>

        {/* Top Anti-Inflammatory Whole Foods Directory */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-[#3B5842]">
                USDA Superfoods
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513] mt-0.5">
                Top Anti-Inflammatory Whole Foods
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {antiInflammatoryFoods.slice(0, 6).map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </section>

        {/* Comparison: Foods That Heal vs Foods That Harm */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Healing Foods */}
          <div className="editorial-card rounded-3xl p-6 sm:p-8 space-y-4 border-[#3B5842]/30">
            <div className="flex items-center gap-2 text-[#3B5842] font-bold text-sm uppercase tracking-wider font-sans">
              <ShieldCheck className="w-4 h-4" />
              <span>Foods to Eat Daily (Anti-Inflammatory)</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-[#181513]">
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#3B5842]" />
                <span><strong>Fatty Fish:</strong> Wild salmon, mackerel, sardines, albacore tuna</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#3B5842]" />
                <span><strong>Dark Berries:</strong> Wild blueberries, blackberries, raspberries</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#3B5842]" />
                <span><strong>Healthy Lipids:</strong> Hass avocados, extra virgin olive oil</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#3B5842]" />
                <span><strong>Cruciferous Greens:</strong> Broccoli, baby spinach, kale</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#3B5842]" />
                <span><strong>Nuts &amp; Seeds:</strong> Raw walnuts, chia seeds, flax seeds</span>
              </li>
            </ul>
          </div>

          {/* Inflammatory Foods */}
          <div className="editorial-card rounded-3xl p-6 sm:p-8 space-y-4 border-[#C4552D]/30">
            <div className="flex items-center gap-2 text-[#C4552D] font-bold text-sm uppercase tracking-wider font-sans">
              <Flame className="w-4 h-4" />
              <span>Foods to Avoid (Pro-Inflammatory)</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-[#181513]">
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#C4552D]" />
                <span><strong>Refined Seed Oils:</strong> Soybean, corn, and industrial vegetable oils</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#C4552D]" />
                <span><strong>Refined Sugars:</strong> High-fructose corn syrup, soda, candy</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#C4552D]" />
                <span><strong>Processed Meats:</strong> Cured hot dogs, bacon with nitrates</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#C4552D]" />
                <span><strong>Ultra-Processed Snacks:</strong> Deep-fried potato chips, packaged pastries</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Evidence-Based FAQ */}
        <section className="editorial-card rounded-3xl p-6 sm:p-10 space-y-8">
          <div>
            <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-[#3B5842]">
              Clinical Evidence FAQ
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513] mt-0.5">
              Frequently Asked Questions About the Anti-Inflammatory Diet
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {antiInflammatoryFaqs.map((faq, idx) => (
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
