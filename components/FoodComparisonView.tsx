'use client';

import React, { useState, useEffect } from 'react';
import { FoodItem } from '@/types/food';
import { getAllFoods } from '@/data/foodDatabase';
import { Scale, ArrowRight, Check, Flame, Trophy, Search, Loader2 } from 'lucide-react';
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
          const res = await fetch(`/api/foods/search?q=${encodeURIComponent(search1.trim())}&limit=6`);
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
          const res = await fetch(`/api/foods/search?q=${encodeURIComponent(search2.trim())}&limit=6`);
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

  const n1 = food1.nutrientsPer100g;
  const n2 = food2.nutrientsPer100g;

  const diffCal = n1.calories - n2.calories;
  const diffProt = Math.round((n1.protein - n2.protein) * 10) / 10;
  const diffCarbs = Math.round((n1.carbohydrates - n2.carbohydrates) * 10) / 10;
  const diffFat = Math.round((n1.fat - n2.fat) * 10) / 10;

  return (
    <div className="space-y-8 font-sans">
      {/* Contender Dynamic Search & Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contender 1 */}
        <div className="editorial-card p-6 rounded-3xl relative space-y-3 bg-white shadow-xs">
          <label className="block text-[11px] font-sans font-bold uppercase tracking-widest text-[#3B5842]">
            CONTENDER #1 (BASELINE)
          </label>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9]">
            <span className="text-3xl p-2 bg-white rounded-xl shadow-2xs shrink-0">{food1.emoji}</span>
            <div className="min-w-0 flex-1">
              <div className="font-serif font-bold text-base text-[#181513] truncate">{food1.name}</div>
              <div className="text-xs text-[#786C62]">{food1.nutrientsPer100g.calories} kcal • {food1.nutrientsPer100g.protein}g Protein per 100g</div>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#EAE3D9] text-xs">
              <Search className="w-4 h-4 text-[#786C62]" />
              <input
                type="text"
                value={search1}
                onChange={(e) => setSearch1(e.target.value)}
                placeholder="Search live USDA database for food 1..."
                className="w-full bg-transparent outline-none text-[#181513] font-medium"
              />
              {loading1 && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C4552D]" />}
            </div>

            {results1.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 p-1 bg-white border border-[#EAE3D9] rounded-2xl shadow-xl z-20 max-h-48 overflow-y-auto space-y-1">
                {results1.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setFood1(f);
                      setSearch1('');
                      setResults1([]);
                    }}
                    className="w-full p-2 rounded-xl text-left hover:bg-[#FAF8F5] flex items-center justify-between text-xs cursor-pointer transition-colors"
                  >
                    <span className="truncate font-semibold text-[#181513]">{f.emoji} {f.name}</span>
                    <span className="text-[10px] text-[#786C62] shrink-0 ml-2">{f.nutrientsPer100g.calories} kcal</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contender 2 */}
        <div className="editorial-card p-6 rounded-3xl relative space-y-3 bg-white shadow-xs">
          <label className="block text-[11px] font-sans font-bold uppercase tracking-widest text-[#C4552D]">
            CONTENDER #2 (CHALLENGER)
          </label>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9]">
            <span className="text-3xl p-2 bg-white rounded-xl shadow-2xs shrink-0">{food2.emoji}</span>
            <div className="min-w-0 flex-1">
              <div className="font-serif font-bold text-base text-[#181513] truncate">{food2.name}</div>
              <div className="text-xs text-[#786C62]">{food2.nutrientsPer100g.calories} kcal • {food2.nutrientsPer100g.protein}g Protein per 100g</div>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#EAE3D9] text-xs">
              <Search className="w-4 h-4 text-[#786C62]" />
              <input
                type="text"
                value={search2}
                onChange={(e) => setSearch2(e.target.value)}
                placeholder="Search live USDA database for food 2..."
                className="w-full bg-transparent outline-none text-[#181513] font-medium"
              />
              {loading2 && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C4552D]" />}
            </div>

            {results2.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 p-1 bg-white border border-[#EAE3D9] rounded-2xl shadow-xl z-20 max-h-48 overflow-y-auto space-y-1">
                {results2.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setFood2(f);
                      setSearch2('');
                      setResults2([]);
                    }}
                    className="w-full p-2 rounded-xl text-left hover:bg-[#FAF8F5] flex items-center justify-between text-xs cursor-pointer transition-colors"
                  >
                    <span className="truncate font-semibold text-[#181513]">{f.emoji} {f.name}</span>
                    <span className="text-[10px] text-[#786C62] shrink-0 ml-2">{f.nutrientsPer100g.calories} kcal</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side-by-Side Macro Breakdown */}
      <div className="editorial-card rounded-3xl p-6 sm:p-10 space-y-8 bg-[#FAF8F5]">
        <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#786C62]">
              Per 100 Grams Normalized Comparison
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#181513]">
              Nutritional Head-to-Head
            </h3>
          </div>
          <div className="text-xs font-bold text-[#3B5842] flex items-center gap-1.5 bg-[#EBF2EC] px-3 py-1.5 rounded-full border border-[#D5E5D8]">
            <Scale className="w-3.5 h-3.5" />
            <span>USDA Calibrated</span>
          </div>
        </div>

        {/* Comparison Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          {/* Calories */}
          <div className="p-5 rounded-2xl bg-white border border-[#EAE3D9] shadow-2xs space-y-2">
            <span className="text-[11px] font-bold text-[#786C62] uppercase block">Energy (Calories)</span>
            <div className="flex justify-around items-baseline text-lg font-serif font-bold">
              <span className={n1.calories < n2.calories ? 'text-[#3B5842]' : 'text-[#181513]'}>
                {n1.calories} <span className="text-xs font-sans font-normal text-[#786C62]">kcal</span>
              </span>
              <span className="text-xs text-[#786C62] font-normal">vs</span>
              <span className={n2.calories < n1.calories ? 'text-[#3B5842]' : 'text-[#181513]'}>
                {n2.calories} <span className="text-xs font-sans font-normal text-[#786C62]">kcal</span>
              </span>
            </div>
            <div className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#EAE3D9] text-[#786C62]">
              {diffCal === 0 ? 'Identical calories' : diffCal < 0 ? `${food1.name.split('(')[0]} is ${Math.abs(diffCal)} kcal lower` : `${food2.name.split('(')[0]} is ${Math.abs(diffCal)} kcal lower`}
            </div>
          </div>

          {/* Protein */}
          <div className="p-5 rounded-2xl bg-white border border-[#EAE3D9] shadow-2xs space-y-2">
            <span className="text-[11px] font-bold text-[#3B5842] uppercase block">Protein Density</span>
            <div className="flex justify-around items-baseline text-lg font-serif font-bold">
              <span className={n1.protein > n2.protein ? 'text-[#3B5842]' : 'text-[#181513]'}>
                {n1.protein} <span className="text-xs font-sans font-normal text-[#786C62]">g</span>
              </span>
              <span className="text-xs text-[#786C62] font-normal">vs</span>
              <span className={n2.protein > n1.protein ? 'text-[#3B5842]' : 'text-[#181513]'}>
                {n2.protein} <span className="text-xs font-sans font-normal text-[#786C62]">g</span>
              </span>
            </div>
            <div className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#EBF2EC] border border-[#D5E5D8] text-[#3B5842]">
              {diffProt === 0 ? 'Identical protein' : diffProt > 0 ? `+${diffProt}g Protein Advantage` : `+${Math.abs(diffProt)}g Protein Advantage`}
            </div>
          </div>

          {/* Carbs */}
          <div className="p-5 rounded-2xl bg-white border border-[#EAE3D9] shadow-2xs space-y-2">
            <span className="text-[11px] font-bold text-[#C9822B] uppercase block">Carbohydrates</span>
            <div className="flex justify-around items-baseline text-lg font-serif font-bold">
              <span className="text-[#181513]">{n1.carbohydrates}g</span>
              <span className="text-xs text-[#786C62] font-normal">vs</span>
              <span className="text-[#181513]">{n2.carbohydrates}g</span>
            </div>
            <div className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FBF4E8] border border-[#F3E1C5] text-[#C9822B]">
              Diff: {Math.abs(diffCarbs)}g Carbs
            </div>
          </div>

          {/* Lipids / Fat */}
          <div className="p-5 rounded-2xl bg-white border border-[#EAE3D9] shadow-2xs space-y-2">
            <span className="text-[11px] font-bold text-[#C4552D] uppercase block">Dietary Lipids</span>
            <div className="flex justify-around items-baseline text-lg font-serif font-bold">
              <span className="text-[#181513]">{n1.fat}g</span>
              <span className="text-xs text-[#786C62] font-normal">vs</span>
              <span className="text-[#181513]">{n2.fat}g</span>
            </div>
            <div className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FDF2EE] border border-[#F2C5B3] text-[#C4552D]">
              Diff: {Math.abs(diffFat)}g Fat
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
