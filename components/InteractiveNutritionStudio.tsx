'use client';

import React, { useState } from 'react';
import { FoodItem, ServingOption, MealType } from '@/types/food';
import { NutritionLabel } from './NutritionLabel';
import { MacroChart } from './MacroChart';
import { ExerciseBurn } from './ExerciseBurn';
import { addMealEntry } from '@/lib/storage';
import { Plus, Check, Share2, Scale, Utensils, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface InteractiveNutritionStudioProps {
  food: FoodItem;
}

export const InteractiveNutritionStudio: React.FC<InteractiveNutritionStudioProps> = ({ food }) => {
  const defaultServing = food.servings.find((s) => s.isDefault) || food.servings[0];
  const [selectedServing, setSelectedServing] = useState<ServingOption>(defaultServing);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [customGrams, setCustomGrams] = useState<number>(defaultServing.weightGrams);
  const [useCustomGrams, setUseCustomGrams] = useState<boolean>(false);
  const [mealAdded, setMealAdded] = useState<MealType | null>(null);
  const [shareCopied, setShareCopied] = useState<boolean>(false);

  const activeWeightGrams = useCustomGrams ? customGrams : selectedServing.weightGrams * multiplier;
  const ratio = activeWeightGrams / 100;
  const n = food.nutrientsPer100g;

  const activeCalories = Math.round(n.calories * ratio);
  const activeProtein = Math.round(n.protein * ratio * 10) / 10;
  const activeCarbs = Math.round(n.carbohydrates * ratio * 10) / 10;
  const activeFat = Math.round(n.fat * ratio * 10) / 10;
  const activeFiber = Math.round((n.fiber || 0) * ratio * 10) / 10;

  const handleServingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = food.servings.find((s) => s.label === e.target.value);
    if (found) {
      setSelectedServing(found);
      setUseCustomGrams(false);
      setCustomGrams(found.weightGrams * multiplier);
    }
  };

  const handleLogMeal = (mealType: MealType) => {
    const label = useCustomGrams
      ? `${Math.round(customGrams)}g`
      : `${multiplier !== 1 ? `${multiplier}x ` : ''}${selectedServing.label}`;

    addMealEntry({
      foodId: food.id,
      name: food.name,
      emoji: food.emoji,
      mealType,
      servingLabel: label,
      weightGrams: activeWeightGrams,
      calories: activeCalories,
      protein: activeProtein,
      carbs: activeCarbs,
      fat: activeFat,
      fiber: activeFiber,
    });

    setMealAdded(mealType);
    setTimeout(() => setMealAdded(null), 3000);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Portion Calibration Deck */}
      <div className="editorial-card rounded-3xl p-6 sm:p-10 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE3D9] mb-6">
          <div>
            <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#C4552D]">
              Interactive Portion Calibration
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#181513] mt-0.5">
              Serving &amp; Kitchen Scale Atelier
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-full border border-[#EAE3D9] bg-white text-xs font-semibold text-[#786C62] hover:text-[#181513] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5 text-[#C4552D]" />
              {shareCopied ? 'Copied' : 'Share'}
            </button>
            <Link
              href={`/compare?food1=${food.slug}`}
              className="px-4 py-2 rounded-full bg-[#F8EFEA] border border-[#EAE3D9] text-xs font-semibold text-[#C4552D] hover:bg-[#C4552D] hover:text-white flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Scale className="w-3.5 h-3.5" /> Face-Off
            </Link>
          </div>
        </div>

        {/* Portion Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-end mb-6">
          {/* Portion Dropdown */}
          <div className="sm:col-span-6 space-y-2">
            <label className="block text-xs font-semibold text-[#786C62]">
              Select Standard Serving
            </label>
            <select
              value={useCustomGrams ? 'custom' : selectedServing.label}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setUseCustomGrams(true);
                } else {
                  handleServingChange(e);
                }
              }}
              className="w-full p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] text-[#181513] text-sm outline-none focus:border-[#C4552D] cursor-pointer shadow-2xs font-sans"
            >
              {food.servings.map((s) => (
                <option key={s.label} value={s.label}>
                  {s.label} ({s.weightGrams}g)
                </option>
              ))}
              <option value="custom">⚖️ Custom Kitchen Scale Grams</option>
            </select>
          </div>

          {/* Stepper / Slider */}
          <div className="sm:col-span-6 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-[#786C62]">
                {useCustomGrams ? 'Precision Scale Grams' : 'Serving Multiplier'}
              </span>
              <span className="text-[#C4552D] font-bold">
                {Math.round(activeWeightGrams)} grams
              </span>
            </div>

            {useCustomGrams ? (
              <div className="flex items-center gap-3 bg-[#FAF8F5] border border-[#EAE3D9] p-2.5 rounded-2xl">
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="5"
                  value={customGrams}
                  onChange={(e) => setCustomGrams(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
                <input
                  type="number"
                  min="1"
                  max="5000"
                  value={customGrams}
                  onChange={(e) => setCustomGrams(Math.max(1, Number(e.target.value)))}
                  className="w-20 p-1.5 rounded-xl bg-white border border-[#EAE3D9] text-[#181513] text-center text-xs font-bold"
                />
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-2">
                {[0.5, 1, 1.5, 2, 3].map((val) => (
                  <button
                    key={val}
                    onClick={() => setMultiplier(val)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      multiplier === val
                        ? 'bg-[#C4552D] text-white shadow-xs'
                        : 'bg-[#FAF8F5] text-[#786C62] hover:text-[#181513] border border-[#EAE3D9]'
                    }`}
                  >
                    {val}x
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Nutrient Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] mb-6">
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#786C62] block">
              Calibrated Energy
            </span>
            <div className="text-2xl font-serif font-bold text-[#181513] mt-0.5">
              {activeCalories} <span className="text-xs text-[#C4552D] font-normal font-sans">kcal</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#3B5842] block">
              Protein
            </span>
            <div className="text-2xl font-serif font-bold text-[#181513] mt-0.5">{activeProtein}g</div>
          </div>
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#C9822B] block">
              Carbohydrates
            </span>
            <div className="text-2xl font-serif font-bold text-[#181513] mt-0.5">{activeCarbs}g</div>
          </div>
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#C4552D] block">
              Dietary Lipids
            </span>
            <div className="text-2xl font-serif font-bold text-[#181513] mt-0.5">{activeFat}g</div>
          </div>
        </div>

        {/* 1-Click Log */}
        <div className="pt-4 border-t border-[#EAE3D9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-xs font-sans text-[#786C62] flex items-center gap-2">
            <Utensils className="w-3.5 h-3.5 text-[#C4552D]" /> Log calibrated portion ({Math.round(activeWeightGrams)}g) to:
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { meal: 'breakfast' as MealType, label: 'Breakfast', emoji: '🌅', style: 'bg-[#FDF6EC] text-[#9E5D0E] border-[#E8CEAB] hover:bg-[#C9822B] hover:text-white hover:border-[#C9822B]' },
              { meal: 'lunch' as MealType, label: 'Lunch', emoji: '☀️', style: 'bg-[#F0F7F2] text-[#2D5436] border-[#C3DCC8] hover:bg-[#3B5842] hover:text-white hover:border-[#3B5842]' },
              { meal: 'dinner' as MealType, label: 'Dinner', emoji: '🌙', style: 'bg-[#FDF2EE] text-[#A03E1B] border-[#F2C5B3] hover:bg-[#C4552D] hover:text-white hover:border-[#C4552D]' },
              { meal: 'snack' as MealType, label: 'Snack', emoji: '🍎', style: 'bg-[#F8F2F9] text-[#783872] border-[#DFC2DE] hover:bg-[#8C4A82] hover:text-white hover:border-[#8C4A82]' },
            ].map(({ meal, label, emoji, style }) => (
              <button
                key={meal}
                onClick={() => handleLogMeal(meal)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer border shadow-2xs hover:scale-103 active:scale-95 ${
                  mealAdded === meal
                    ? 'bg-[#181513] text-white border-[#181513] ring-2 ring-[#C4552D]'
                    : style
                }`}
              >
                {mealAdded === meal ? <Check className="w-3.5 h-3.5 text-[#C4552D]" /> : <span className="text-xs">{emoji}</span>}
                <span>+ {label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* FDA/USDA Nutrition Facts Label */}
        <div className="lg:col-span-5 flex justify-center">
          <NutritionLabel
            food={food}
            currentServing={
              useCustomGrams
                ? { label: 'Custom Grams', weightGrams: customGrams }
                : selectedServing
            }
            multiplier={useCustomGrams ? 1 : multiplier}
          />
        </div>

        {/* Macro Spectrum Visualizer & Workout Simulator */}
        <div className="lg:col-span-7 space-y-6">
          <MacroChart
            proteinGrams={activeProtein}
            carbsGrams={activeCarbs}
            fatGrams={activeFat}
            totalCalories={activeCalories}
          />

          <ExerciseBurn calories={activeCalories} />
        </div>
      </div>
    </div>
  );
};
