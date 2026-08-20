import { Metadata } from 'next';
import Link from 'next/link';
import { NutritionCalculators } from '@/components/NutritionCalculators';
import { MealBuilderDock } from '@/components/MealBuilderDock';
import { generateFaqJsonLd, getCanonicalUrl } from '@/lib/seo';
import {
  Award,
  ChevronRight,
  Flame,
  Zap,
  Scale,
  Activity,
  BookOpen,
  CheckCircle2,
  Table as TableIcon,
  Calculator as CalcIcon,
  Info,
  Percent,
} from 'lucide-react';
import { StaggeredText } from '@/components/StaggeredText';
import { ElasticText } from '@/components/ElasticText';

interface CalorieCalculatorPageProps {
  searchParams: Promise<{
    goal?: string;
    calories?: string;
    target?: string;
    cage?: string;
    ckg?: string;
    cpound?: string;
  }>;
}

export async function generateMetadata({ searchParams }: CalorieCalculatorPageProps): Promise<Metadata> {
  const { goal, calories, target } = await searchParams;

  let title = 'Calorie Calculator — Daily Calorie & Calorie Deficit Calculator | CaloriePulse';
  let description =
    'Free scientific calorie calculator based on clinical equations (Mifflin-St Jeor, Harris-Benedict, Katch-McArdle). Calculate your exact maintenance calories, TDEE, zig-zag cycling, and calorie deficit.';

  if (calories) {
    title = `${calories} Calorie Meal & Deficit Calculator — Daily Macro Plan | CaloriePulse`;
    description = `Calculate how to eat ${calories} calories a day for fat loss or muscle gain. Exact macro breakdowns, protein targets, and TDEE calorie deficit calculations.`;
  } else if (goal === 'weight-loss' || target === 'deficit') {
    title = 'Calorie Deficit Calculator — Exact Calories to Lose Weight | CaloriePulse';
    description = 'Calculate your personalized calorie deficit for safe fat loss. Determine how many calories to eat each day based on clinical equations.';
  } else if (goal === 'muscle-gain' || target === 'surplus') {
    title = 'Calorie Surplus & Muscle Gain Calculator — Daily Macros | CaloriePulse';
    description = 'Calculate your calorie surplus and daily protein requirements for lean muscle building without excess fat gain.';
  }

  const canonical = getCanonicalUrl('/calorie-calculator');

  return {
    title,
    description,
    keywords: [
      'calorie calculator',
      'calorie deficit calculator',
      'how many calories should i eat',
      'tdee calculator',
      'bmr calculator',
      'zig zag calorie calculator',
      'macro calculator',
      'mifflin st jeor calculator',
      'harris benedict calculator',
      'katch mcardle calculator',
      'weight loss calculator',
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

export default async function CalorieCalculatorPage({ searchParams }: CalorieCalculatorPageProps) {
  const calculatorFaqs = [
    {
      q: 'How does this scientific calorie calculator calculate my daily calorie needs?',
      a: 'This calculator computes your Basal Metabolic Rate (BMR) using validated clinical equations (Mifflin-St Jeor, Revised Harris-Benedict, or Katch-McArdle) and applies a Physical Activity Level (PAL) multiplier to determine your Total Daily Energy Expenditure (TDEE). From this baseline, tailored calorie deficits (for fat loss) or surpluses (for muscle gain) are calculated.',
    },
    {
      q: 'Which BMR formula is the most accurate for me?',
      a: 'For most individuals, the Mifflin-St Jeor equation is recommended by the Academy of Nutrition and Dietetics as the most reliable standard. If you know your body fat percentage, the Katch-McArdle formula is even more precise because it calculates metabolism based on your Lean Body Mass (LBM).',
    },
    {
      q: 'What is Zig-Zag Calorie Cycling (Calorie Shifting)?',
      a: 'Zig-zag calorie cycling alternates higher-calorie days with lower-calorie deficit days while keeping your total weekly calorie deficit constant. This helps prevent metabolic adaptation, preserves leptin and thyroid hormone levels, reduces diet fatigue, and accommodates social weekends.',
    },
    {
      q: 'What is a safe calorie deficit for sustainable weight loss?',
      a: 'A moderate deficit of 300 to 500 calories per day (resulting in 0.5 to 1.0 lb / 0.25 to 0.5 kg of fat loss per week) is clinically optimal. It ensures steady fat loss while preserving lean muscle mass and preventing hormonal downregulation. Daily calories should not drop below 1,200 kcal for women or 1,500 kcal for men without medical supervision.',
    },
    {
      q: 'What is the difference between BMR, NEAT, EAT, and TDEE?',
      a: 'BMR (Basal Metabolic Rate) is the energy burned at complete rest to sustain vital organs (~60-70% of TDEE). NEAT (Non-Exercise Activity Thermogenesis) is movement like walking and fidgeting (~15-20%). EAT (Exercise Activity Thermogenesis) is planned workouts (~5-10%), and TEF (Thermic Effect of Food) is digestion (~10%). Together, they make up your Total Daily Energy Expenditure (TDEE).',
    },
  ];

  const faqSchema = generateFaqJsonLd(calculatorFaqs);

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'CaloriePulse Scientific Calorie & TDEE Calculator',
    url: getCanonicalUrl('/calorie-calculator'),
    applicationCategory: 'HealthApplication',
    operatingSystem: 'All',
    description: 'Free scientific calorie and macro calculator supporting Mifflin-St Jeor, Harris-Benedict, Katch-McArdle, and 7-day zig-zag cycling.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 pb-28 space-y-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-sans text-[#786C62]">
          <Link href="/" className="hover:text-[#181513] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#C4552D] font-semibold">Calorie Calculator</span>
        </nav>

        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full gold-seal text-xs font-sans font-semibold shadow-2xs">
            <Award className="w-3.5 h-3.5 text-[#C9822B]" />
            <span>CLINICAL METABOLIC FORMULAS &amp; TDEE TELEMETRY</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#181513] tracking-tight leading-[1.15]">
            Scientific <span className="text-[#C4552D] italic font-normal">Calorie Calculator</span>
          </h1>

          <p className="text-base sm:text-lg text-[#786C62] font-sans leading-relaxed">
            Calculate your exact maintenance calories, BMR, TDEE, 7-day zig-zag calorie shifting schedules, and macronutrient targets with clinical laboratory precision.
          </p>
        </div>

        {/* The Calculator Suite */}
        <NutritionCalculators />

        {/* Clinical Framework Guide: 4 Pillars of Daily Energy Burn */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="editorial-card rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FDF2EE] text-[#C4552D] flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#181513]">1. Basal Metabolism (BMR)</h3>
            <p className="text-xs text-[#786C62] leading-relaxed">
              <strong>60–70% of total burn.</strong> Vital energy required by your brain, liver, kidneys, and cellular respiration at complete rest.
            </p>
          </div>

          <div className="editorial-card rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EBF2EC] text-[#3B5842] flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#181513]">2. NEAT Movement</h3>
            <p className="text-xs text-[#786C62] leading-relaxed">
              <strong>15–20% of total burn.</strong> Non-Exercise Activity Thermogenesis: daily walking, standing, typing, and spontaneous physical movement.
            </p>
          </div>

          <div className="editorial-card rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FBF4E8] text-[#C9822B] flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#181513]">3. Workout Burn (EAT)</h3>
            <p className="text-xs text-[#786C62] leading-relaxed">
              <strong>5–10% of total burn.</strong> Exercise Activity Thermogenesis: structured cardio, resistance training, sports, and intense physical work.
            </p>
          </div>

          <div className="editorial-card rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F4EFEB] text-[#181513] flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#181513]">4. Food Digestion (TEF)</h3>
            <p className="text-xs text-[#786C62] leading-relaxed">
              <strong>~10% of total burn.</strong> Thermic Effect of Food: calories burned processing protein (20-30%), carbs (5-10%), and fats (0-3%).
            </p>
          </div>
        </div>

        {/* Mathematical Formulas Card Section (Calculator.net Reference) */}
        <section className="editorial-card rounded-3xl p-6 sm:p-10 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CalcIcon className="w-4 h-4 text-[#C4552D]" />
              <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-[#C4552D]">
                Clinical Formulations
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513]">
              The Mathematical Equations Behind BMR &amp; TDEE
            </h2>
            <p className="text-xs sm:text-sm text-[#786C62] mt-1 max-w-2xl">
              Understand how our calculator computes basal metabolic rate across each peer-reviewed clinical standard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mifflin-St Jeor */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#C4552D] uppercase tracking-wider">Clinical Standard</span>
                <span className="text-[10px] bg-[#FDF2EE] text-[#C4552D] px-2 py-0.5 rounded-full font-bold">Most Accurate</span>
              </div>
              <h3 className="font-serif font-bold text-base text-[#181513]">Mifflin-St Jeor Equation</h3>
              <p className="text-xs text-[#786C62] leading-relaxed">
                Formulated in 1990; proven to predict BMR within 10% of indirect calorimetry for healthy adults.
              </p>
              <div className="p-3 rounded-xl bg-white border border-[#EAE3D9] font-mono text-[11px] text-[#181513] space-y-1.5">
                <p><strong>Men:</strong> 10W + 6.25H - 5A + 5</p>
                <p><strong>Women:</strong> 10W + 6.25H - 5A - 161</p>
                <span className="text-[9px] text-[#786C62] block pt-1">W = kg, H = cm, A = age in years</span>
              </div>
            </div>

            {/* Revised Harris-Benedict */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#C9822B] uppercase tracking-wider">Historical Standard</span>
                <span className="text-[10px] bg-[#FBF4E8] text-[#C9822B] px-2 py-0.5 rounded-full font-bold">Revised 1984</span>
              </div>
              <h3 className="font-serif font-bold text-base text-[#181513]">Harris-Benedict Equation</h3>
              <p className="text-xs text-[#786C62] leading-relaxed">
                Revised by Roza &amp; Shizgal in 1984; established for broad metabolic clinical assessments.
              </p>
              <div className="p-3 rounded-xl bg-white border border-[#EAE3D9] font-mono text-[10px] text-[#181513] space-y-1.5">
                <p><strong>Men:</strong> 88.36 + 13.4W + 4.8H - 5.68A</p>
                <p><strong>Women:</strong> 447.6 + 9.25W + 3.1H - 4.33A</p>
                <span className="text-[9px] text-[#786C62] block pt-1">W = kg, H = cm, A = age in years</span>
              </div>
            </div>

            {/* Katch-McArdle */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#3B5842] uppercase tracking-wider">Body Composition</span>
                <span className="text-[10px] bg-[#EBF2EC] text-[#3B5842] px-2 py-0.5 rounded-full font-bold">LBM Based</span>
              </div>
              <h3 className="font-serif font-bold text-base text-[#181513]">Katch-McArdle Formula</h3>
              <p className="text-xs text-[#786C62] leading-relaxed">
                Calculates BMR based strictly on Lean Body Mass (LBM), making it ideal for lean athletes and bodybuilders.
              </p>
              <div className="p-3 rounded-xl bg-white border border-[#EAE3D9] font-mono text-[11px] text-[#181513] space-y-1.5">
                <p><strong>BMR =</strong> 370 + (21.6 × LBM)</p>
                <p><strong>LBM =</strong> Weight × (1 - BodyFat%)</p>
                <span className="text-[9px] text-[#786C62] block pt-1">LBM = Lean Body Mass in kg</span>
              </div>
            </div>
          </div>
        </section>

        {/* USDA Dietary Guidelines Reference Table */}
        <section className="editorial-card rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TableIcon className="w-4 h-4 text-[#3B5842]" />
                <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-[#3B5842]">
                  Dietary Guidelines Reference
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513]">
                Estimated Calorie Needs by Age, Sex &amp; Activity
              </h2>
              <p className="text-xs text-[#786C62] mt-0.5">
                Source: USDA &amp; U.S. Department of Health and Human Services Dietary Guidelines for Americans.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#EAE3D9] bg-[#FAF8F5]">
                  <th className="p-3.5 font-bold text-[#181513]">Age Group</th>
                  <th className="p-3.5 font-bold text-[#181513]">Biological Sex</th>
                  <th className="p-3.5 font-bold text-[#786C62]">Sedentary (kcal)</th>
                  <th className="p-3.5 font-bold text-[#786C62]">Moderately Active (kcal)</th>
                  <th className="p-3.5 font-bold text-[#C4552D]">Active Lifestyle (kcal)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D9] text-[#2A2421]">
                <tr className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="p-3.5 font-bold">14–18 Years</td>
                  <td className="p-3.5">Female</td>
                  <td className="p-3.5">1,800</td>
                  <td className="p-3.5">2,000</td>
                  <td className="p-3.5 font-bold text-[#C4552D]">2,400</td>
                </tr>
                <tr className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="p-3.5 font-bold">14–18 Years</td>
                  <td className="p-3.5">Male</td>
                  <td className="p-3.5">2,200</td>
                  <td className="p-3.5">2,400–2,800</td>
                  <td className="p-3.5 font-bold text-[#C4552D]">2,800–3,200</td>
                </tr>
                <tr className="hover:bg-[#FAF8F5]/80 transition-colors bg-[#FAF8F5]/30">
                  <td className="p-3.5 font-bold">19–30 Years</td>
                  <td className="p-3.5">Female</td>
                  <td className="p-3.5">1,800–2,000</td>
                  <td className="p-3.5">2,000–2,200</td>
                  <td className="p-3.5 font-bold text-[#C4552D]">2,400</td>
                </tr>
                <tr className="hover:bg-[#FAF8F5]/80 transition-colors bg-[#FAF8F5]/30">
                  <td className="p-3.5 font-bold">19–30 Years</td>
                  <td className="p-3.5">Male</td>
                  <td className="p-3.5">2,400–2,600</td>
                  <td className="p-3.5">2,600–2,800</td>
                  <td className="p-3.5 font-bold text-[#C4552D]">3,000</td>
                </tr>
                <tr className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="p-3.5 font-bold">31–50 Years</td>
                  <td className="p-3.5">Female</td>
                  <td className="p-3.5">1,800</td>
                  <td className="p-3.5">2,000</td>
                  <td className="p-3.5 font-bold text-[#C4552D]">2,200</td>
                </tr>
                <tr className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="p-3.5 font-bold">31–50 Years</td>
                  <td className="p-3.5">Male</td>
                  <td className="p-3.5">2,200–2,400</td>
                  <td className="p-3.5">2,400–2,600</td>
                  <td className="p-3.5 font-bold text-[#C4552D]">2,800–3,000</td>
                </tr>
                <tr className="hover:bg-[#FAF8F5]/80 transition-colors bg-[#FAF8F5]/30">
                  <td className="p-3.5 font-bold">51+ Years</td>
                  <td className="p-3.5">Female</td>
                  <td className="p-3.5">1,600</td>
                  <td className="p-3.5">1,800</td>
                  <td className="p-3.5 font-bold text-[#C4552D]">2,000–2,200</td>
                </tr>
                <tr className="hover:bg-[#FAF8F5]/80 transition-colors bg-[#FAF8F5]/30">
                  <td className="p-3.5 font-bold">51+ Years</td>
                  <td className="p-3.5">Male</td>
                  <td className="p-3.5">2,000–2,200</td>
                  <td className="p-3.5">2,200–2,400</td>
                  <td className="p-3.5 font-bold text-[#C4552D]">2,400–2,800</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* American Council on Exercise (ACE) Body Fat & Jackson-Pollock Reference */}
        <section className="editorial-card rounded-3xl p-6 sm:p-10 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Percent className="w-4 h-4 text-[#3B5842]" />
              <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-[#3B5842]">
                Body Composition Standards
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513]">
              Body Fat Standards &amp; Age-Adjusted Norms
            </h2>
            <p className="text-xs sm:text-sm text-[#786C62] mt-1 max-w-2xl">
              Compare your body fat percentage against the American Council on Exercise (ACE) benchmarks and the Jackson &amp; Pollock age-specific physiological norms.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* ACE Categorization Table */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-base text-[#181513] flex items-center gap-2">
                <span>The American Council on Exercise (ACE) Categorization</span>
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-[#EAE3D9] bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#EAE3D9] bg-[#FAF8F5]">
                      <th className="p-3.5 font-bold text-[#181513]">Description</th>
                      <th className="p-3.5 font-bold text-[#C4552D]">Women</th>
                      <th className="p-3.5 font-bold text-[#3B5842]">Men</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE3D9]">
                    <tr className="hover:bg-[#FAF8F5]/80">
                      <td className="p-3.5 font-bold text-amber-700">Essential Fat</td>
                      <td className="p-3.5 font-mono">10–13%</td>
                      <td className="p-3.5 font-mono">2–5%</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F5]/80">
                      <td className="p-3.5 font-bold text-emerald-700">Athletes</td>
                      <td className="p-3.5 font-mono">14–20%</td>
                      <td className="p-3.5 font-mono">6–13%</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F5]/80 bg-[#FAF8F5]/30">
                      <td className="p-3.5 font-bold text-[#3B5842]">Fitness</td>
                      <td className="p-3.5 font-mono font-bold text-[#3B5842]">21–24%</td>
                      <td className="p-3.5 font-mono font-bold text-[#3B5842]">14–17%</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F5]/80">
                      <td className="p-3.5 font-bold text-[#C9822B]">Average</td>
                      <td className="p-3.5 font-mono">25–31%</td>
                      <td className="p-3.5 font-mono">18–24%</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F5]/80 bg-[#FAF8F5]/30">
                      <td className="p-3.5 font-bold text-red-700">Obese / Overfat</td>
                      <td className="p-3.5 font-mono">32%+</td>
                      <td className="p-3.5 font-mono">25%+</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Jackson & Pollock Table */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-base text-[#181513] flex items-center gap-2">
                <span>Jackson &amp; Pollock Ideal Body Fat Percentages</span>
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-[#EAE3D9] bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#EAE3D9] bg-[#FAF8F5]">
                      <th className="p-3.5 font-bold text-[#181513]">Age Bracket</th>
                      <th className="p-3.5 font-bold text-[#C4552D]">Women</th>
                      <th className="p-3.5 font-bold text-[#3B5842]">Men</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE3D9] font-mono">
                    <tr className="hover:bg-[#FAF8F5]/80">
                      <td className="p-3.5 font-sans font-bold">20 Years</td>
                      <td className="p-3.5">17.7%</td>
                      <td className="p-3.5">8.5%</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F5]/80">
                      <td className="p-3.5 font-sans font-bold">25 Years</td>
                      <td className="p-3.5">18.4%</td>
                      <td className="p-3.5 font-bold text-[#3B5842]">10.5%</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F5]/80 bg-[#FAF8F5]/30">
                      <td className="p-3.5 font-sans font-bold">30 Years</td>
                      <td className="p-3.5">19.3%</td>
                      <td className="p-3.5">12.7%</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F5]/80">
                      <td className="p-3.5 font-sans font-bold">35 Years</td>
                      <td className="p-3.5">21.5%</td>
                      <td className="p-3.5">13.7%</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F5]/80">
                      <td className="p-3.5 font-sans font-bold">40 Years</td>
                      <td className="p-3.5">22.2%</td>
                      <td className="p-3.5">15.3%</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F5]/80 bg-[#FAF8F5]/30">
                      <td className="p-3.5 font-sans font-bold">45 Years</td>
                      <td className="p-3.5">22.9%</td>
                      <td className="p-3.5">16.4%</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F5]/80">
                      <td className="p-3.5 font-sans font-bold">50 Years</td>
                      <td className="p-3.5">25.2%</td>
                      <td className="p-3.5">18.9%</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F5]/80 bg-[#FAF8F5]/30">
                      <td className="p-3.5 font-sans font-bold">55+ Years</td>
                      <td className="p-3.5">26.3%</td>
                      <td className="p-3.5">20.9%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Ideal Body Weight (IBW) Formulas & Body Frame Size Reference */}
        <section className="editorial-card rounded-3xl p-6 sm:p-10 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Scale className="w-4 h-4 text-[#C9822B]" />
              <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-[#C9822B]">
                Clinical Equations &amp; Body Frame
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513]">
              Formulas for Finding Ideal Body Weight (IBW)
            </h2>
            <p className="text-xs sm:text-sm text-[#786C62] mt-1 max-w-2xl">
              IBW formulas were developed to establish baseline medical dosages and calculate optimal body mass index targets for adults.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] space-y-2">
              <span className="text-[10px] font-bold text-[#C9822B] uppercase">Robinson Formula (1983)</span>
              <h4 className="font-serif font-bold text-sm text-[#181513]">J. D. Robinson</h4>
              <div className="text-[11px] font-mono text-[#786C62] space-y-1 pt-1">
                <p><strong>Men:</strong> 52 kg + 1.9 kg/in &gt; 5ft</p>
                <p><strong>Women:</strong> 49 kg + 1.7 kg/in &gt; 5ft</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] space-y-2">
              <span className="text-[10px] font-bold text-[#C9822B] uppercase">Miller Formula (1983)</span>
              <h4 className="font-serif font-bold text-sm text-[#181513]">D. R. Miller</h4>
              <div className="text-[11px] font-mono text-[#786C62] space-y-1 pt-1">
                <p><strong>Men:</strong> 56.2 kg + 1.41 kg/in &gt; 5ft</p>
                <p><strong>Women:</strong> 53.1 kg + 1.36 kg/in &gt; 5ft</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] space-y-2">
              <span className="text-[10px] font-bold text-[#C9822B] uppercase">Devine Formula (1974)</span>
              <h4 className="font-serif font-bold text-sm text-[#181513]">B. J. Devine</h4>
              <div className="text-[11px] font-mono text-[#786C62] space-y-1 pt-1">
                <p><strong>Men:</strong> 50.0 kg + 2.3 kg/in &gt; 5ft</p>
                <p><strong>Women:</strong> 45.5 kg + 2.3 kg/in &gt; 5ft</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] space-y-2">
              <span className="text-[10px] font-bold text-[#C9822B] uppercase">Hamwi Formula (1964)</span>
              <h4 className="font-serif font-bold text-sm text-[#181513]">G. J. Hamwi</h4>
              <div className="text-[11px] font-mono text-[#786C62] space-y-1 pt-1">
                <p><strong>Men:</strong> 48.0 kg + 2.7 kg/in &gt; 5ft</p>
                <p><strong>Women:</strong> 45.5 kg + 2.2 kg/in &gt; 5ft</p>
              </div>
            </div>
          </div>

          {/* Body Frame Size Wrist Circumference Table */}
          <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#181513]">Body Frame Size by Wrist Circumference</h3>
            <p className="text-xs text-[#786C62]">
              Body frame size can shift ideal body weight by ±10%. Measure your wrist circumference at the smallest point just beyond the wrist bone:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-white border border-[#EAE3D9] space-y-1">
                <strong className="text-[#181513] block">For Men (Height &gt; 5' 5"):</strong>
                <p className="text-[#786C62]">• Small Frame: Wrist &lt; 6.5 inches (&lt; 16.5 cm)</p>
                <p className="text-[#786C62]">• Medium Frame: Wrist 6.5" to 7.5" (16.5 to 19.0 cm)</p>
                <p className="text-[#786C62]">• Large Frame: Wrist &gt; 7.5 inches (&gt; 19.0 cm)</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#EAE3D9] space-y-1">
                <strong className="text-[#181513] block">For Women (Height 5' 2" to 5' 5"):</strong>
                <p className="text-[#786C62]">• Small Frame: Wrist &lt; 6.0 inches (&lt; 15.2 cm)</p>
                <p className="text-[#786C62]">• Medium Frame: Wrist 6.0" to 6.25" (15.2 to 15.9 cm)</p>
                <p className="text-[#786C62]">• Large Frame: Wrist &gt; 6.25 inches (&gt; 15.9 cm)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Evidence-Based FAQ Section */}
        <section className="editorial-card rounded-3xl p-6 sm:p-10 space-y-8">
          <div>
            <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-[#C4552D]">
              Evidence-Based FAQ
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513] mt-0.5">
              Frequently Asked Questions About Calories &amp; TDEE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {calculatorFaqs.map((faq, idx) => (
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
