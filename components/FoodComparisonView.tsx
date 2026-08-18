'use client';

import React, { useState, useEffect } from 'react';
import { FoodItem } from '@/types/food';
import { getAllFoods } from '@/data/foodDatabase';
import { Food3DAsset } from './Food3DAsset';
import {
  Scale,
  Search,
  Loader2,
  Trophy,
  Flame,
  Zap,
  Sparkles,
  Swords,
  TrendingDown,
  TrendingUp,
  ArrowRightLeft,
} from 'lucide-react';
import Link from 'next/link';

interface FoodComparisonViewProps {
  initialFood1?: FoodItem;
  initialFood2?: FoodItem;
}

export const FoodComparisonView: React.FC<FoodComparisonViewProps> = ({
  initialFood1,
  initialFood2,
}) => {
  const allFoods = getAllFoods();
  const [food1, setFood1] = useState<FoodItem>(initialFood1 || allFoods[0]);
  const [food2, setFood2] = useState<FoodItem>(initialFood2 || allFoods[6] || allFoods[1]);

  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [results1, setResults1] = useState<FoodItem[]>([]);
  const [results2, setResults2] = useState<FoodItem[]>([]);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  // Dynamic USDA live search for Contender 1
  useEffect(() => {
    if (search1.trim().length > 1) {
      setLoading1(true);
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(
            `/api/foods/search?q=${encodeURIComponent(search1.trim())}&limit=6`
          );
          if (res.ok) {
            const data = await res.json();
            setResults1(data.results || []);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading1(false);
        }
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setResults1([]);
      setLoading1(false);
    }
  }, [search1]);

  // Dynamic USDA live search for Contender 2
  useEffect(() => {
    if (search2.trim().length > 1) {
      setLoading2(true);
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(
            `/api/foods/search?q=${encodeURIComponent(search2.trim())}&limit=6`
          );
          if (res.ok) {
            const data = await res.json();
            setResults2(data.results || []);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading2(false);
        }
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setResults2([]);
      setLoading2(false);
    }
  }, [search2]);

  const handleSwap = () => {
    const temp = food1;
    setFood1(food2);
    setFood2(temp);
  };

  const n1 = food1.nutrientsPer100g;
  const n2 = food2.nutrientsPer100g;

  const diffCal = n1.calories - n2.calories;
  const diffProt = Math.round((n1.protein - n2.protein) * 10) / 10;
  const diffCarbs = Math.round((n1.carbohydrates - n2.carbohydrates) * 10) / 10;
  const diffFat = Math.round((n1.fat - n2.fat) * 10) / 10;

  // Max value for bar visuals
  const maxCal = Math.max(n1.calories, n2.calories, 100);
  const maxProt = Math.max(n1.protein, n2.protein, 20);
  const maxCarb = Math.max(n1.carbohydrates, n2.carbohydrates, 30);
  const maxFat = Math.max(n1.fat, n2.fat, 20);

  return (
    <div className="space-y-10 font-sans max-w-5xl mx-auto">
      {/* ============================================================ */}
      {/* 1. ARENA CONTENDERS: BATTLE CARD HEAD-TO-HEAD */}
      {/* ============================================================ */}
      <div className="relative">
        {/* Central Glowing VS Arena Badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-1.5">
          <button
            onClick={handleSwap}
            title="Swap Contenders"
            className="w-13 h-13 rounded-full bg-[#181513] text-white border-2 border-[#EAE3D9] shadow-xl flex items-center justify-center font-serif font-extrabold text-base italic hover:scale-110 hover:border-[#C4552D] hover:text-[#C4552D] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-0.5">
              <span>V</span>
              <span className="text-[#C4552D]">S</span>
            </div>
          </button>
          <button
            onClick={handleSwap}
            className="p-1 rounded-full bg-white border border-[#EAE3D9] text-[#786C62] hover:text-[#181513] text-[10px] flex items-center gap-1 shadow-2xs cursor-pointer hover:bg-[#FAF8F5] transition-colors"
          >
            <ArrowRightLeft className="w-2.5 h-2.5" />
            <span className="text-[9px] font-bold">Swap</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Contender 1 (Left / Baseline) */}
          <div className="editorial-card p-6 sm:p-7 rounded-3xl relative space-y-4 bg-white border-2 border-[#EAE3D9] hover:border-[#3B5842] shadow-sm transition-all">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF2EC] text-[10px] font-sans font-bold uppercase tracking-wider text-[#3B5842] border border-[#D5E5D8]">
                <Zap className="w-3 h-3 text-[#3B5842]" />
                Contender 1 (Baseline)
              </span>
              <Link
                href={`/food/${food1.slug}`}
                className="text-xs font-semibold text-[#786C62] hover:text-[#3B5842] underline underline-offset-2"
              >
                View Details &rarr;
              </Link>
            </div>

            {/* Contender 1 3D Showcase */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9]">
              <div className="w-16 h-16 rounded-2xl bg-white border border-[#EAE3D9] shadow-xs flex items-center justify-center p-2 shrink-0">
                <Food3DAsset name={food1.name} type={food1.categoryName} size={56} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif font-bold text-lg text-[#181513] truncate leading-snug">
                  {food1.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-[#3B5842] px-2 py-0.5 rounded-md bg-[#EBF2EC]">
                    {food1.nutrientsPer100g.calories} kcal / 100g
                  </span>
                  <span className="text-xs text-[#786C62]">
                    {food1.nutrientsPer100g.protein}g Protein
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Live Search Input */}
            <div className="relative">
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-[#EAE3D9] text-xs shadow-2xs focus-within:border-[#3B5842] focus-within:ring-2 focus-within:ring-[#3B5842]/10 transition-all">
                <Search className="w-4 h-4 text-[#786C62] shrink-0" />
                <input
                  type="text"
                  value={search1}
                  onChange={(e) => setSearch1(e.target.value)}
                  placeholder="Switch food 1 (e.g., 'Eggs', 'Chicken Breast')..."
                  className="w-full bg-transparent outline-none text-[#181513] font-medium placeholder-[#786C62]"
                />
                {loading1 && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#3B5842] shrink-0" />}
              </div>

              {results1.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 p-1.5 bg-white border border-[#EAE3D9] rounded-2xl shadow-xl z-30 max-h-56 overflow-y-auto space-y-1">
                  {results1.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setFood1(f);
                        setSearch1('');
                        setResults1([]);
                      }}
                      className="w-full p-2.5 rounded-xl text-left hover:bg-[#FAF8F5] flex items-center justify-between text-xs cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Food3DAsset name={f.name} type={f.categoryName} size={24} />
                        <span className="font-semibold text-[#181513] truncate">{f.name}</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#3B5842] shrink-0 ml-2">
                        {f.nutrientsPer100g.calories} kcal
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contender 2 (Right / Challenger) */}
          <div className="editorial-card p-6 sm:p-7 rounded-3xl relative space-y-4 bg-white border-2 border-[#EAE3D9] hover:border-[#C4552D] shadow-sm transition-all">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2EE] text-[10px] font-sans font-bold uppercase tracking-wider text-[#C4552D] border border-[#F2C5B3]">
                <Flame className="w-3 h-3 text-[#C4552D]" />
                Contender 2 (Challenger)
              </span>
              <Link
                href={`/food/${food2.slug}`}
                className="text-xs font-semibold text-[#786C62] hover:text-[#C4552D] underline underline-offset-2"
              >
                View Details &rarr;
              </Link>
            </div>

            {/* Contender 2 3D Showcase */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9]">
              <div className="w-16 h-16 rounded-2xl bg-white border border-[#EAE3D9] shadow-xs flex items-center justify-center p-2 shrink-0">
                <Food3DAsset name={food2.name} type={food2.categoryName} size={56} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif font-bold text-lg text-[#181513] truncate leading-snug">
                  {food2.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-[#C4552D] px-2 py-0.5 rounded-md bg-[#FDF2EE]">
                    {food2.nutrientsPer100g.calories} kcal / 100g
                  </span>
                  <span className="text-xs text-[#786C62]">
                    {food2.nutrientsPer100g.protein}g Protein
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Live Search Input */}
            <div className="relative">
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-[#EAE3D9] text-xs shadow-2xs focus-within:border-[#C4552D] focus-within:ring-2 focus-within:ring-[#C4552D]/10 transition-all">
                <Search className="w-4 h-4 text-[#786C62] shrink-0" />
                <input
                  type="text"
                  value={search2}
                  onChange={(e) => setSearch2(e.target.value)}
                  placeholder="Switch food 2 (e.g., 'Salmon', 'Avocado')..."
                  className="w-full bg-transparent outline-none text-[#181513] font-medium placeholder-[#786C62]"
                />
                {loading2 && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C4552D] shrink-0" />}
              </div>

              {results2.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 p-1.5 bg-white border border-[#EAE3D9] rounded-2xl shadow-xl z-30 max-h-56 overflow-y-auto space-y-1">
                  {results2.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setFood2(f);
                        setSearch2('');
                        setResults2([]);
                      }}
                      className="w-full p-2.5 rounded-xl text-left hover:bg-[#FAF8F5] flex items-center justify-between text-xs cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Food3DAsset name={f.name} type={f.categoryName} size={24} />
                        <span className="font-semibold text-[#181513] truncate">{f.name}</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#C4552D] shrink-0 ml-2">
                        {f.nutrientsPer100g.calories} kcal
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. STATISTICAL HEAD-TO-HEAD ARENA BREAKDOWN */}
      {/* ============================================================ */}
      <div className="editorial-card rounded-3xl p-6 sm:p-10 space-y-8 bg-[#FAF8F5] border border-[#EAE3D9] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE3D9] pb-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#786C62] flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-[#C4552D]" />
              Standardized 100g Laboratory Face-Off
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513] mt-0.5">
              {food1.name} <span className="text-[#786C62] font-normal italic">vs</span> {food2.name}
            </h2>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#EAE3D9] text-xs font-bold text-[#3B5842] shadow-2xs self-start sm:self-auto">
            <Scale className="w-3.5 h-3.5" />
            <span>USDA FoodData Analytical Basis</span>
          </div>
        </div>

        {/* 4-Card Battle Verdict Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Calories Battle Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#EAE3D9] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#786C62] uppercase tracking-wider">
                Energy Density
              </span>
              <Flame className="w-4 h-4 text-[#C4552D]" />
            </div>

            <div className="flex justify-between items-baseline font-serif font-black text-xl">
              <div className="text-left">
                <span className={n1.calories < n2.calories ? 'text-[#3B5842]' : 'text-[#181513]'}>
                  {n1.calories}
                </span>
                <span className="text-[11px] font-sans font-normal text-[#786C62] ml-0.5">kcal</span>
              </div>
              <span className="text-xs font-sans text-[#786C62] font-normal">vs</span>
              <div className="text-right">
                <span className={n2.calories < n1.calories ? 'text-[#3B5842]' : 'text-[#181513]'}>
                  {n2.calories}
                </span>
                <span className="text-[11px] font-sans font-normal text-[#786C62] ml-0.5">kcal</span>
              </div>
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-1">
              <div className="flex h-2 rounded-full overflow-hidden bg-[#FAF8F5] border border-[#EAE3D9]">
                <div
                  className="bg-[#3B5842] transition-all duration-500"
                  style={{ width: `${(n1.calories / (n1.calories + n2.calories || 1)) * 100}%` }}
                />
                <div
                  className="bg-[#C4552D] transition-all duration-500"
                  style={{ width: `${(n2.calories / (n1.calories + n2.calories || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Verdict Badge */}
            <div
              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border text-center ${
                diffCal === 0
                  ? 'bg-[#FAF8F5] text-[#786C62] border-[#EAE3D9]'
                  : diffCal < 0
                  ? 'bg-[#EBF2EC] text-[#3B5842] border-[#D5E5D8]'
                  : 'bg-[#FDF2EE] text-[#C4552D] border-[#F2C5B3]'
              }`}
            >
              {diffCal === 0
                ? 'Equicaloric per 100g'
                : diffCal < 0
                ? `🏆 ${food1.name.slice(0, 14)} is ${Math.abs(diffCal)} kcal lighter`
                : `🏆 ${food2.name.slice(0, 14)} is ${Math.abs(diffCal)} kcal lighter`}
            </div>
          </div>

          {/* 2. Protein Battle Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#EAE3D9] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#3B5842] uppercase tracking-wider">
                Protein Dominance
              </span>
              <Trophy className="w-4 h-4 text-[#3B5842]" />
            </div>

            <div className="flex justify-between items-baseline font-serif font-black text-xl">
              <div className="text-left">
                <span className={n1.protein > n2.protein ? 'text-[#3B5842]' : 'text-[#181513]'}>
                  {n1.protein}g
                </span>
              </div>
              <span className="text-xs font-sans text-[#786C62] font-normal">vs</span>
              <div className="text-right">
                <span className={n2.protein > n1.protein ? 'text-[#3B5842]' : 'text-[#181513]'}>
                  {n2.protein}g
                </span>
              </div>
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-1">
              <div className="flex h-2 rounded-full overflow-hidden bg-[#FAF8F5] border border-[#EAE3D9]">
                <div
                  className="bg-[#3B5842] transition-all duration-500"
                  style={{ width: `${(n1.protein / (n1.protein + n2.protein || 1)) * 100}%` }}
                />
                <div
                  className="bg-[#C4552D] transition-all duration-500"
                  style={{ width: `${(n2.protein / (n1.protein + n2.protein || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Verdict Badge */}
            <div
              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border text-center ${
                diffProt === 0
                  ? 'bg-[#FAF8F5] text-[#786C62] border-[#EAE3D9]'
                  : diffProt > 0
                  ? 'bg-[#EBF2EC] text-[#3B5842] border-[#D5E5D8]'
                  : 'bg-[#FDF2EE] text-[#C4552D] border-[#F2C5B3]'
              }`}
            >
              {diffProt === 0
                ? 'Equal protein content'
                : diffProt > 0
                ? `⚡ +${diffProt}g Protein Advantage`
                : `⚡ +${Math.abs(diffProt)}g Protein Advantage`}
            </div>
          </div>

          {/* 3. Carbohydrates Battle Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#EAE3D9] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#C9822B] uppercase tracking-wider">
                Carbohydrates
              </span>
              <Sparkles className="w-4 h-4 text-[#C9822B]" />
            </div>

            <div className="flex justify-between items-baseline font-serif font-black text-xl">
              <div className="text-left">
                <span className="text-[#181513]">{n1.carbohydrates}g</span>
              </div>
              <span className="text-xs font-sans text-[#786C62] font-normal">vs</span>
              <div className="text-right">
                <span className="text-[#181513]">{n2.carbohydrates}g</span>
              </div>
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-1">
              <div className="flex h-2 rounded-full overflow-hidden bg-[#FAF8F5] border border-[#EAE3D9]">
                <div
                  className="bg-[#3B5842] transition-all duration-500"
                  style={{
                    width: `${(n1.carbohydrates / (n1.carbohydrates + n2.carbohydrates || 1)) * 100}%`,
                  }}
                />
                <div
                  className="bg-[#C4552D] transition-all duration-500"
                  style={{
                    width: `${(n2.carbohydrates / (n1.carbohydrates + n2.carbohydrates || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#FBF4E8] text-[#8C5B1E] border border-[#E5D5BC] text-center">
              Diff: {Math.abs(diffCarbs)}g Net Carbs
            </div>
          </div>

          {/* 4. Dietary Lipids / Fats Battle Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#EAE3D9] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#A03E1B] uppercase tracking-wider">
                Dietary Lipids (Fat)
              </span>
              <Scale className="w-4 h-4 text-[#A03E1B]" />
            </div>

            <div className="flex justify-between items-baseline font-serif font-black text-xl">
              <div className="text-left">
                <span className="text-[#181513]">{n1.fat}g</span>
              </div>
              <span className="text-xs font-sans text-[#786C62] font-normal">vs</span>
              <div className="text-right">
                <span className="text-[#181513]">{n2.fat}g</span>
              </div>
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-1">
              <div className="flex h-2 rounded-full overflow-hidden bg-[#FAF8F5] border border-[#EAE3D9]">
                <div
                  className="bg-[#3B5842] transition-all duration-500"
                  style={{ width: `${(n1.fat / (n1.fat + n2.fat || 1)) * 100}%` }}
                />
                <div
                  className="bg-[#C4552D] transition-all duration-500"
                  style={{ width: `${(n2.fat / (n1.fat + n2.fat || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#FDF2EE] text-[#A03E1B] border border-[#F2C5B3] text-center">
              Diff: {Math.abs(diffFat)}g Dietary Fat
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
