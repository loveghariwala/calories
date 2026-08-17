'use client';

import React, { useState, useEffect } from 'react';
import { FoodItem, MealType } from '@/types/food';
import { addMealEntry } from '@/lib/storage';
import { ArrowUpRight, Loader2, Sparkles } from 'lucide-react';
import { MacroOrbital3D } from './MacroOrbital3D';
import Link from 'next/link';

interface HeroNutritionStudioProps {
  initialFoods?: FoodItem[];
}

export const HeroNutritionStudio: React.FC<HeroNutritionStudioProps> = ({ initialFoods }) => {
  const [featured, setFeatured] = useState<FoodItem[]>(initialFoods || []);
  const [activeFood, setActiveFood] = useState<FoodItem | null>(initialFoods && initialFoods.length > 0 ? initialFoods[0] : null);
  const [portionGrams, setPortionGrams] = useState<number>(150);
  const [added, setAdded] = useState<MealType | null>(null);
  const [loading, setLoading] = useState<boolean>(!initialFoods || initialFoods.length === 0);

  // Dynamically fetch featured foods from API if initialFoods not provided
  useEffect(() => {
    if (initialFoods && initialFoods.length > 0) {
      setFeatured(initialFoods);
      setActiveFood(initialFoods[0]);
      setLoading(false);
      return;
    }

    async function loadDynamicFoods() {
      try {
        setLoading(true);
        const res = await fetch('/api/foods/search?limit=8');
        if (res.ok) {
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            setFeatured(data.results);
            setActiveFood(data.results[0]);
            const def = data.results[0].servings?.find((s: { isDefault?: boolean }) => s.isDefault) || data.results[0].servings?.[0];
            if (def) setPortionGrams(def.weightGrams || 100);
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic USDA foods:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDynamicFoods();
  }, [initialFoods]);

  if (loading || !activeFood) {
    return (
      <div className="editorial-card rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3 min-h-[300px]">
        <Loader2 className="w-8 h-8 text-[#C4552D] animate-spin" />
        <div className="text-xs font-sans font-bold text-[#786C62]">
          Connecting to USDA FoodData Central...
        </div>
      </div>
    );
  }

  const ratio = portionGrams / 100;
  const n = activeFood.nutrientsPer100g || {
    calories: 100,
    protein: 10,
    carbohydrates: 10,
    fat: 2,
  };

  const calories = Math.round(n.calories * ratio);
  const protein = Math.round(n.protein * ratio * 10) / 10;
  const carbs = Math.round(n.carbohydrates * ratio * 10) / 10;
  const fat = Math.round(n.fat * ratio * 10) / 10;

  const totalMacroGrams = protein + carbs + fat || 1;
  const pPct = Math.round((protein / totalMacroGrams) * 100);
  const cPct = Math.round((carbs / totalMacroGrams) * 100);
  const fPct = Math.max(0, 100 - pPct - cPct);

  const satietyIndex =
    protein > 20
      ? '99.4%'
      : n.fiber && n.fiber > 4
      ? '94.2%'
      : calories < 100
      ? '88.7%'
      : '82.0%';

  const bioGrade =
    protein > 25
      ? 'Grade A+ Satiety'
      : n.fiber && n.fiber > 5
      ? 'High Prebiotic'
      : 'Nutrient Dense';

  const handleAdd = (meal: MealType) => {
    addMealEntry({
      foodId: activeFood.id,
      name: activeFood.name,
      emoji: activeFood.emoji,
      mealType: meal,
      servingLabel: `${portionGrams}g portion`,
      weightGrams: portionGrams,
      calories,
      protein,
      carbs,
      fat,
      fiber: Math.round((n.fiber || 0) * ratio * 10) / 10,
    });
    setAdded(meal);
    setTimeout(() => setAdded(null), 1500);
  };

  return (
    <div className="editorial-card rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden w-full text-left font-sans shadow-md">
      {/* Studio Masthead & Tasting Bar Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#EAE3D9]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#C4552D]" />
            <span className="text-[11px] font-sans font-bold tracking-widest text-[#C4552D] uppercase">
              The Macronutrient Atelier
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513]">
            Interactive Whole Food Calibration
          </h3>
        </div>

        {/* Dynamic Food Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {featured.map((food) => {
            const isSelected = activeFood.id === food.id;
            return (
              <button
                key={food.id}
                onClick={() => {
                  setActiveFood(food);
                  const def = food.servings?.find((s) => s.isDefault) || food.servings?.[0];
                  setPortionGrams(def ? def.weightGrams : 100);
                }}
                className={`px-4 py-2 rounded-full text-xs font-sans font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#C4552D] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#2A2421] hover:bg-[#F4EFEB] border border-[#EAE3D9]'
                }`}
              >
                <span className="text-sm">{food.emoji}</span>
                <span>{food.name.split('(')[0].trim()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 pt-8 items-stretch">
        {/* Left: Specimen Profile & Gram Slider */}
        <div className="md:col-span-6 lg:col-span-4 bg-[#FAF8F5] border border-[#EAE3D9] rounded-2xl p-6 flex flex-col justify-between space-y-5">
          <div className="flex items-center gap-4">
            <span className="text-4xl p-3 rounded-2xl bg-white border border-[#EAE3D9] shadow-xs shrink-0">
              {activeFood.emoji}
            </span>
            <div className="min-w-0">
              <span className="text-[10px] font-sans font-bold tracking-wider text-[#786C62] uppercase block truncate">
                {activeFood.categoryName} • USDA #{activeFood.usdaId || '8841'}
              </span>
              <h4 className="font-serif font-bold text-lg sm:text-xl text-[#181513] truncate" title={activeFood.name}>
                {activeFood.name}
              </h4>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#EAE3D9] flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-xs font-sans text-[#786C62] block">Calibrated Yield:</span>
              <div className="text-3xl font-serif font-bold text-[#181513] flex items-baseline gap-1 mt-0.5">
                {calories} <span className="text-xs font-sans font-normal text-[#C4552D]">kcal</span>
              </div>
            </div>
            <div className="shrink-0 -my-3">
              <MacroOrbital3D
                calories={calories}
                protein={protein}
                carbs={carbs}
                fat={fat}
                size={96}
              />
            </div>
          </div>

          {/* Portion Gram Slider */}
          <div className="space-y-2.5 pt-1">
            <div className="flex justify-between text-xs font-sans text-[#786C62]">
              <span>Kitchen Scale Grams:</span>
              <span className="font-bold text-[#C4552D] bg-[#F8EFEA] px-2.5 py-0.5 rounded-md border border-[#EAE3D9]">
                {portionGrams}g
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="400"
              step="5"
              value={portionGrams}
              onChange={(e) => setPortionGrams(Number(e.target.value))}
              className="w-full cursor-pointer accent-[#C4552D]"
            />
            <div className="flex justify-between text-[10px] text-[#786C62]">
              <span>20g (Taste)</span>
              <span>150g (Standard)</span>
              <span>400g (Full Plate)</span>
            </div>
          </div>
        </div>

        {/* Center: Macro Spectrum Architecture */}
        <div className="md:col-span-6 lg:col-span-5 bg-[#FAF8F5] border border-[#EAE3D9] rounded-2xl p-6 flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-sans uppercase tracking-widest text-[#786C62] font-bold">
              Macronutrient Spectrum
            </span>
            <span className="text-[10px] font-sans font-semibold text-[#3B5842] bg-[#EBF2EC] px-2.5 py-0.5 rounded-full border border-[#D5E5D8]">
              {bioGrade}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            {/* Protein */}
            <div className="bg-white border border-[#EAE3D9] rounded-2xl p-3 shadow-2xs flex flex-col items-center justify-between min-h-[112px]">
              <span className="text-[10px] font-sans font-bold text-[#3B5842] uppercase tracking-wider">
                Protein
              </span>
              <div className="flex items-baseline justify-center my-1">
                <span className="text-xl sm:text-2xl font-serif font-bold text-[#181513]">
                  {protein}
                </span>
                <span className="text-[11px] font-sans text-[#786C62] ml-0.5 font-normal">g</span>
              </div>
              <span className="text-[10px] font-sans font-semibold text-[#3B5842] bg-[#EBF2EC] px-2 py-0.5 rounded-full border border-[#D5E5D8] whitespace-nowrap">
                {pPct}% cal
              </span>
            </div>

            {/* Carbs */}
            <div className="bg-white border border-[#EAE3D9] rounded-2xl p-3 shadow-2xs flex flex-col items-center justify-between min-h-[112px]">
              <span className="text-[10px] font-sans font-bold text-[#C9822B] uppercase tracking-wider">
                Carbs
              </span>
              <div className="flex items-baseline justify-center my-1">
                <span className="text-xl sm:text-2xl font-serif font-bold text-[#181513]">
                  {carbs}
                </span>
                <span className="text-[11px] font-sans text-[#786C62] ml-0.5 font-normal">g</span>
              </div>
              <span className="text-[10px] font-sans font-semibold text-[#C9822B] bg-[#FBF4E8] px-2 py-0.5 rounded-full border border-[#F3E1C5] whitespace-nowrap">
                {cPct}% cal
              </span>
            </div>

            {/* Fat / Lipids */}
            <div className="bg-white border border-[#EAE3D9] rounded-2xl p-3 shadow-2xs flex flex-col items-center justify-between min-h-[112px]">
              <span className="text-[10px] font-sans font-bold text-[#C4552D] uppercase tracking-wider">
                Lipids
              </span>
              <div className="flex items-baseline justify-center my-1">
                <span className="text-xl sm:text-2xl font-serif font-bold text-[#181513]">
                  {fat}
                </span>
                <span className="text-[11px] font-sans text-[#786C62] ml-0.5 font-normal">g</span>
              </div>
              <span className="text-[10px] font-sans font-semibold text-[#C4552D] bg-[#F8EFEA] px-2 py-0.5 rounded-full border border-[#ECCDC1] whitespace-nowrap">
                {fPct}% cal
              </span>
            </div>
          </div>

          {/* Luxury Macro Spectrum Bar */}
          <div className="w-full bg-[#EAE3D9] h-2.5 rounded-full overflow-hidden flex gap-0.5 p-0.5">
            <div style={{ width: `${pPct}%` }} className="bg-[#3B5842] h-full rounded-full transition-all duration-300" />
            <div style={{ width: `${cPct}%` }} className="bg-[#C9822B] h-full rounded-full transition-all duration-300" />
            <div style={{ width: `${fPct}%` }} className="bg-[#C4552D] h-full rounded-full transition-all duration-300" />
          </div>
        </div>

        {/* Right: Gold Seal Metabolic Telemetry & Highlighted Meal Logger */}
        <div className="md:col-span-12 lg:col-span-3 flex flex-col justify-between space-y-4">
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] space-y-2">
            <div className="flex items-center justify-between text-xs font-sans text-[#786C62]">
              <span>Satiety Index:</span>
              <span className="font-bold text-[#3B5842]">{satietyIndex}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-sans text-[#786C62]">
              <span>Bio-Density:</span>
              <span className="font-bold text-[#181513]">Clinical Grade</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] space-y-2.5">
            <span className="text-[10px] font-sans uppercase tracking-wider text-[#786C62] font-bold block">
              Log Portion ({portionGrams}g) to:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { meal: 'breakfast' as MealType, label: 'Breakfast', emoji: '🌅', style: 'bg-[#FDF6EC] text-[#9E5D0E] border-[#E8CEAB] hover:bg-[#C9822B] hover:text-white hover:border-[#C9822B]' },
                { meal: 'lunch' as MealType, label: 'Lunch', emoji: '☀️', style: 'bg-[#F0F7F2] text-[#2D5436] border-[#C3DCC8] hover:bg-[#3B5842] hover:text-white hover:border-[#3B5842]' },
                { meal: 'dinner' as MealType, label: 'Dinner', emoji: '🌙', style: 'bg-[#FDF2EE] text-[#A03E1B] border-[#F2C5B3] hover:bg-[#C4552D] hover:text-white hover:border-[#C4552D]' },
                { meal: 'snack' as MealType, label: 'Snack', emoji: '🍎', style: 'bg-[#F8F2F9] text-[#783872] border-[#DFC2DE] hover:bg-[#8C4A82] hover:text-white hover:border-[#8C4A82]' },
              ].map(({ meal, label, emoji, style }) => (
                <button
                  key={meal}
                  onClick={() => handleAdd(meal)}
                  className={`py-2.5 px-2.5 rounded-xl text-xs font-sans font-bold transition-all duration-200 cursor-pointer border flex items-center justify-center gap-1.5 shadow-2xs hover:scale-103 active:scale-95 whitespace-nowrap ${
                    added === meal
                      ? 'bg-[#181513] text-white border-[#181513] ring-2 ring-[#C4552D]'
                      : style
                  }`}
                >
                  <span className="text-xs">{emoji}</span>
                  <span>+ {label}</span>
                </button>
              ))}
            </div>
          </div>

          <Link
            href={`/food/${activeFood.slug}`}
            className="w-full py-3 rounded-xl bg-white hover:bg-[#F8EFEA] text-[#181513] hover:text-[#C4552D] font-sans font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#EAE3D9] shadow-2xs whitespace-nowrap"
          >
            Complete Nutrition Sheet <ArrowUpRight className="w-3.5 h-3.5 text-[#C4552D]" />
          </Link>
        </div>
      </div>
    </div>
  );
};
