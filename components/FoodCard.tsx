'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FoodItem, MealType } from '@/types/food';
import { addMealEntry } from '@/lib/storage';
import { Food3DAsset } from './Food3DAsset';
import { Plus, Check, Scale, ArrowUpRight, Sparkles } from 'lucide-react';
import { InteractiveTilt } from './InteractiveTilt';

interface FoodCardProps {
  food: FoodItem;
  onCompare?: (food: FoodItem) => void;
  isComparing?: boolean;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  food,
  onCompare,
  isComparing = false,
}) => {
  const [showMealPicker, setShowMealPicker] = useState(false);
  const [addedMeal, setAddedMeal] = useState<MealType | null>(null);

  const defaultServing = food.servings.find((s) => s.isDefault) || food.servings[0];
  const ratio = (defaultServing ? defaultServing.weightGrams : 100) / 100;

  const cals = Math.round(food.nutrientsPer100g.calories * ratio);
  const protein = Math.round(food.nutrientsPer100g.protein * ratio * 10) / 10;
  const carbs = Math.round(food.nutrientsPer100g.carbohydrates * ratio * 10) / 10;
  const fat = Math.round(food.nutrientsPer100g.fat * ratio * 10) / 10;

  const pCal = protein * 4;
  const cCal = carbs * 4;
  const fCal = fat * 9;
  const totalCal = pCal + cCal + fCal || 1;

  const pPct = Math.round((pCal / totalCal) * 100);
  const cPct = Math.round((cCal / totalCal) * 100);
  const fPct = Math.max(0, 100 - pPct - cPct);

  const handleAdd = (mealType: MealType, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addMealEntry({
      foodId: food.id,
      name: food.name,
      emoji: food.emoji,
      mealType,
      servingLabel: defaultServing ? defaultServing.label : '100g',
      weightGrams: defaultServing ? defaultServing.weightGrams : 100,
      calories: cals,
      protein,
      carbs,
      fat,
      fiber: Math.round((food.nutrientsPer100g.fiber || 0) * ratio * 10) / 10,
    });

    setAddedMeal(mealType);
    setShowMealPicker(false);
    setTimeout(() => setAddedMeal(null), 2500);
  };

  return (
    <InteractiveTilt maxTilt={7} scale={1.02} className="h-full">
      <div className="editorial-card rounded-3xl p-4 sm:p-5 flex flex-col justify-between relative group font-sans h-full overflow-hidden">
      <div>
        {/* Specimen Header & Photography */}
        <div className="flex items-center gap-3.5 mb-3">
          <Link href={`/food/${food.slug}`} className="relative shrink-0 w-14 h-14 rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#EAE3D9] shadow-2xs group-hover:scale-105 transition-transform duration-300">
            {food.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={food.imageUrl}
                alt={food.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-2xl">
                {food.emoji}
              </span>
            )}
            <span className="absolute bottom-1 right-1 text-xs bg-white/80 backdrop-blur-xs rounded-full px-1 shadow-2xs">
              {food.emoji}
            </span>
          </Link>

          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#786C62] block truncate">
              {food.categoryName}
            </span>
            <Link href={`/food/${food.slug}`} className="block">
              <h3 className="font-serif font-bold text-base text-[#181513] group-hover:text-[#C4552D] transition-colors line-clamp-1">
                {food.name}
              </h3>
            </Link>
          </div>
        </div>

        {/* Energy Readout */}
        <div className="flex items-baseline justify-between py-2.5 border-y border-[#EAE3D9] my-2">
          <div className="text-xs text-[#786C62]">
            {defaultServing ? defaultServing.label : '100g'}
          </div>
          <div className="text-right flex items-baseline gap-1">
            <span className="text-2xl font-serif font-bold text-[#181513]">
              {cals}
            </span>
            <span className="text-xs text-[#C4552D] font-medium">kcal</span>
          </div>
        </div>

        {/* Macro Spectrum Display */}
        <div className="my-2.5 space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#3B5842] font-semibold">{protein}g P</span>
            <span className="text-[#C9822B] font-semibold">{carbs}g C</span>
            <span className="text-[#C4552D] font-semibold">{fat}g F</span>
          </div>

          {/* Multi-color Line */}
          <div className="w-full bg-[#EAE3D9] h-1.5 rounded-full overflow-hidden flex gap-0.5">
            <div style={{ width: `${pPct}%` }} className="bg-[#3B5842] h-full rounded-full" />
            <div style={{ width: `${cPct}%` }} className="bg-[#C9822B] h-full rounded-full" />
            <div style={{ width: `${fPct}%` }} className="bg-[#C4552D] h-full rounded-full" />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-[#EAE3D9] flex items-center justify-between gap-2 mt-auto">
        <Link
          href={`/food/${food.slug}`}
          className="text-xs font-semibold text-[#181513] hover:text-[#C4552D] flex items-center gap-1 transition-colors"
        >
          Details <ArrowUpRight className="w-3.5 h-3.5 text-[#C4552D]" />
        </Link>

        <div className="flex items-center gap-1.5 relative">
          {onCompare && (
            <button
              onClick={() => onCompare(food)}
              title="Compare food"
              className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                isComparing
                  ? 'bg-[#C4552D] text-white border-[#C4552D]'
                  : 'bg-[#FAF8F5] text-[#786C62] border-[#EAE3D9] hover:text-[#181513] hover:border-[#C4552D]'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Quick Log Button */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowMealPicker(!showMealPicker);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                addedMeal
                  ? 'bg-[#C4552D] text-white'
                  : 'bg-[#FAF8F5] hover:bg-[#F8EFEA] text-[#181513] hover:text-[#C4552D] border border-[#EAE3D9]'
              }`}
            >
              {addedMeal ? (
                <>
                  <Check className="w-3 h-3" /> Logged
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3 text-[#C4552D]" /> Log
                </>
              )}
            </button>

            {/* Meal Selector Popover */}
            {showMealPicker && (
              <div className="absolute right-0 bottom-full mb-2 w-36 bg-white border border-[#EAE3D9] rounded-2xl shadow-xl p-1.5 z-30 flex flex-col gap-1 text-xs font-sans animate-in fade-in zoom-in-95 duration-150">
                <span className="px-2 py-0.5 text-[9px] uppercase text-[#786C62] font-bold">
                  Log to Meal:
                </span>
                <button
                  onClick={(e) => handleAdd('breakfast', e)}
                  className="px-2 py-1 text-left rounded-lg hover:bg-[#F8EFEA] hover:text-[#C4552D] transition-colors"
                >
                  🍳 Breakfast
                </button>
                <button
                  onClick={(e) => handleAdd('lunch', e)}
                  className="px-2 py-1 text-left rounded-lg hover:bg-[#F8EFEA] hover:text-[#C4552D] transition-colors"
                >
                  🥗 Lunch
                </button>
                <button
                  onClick={(e) => handleAdd('dinner', e)}
                  className="px-2 py-1 text-left rounded-lg hover:bg-[#F8EFEA] hover:text-[#C4552D] transition-colors"
                >
                  🍲 Dinner
                </button>
                <button
                  onClick={(e) => handleAdd('snack', e)}
                  className="px-2 py-1 text-left rounded-lg hover:bg-[#F8EFEA] hover:text-[#C4552D] transition-colors"
                >
                  🍎 Snack
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </InteractiveTilt>
  );
};
