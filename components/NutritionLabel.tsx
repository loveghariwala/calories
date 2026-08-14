'use client';

import React from 'react';
import { FoodItem, ServingOption } from '@/types/food';

interface NutritionLabelProps {
  food: FoodItem;
  currentServing: ServingOption;
  multiplier?: number;
}

export const NutritionLabel: React.FC<NutritionLabelProps> = ({
  food,
  currentServing,
  multiplier = 1,
}) => {
  const actualWeightGrams = currentServing.weightGrams * multiplier;
  const ratio = actualWeightGrams / 100;
  const n = food.nutrientsPer100g;

  // Calculated values
  const calories = Math.round(n.calories * ratio);
  const totalFat = Math.round(n.fat * ratio * 10) / 10;
  const satFat = n.saturatedFat !== undefined ? Math.round(n.saturatedFat * ratio * 10) / 10 : 0;
  const transFat = n.transFat !== undefined ? Math.round(n.transFat * ratio * 10) / 10 : 0;
  const cholesterol = n.cholesterol !== undefined ? Math.round(n.cholesterol * ratio) : 0;
  const sodium = n.sodium !== undefined ? Math.round(n.sodium * ratio) : 0;
  const totalCarbs = Math.round(n.carbohydrates * ratio * 10) / 10;
  const dietaryFiber = n.fiber !== undefined ? Math.round(n.fiber * ratio * 10) / 10 : 0;
  const totalSugars = n.sugar !== undefined ? Math.round(n.sugar * ratio * 10) / 10 : 0;
  const protein = Math.round(n.protein * ratio * 10) / 10;

  // FDA Daily Values (DV based on 2,000 kcal diet)
  const fatDV = Math.round((totalFat / 78) * 100);
  const satFatDV = Math.round((satFat / 20) * 100);
  const cholesterolDV = Math.round((cholesterol / 300) * 100);
  const sodiumDV = Math.round((sodium / 2300) * 100);
  const carbDV = Math.round((totalCarbs / 275) * 100);
  const fiberDV = Math.round((dietaryFiber / 28) * 100);
  const proteinDV = Math.round((protein / 50) * 100);

  return (
    <div className="bg-white text-black p-6 rounded-3xl border-4 border-black shadow-2xl max-w-sm w-full font-sans select-text ring-8 ring-white/10">
      {/* Title with Print Button */}
      <div className="flex items-center justify-between border-b-8 border-black pb-1">
        <h3 className="text-3xl font-black tracking-tight leading-none uppercase">
          Nutrition Facts
        </h3>
        <button
          onClick={() => window.print()}
          className="no-print text-xs font-bold px-2 py-1 rounded bg-black text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          title="Print Nutrition Label"
        >
          Print Label
        </button>
      </div>

      {/* Serving Info */}
      <div className="py-2.5 border-b border-black flex justify-between items-baseline text-sm font-bold">
        <span>Serving Size</span>
        <span className="text-base font-black">
          {multiplier !== 1 ? `${multiplier}x ` : ''}
          {currentServing.label} ({Math.round(actualWeightGrams)}g)
        </span>
      </div>

      {/* Calories */}
      <div className="py-3 border-b-6 border-black flex justify-between items-end">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-600">
            Amount Per Serving
          </div>
          <div className="text-2xl font-black">Calories</div>
        </div>
        <div className="text-5xl font-black tracking-tight leading-none">{calories}</div>
      </div>

      {/* Daily Value Header */}
      <div className="py-1 text-right text-[11px] font-black border-b border-black uppercase tracking-wider">
        % Daily Value *
      </div>

      {/* Fat */}
      <div className="py-1.5 border-b border-zinc-300 text-sm flex justify-between">
        <span>
          <strong className="font-black">Total Fat</strong> {totalFat}g
        </span>
        <span className="font-black">{fatDV}%</span>
      </div>
      <div className="pl-4 py-1 border-b border-zinc-200 text-xs flex justify-between text-zinc-700">
        <span>Saturated Fat {satFat}g</span>
        <span className="font-bold">{satFatDV}%</span>
      </div>
      <div className="pl-4 py-1 border-b border-zinc-200 text-xs flex justify-between text-zinc-700">
        <span><em>Trans</em> Fat {transFat}g</span>
        <span></span>
      </div>

      {/* Cholesterol */}
      <div className="py-1.5 border-b border-zinc-300 text-sm flex justify-between">
        <span>
          <strong className="font-black">Cholesterol</strong> {cholesterol}mg
        </span>
        <span className="font-black">{cholesterolDV}%</span>
      </div>

      {/* Sodium */}
      <div className="py-1.5 border-b border-zinc-300 text-sm flex justify-between">
        <span>
          <strong className="font-black">Sodium</strong> {sodium}mg
        </span>
        <span className="font-black">{sodiumDV}%</span>
      </div>

      {/* Carbs */}
      <div className="py-1.5 border-b border-zinc-300 text-sm flex justify-between">
        <span>
          <strong className="font-black">Total Carbohydrate</strong> {totalCarbs}g
        </span>
        <span className="font-black">{carbDV}%</span>
      </div>
      <div className="pl-4 py-1 border-b border-zinc-200 text-xs flex justify-between text-zinc-700">
        <span>Dietary Fiber {dietaryFiber}g</span>
        <span className="font-bold">{fiberDV}%</span>
      </div>
      <div className="pl-4 py-1 border-b border-zinc-200 text-xs flex justify-between text-zinc-700">
        <span>Total Sugars {totalSugars}g</span>
        <span></span>
      </div>

      {/* Protein */}
      <div className="py-2 border-b-8 border-black text-sm flex justify-between">
        <span>
          <strong className="font-black text-base">Protein</strong>{' '}
          <span className="font-extrabold text-base">{protein}g</span>
        </span>
        <span className="font-black text-base">{proteinDV}%</span>
      </div>

      {/* Micronutrients */}
      <div className="pt-2 text-xs text-zinc-700 space-y-1 font-semibold">
        {n.calcium !== undefined && (
          <div className="flex justify-between border-b border-zinc-200 pb-1">
            <span>Calcium {Math.round(n.calcium * ratio)}mg</span>
            <span>{Math.round(((n.calcium * ratio) / 1300) * 100)}%</span>
          </div>
        )}
        {n.iron !== undefined && (
          <div className="flex justify-between border-b border-zinc-200 pb-1">
            <span>Iron {Math.round(n.iron * ratio * 10) / 10}mg</span>
            <span>{Math.round(((n.iron * ratio) / 18) * 100)}%</span>
          </div>
        )}
        {n.potassium !== undefined && (
          <div className="flex justify-between border-b border-zinc-200 pb-1">
            <span>Potassium {Math.round(n.potassium * ratio)}mg</span>
            <span>{Math.round(((n.potassium * ratio) / 4700) * 100)}%</span>
          </div>
        )}
        {n.vitaminC !== undefined && (
          <div className="flex justify-between border-b border-zinc-200 pb-1">
            <span>Vitamin C {Math.round(n.vitaminC * ratio * 10) / 10}mg</span>
            <span>{Math.round(((n.vitaminC * ratio) / 90) * 100)}%</span>
          </div>
        )}
      </div>

      {/* Footnote */}
      <p className="mt-3 text-[9px] leading-tight text-zinc-500 border-t-2 border-black pt-2 font-medium">
        * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet of 2,000 calories a day.
      </p>
    </div>
  );
};
