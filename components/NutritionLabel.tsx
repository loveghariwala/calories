'use client';

import React from 'react';
import { FoodItem, ServingOption } from '@/types/food';
import { Printer, ShieldCheck, Flame, Scale, Activity } from 'lucide-react';

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

  // Calculated macro values
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

  // Energy distribution
  const proteinCals = Math.round(protein * 4);
  const carbsCals = Math.round(totalCarbs * 4);
  const fatCals = Math.round(totalFat * 9);
  const totalCalculated = (proteinCals + carbsCals + fatCals) || 1;
  const proteinPct = Math.round((proteinCals / totalCalculated) * 100);
  const carbsPct = Math.round((carbsCals / totalCalculated) * 100);
  const fatPct = Math.round((fatCals / totalCalculated) * 100);

  // Exercise burn
  const walkMin = Math.round(calories / 4.5);
  const runMin = Math.round(calories / 11.5);
  const cycleMin = Math.round(calories / 8.5);

  // FDA Daily Values (DV based on 2,000 kcal diet)
  const fatDV = Math.round((totalFat / 78) * 100);
  const satFatDV = Math.round((satFat / 20) * 100);
  const cholesterolDV = Math.round((cholesterol / 300) * 100);
  const sodiumDV = Math.round((sodium / 2300) * 100);
  const carbDV = Math.round((totalCarbs / 275) * 100);
  const fiberDV = Math.round((dietaryFiber / 28) * 100);
  const proteinDV = Math.round((protein / 50) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* ============================================================ */}
      {/* 1. ON-SCREEN INTERACTIVE NUTRITION CARD */}
      {/* ============================================================ */}
      <div className="bg-white text-black p-6 rounded-3xl border-4 border-black shadow-2xl max-w-sm w-full font-sans select-text ring-8 ring-white/10 no-print">
        {/* Title with Print Button */}
        <div className="flex items-center justify-between border-b-8 border-black pb-1">
          <h3 className="text-3xl font-black tracking-tight leading-none uppercase">
            Nutrition Facts
          </h3>
          <button
            onClick={handlePrint}
            className="text-xs font-bold px-3 py-1.5 rounded-full bg-black text-white hover:bg-neutral-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            title="Export Official PDF / Print Label"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Label</span>
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

      {/* ============================================================ */}
      {/* 2. DEDICATED 1-PAGE OFFICIAL PDF REPORT (VISIBLE ONLY ON PRINT) */}
      {/* ============================================================ */}
      <div
        id="printable-nutrition-sheet"
        className="hidden print:block font-sans text-black bg-white p-6 max-w-2xl mx-auto border-2 border-black"
      >
        {/* Certificate Header Banner */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold font-serif text-xl">
              CP
            </div>
            <div>
              <div className="text-xl font-serif font-black tracking-tight">
                Calorie<span className="font-normal italic">Pulse</span>
              </div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-600">
                USDA FoodData Central Clinical Report
              </div>
            </div>
          </div>
          <div className="text-right text-[10px] font-mono">
            <div className="font-bold uppercase">Official Nutrition Record</div>
            <div className="text-zinc-500">www.caloriepuls.com</div>
          </div>
        </div>

        {/* Food Identity & Calibrated Portion */}
        <div className="bg-zinc-50 border border-zinc-300 rounded-xl p-4 mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Food Item Analysis
            </div>
            <h1 className="text-2xl font-serif font-black tracking-tight text-black mt-0.5">
              {food.name}
            </h1>
            <div className="text-xs text-zinc-600 mt-0.5">
              Category: <span className="font-semibold text-black">{food.categoryName}</span>
            </div>
          </div>

          <div className="text-right bg-white px-4 py-2 rounded-lg border border-zinc-200">
            <div className="text-[10px] font-bold uppercase text-zinc-500">Calibrated Portion</div>
            <div className="text-lg font-black text-black">
              {multiplier !== 1 ? `${multiplier}x ` : ''}
              {currentServing.label}
            </div>
            <div className="text-xs font-mono font-bold text-[#C4552D]">
              {Math.round(actualWeightGrams)}g Total Weight
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Official FDA Box + Macro Breakdown */}
        <div className="grid grid-cols-2 gap-5 items-start">
          {/* Column 1: FDA Standard Nutrition Facts Label */}
          <div className="border-4 border-black p-4 bg-white">
            <div className="border-b-6 border-black pb-1">
              <h2 className="text-2xl font-black uppercase tracking-tight leading-none">
                Nutrition Facts
              </h2>
              <div className="text-[11px] font-bold pt-1">
                Serving Size: {currentServing.label} ({Math.round(actualWeightGrams)}g)
              </div>
            </div>

            <div className="py-2 border-b-4 border-black flex justify-between items-baseline">
              <div>
                <div className="text-[9px] font-bold uppercase">Amount Per Serving</div>
                <div className="text-xl font-black">Calories</div>
              </div>
              <div className="text-4xl font-black">{calories}</div>
            </div>

            <div className="text-right text-[9px] font-black border-b border-black py-0.5 uppercase">
              % Daily Value *
            </div>

            <div className="text-xs space-y-0.5 py-1 border-b border-black">
              <div className="flex justify-between">
                <span><strong>Total Fat</strong> {totalFat}g</span>
                <strong>{fatDV}%</strong>
              </div>
              <div className="flex justify-between pl-3 text-[11px]">
                <span>Saturated Fat {satFat}g</span>
                <span>{satFatDV}%</span>
              </div>
              <div className="flex justify-between pl-3 text-[11px]">
                <span><em>Trans</em> Fat {transFat}g</span>
                <span></span>
              </div>
              <div className="flex justify-between border-t border-zinc-200 pt-0.5">
                <span><strong>Cholesterol</strong> {cholesterol}mg</span>
                <strong>{cholesterolDV}%</strong>
              </div>
              <div className="flex justify-between border-t border-zinc-200 pt-0.5">
                <span><strong>Sodium</strong> {sodium}mg</span>
                <strong>{sodiumDV}%</strong>
              </div>
              <div className="flex justify-between border-t border-zinc-200 pt-0.5">
                <span><strong>Total Carbohydrate</strong> {totalCarbs}g</span>
                <strong>{carbDV}%</strong>
              </div>
              <div className="flex justify-between pl-3 text-[11px]">
                <span>Dietary Fiber {dietaryFiber}g</span>
                <span>{fiberDV}%</span>
              </div>
              <div className="flex justify-between pl-3 text-[11px]">
                <span>Total Sugars {totalSugars}g</span>
                <span></span>
              </div>
              <div className="flex justify-between border-t-4 border-black pt-1">
                <span><strong>Protein</strong> {protein}g</span>
                <strong>{proteinDV}%</strong>
              </div>
            </div>

            {/* Micronutrients */}
            <div className="text-[10px] space-y-0.5 pt-1">
              {n.calcium !== undefined && (
                <div className="flex justify-between">
                  <span>Calcium {Math.round(n.calcium * ratio)}mg</span>
                  <span>{Math.round(((n.calcium * ratio) / 1300) * 100)}%</span>
                </div>
              )}
              {n.iron !== undefined && (
                <div className="flex justify-between">
                  <span>Iron {Math.round(n.iron * ratio * 10) / 10}mg</span>
                  <span>{Math.round(((n.iron * ratio) / 18) * 100)}%</span>
                </div>
              )}
              {n.potassium !== undefined && (
                <div className="flex justify-between">
                  <span>Potassium {Math.round(n.potassium * ratio)}mg</span>
                  <span>{Math.round(((n.potassium * ratio) / 4700) * 100)}%</span>
                </div>
              )}
            </div>

            <p className="mt-2 text-[8px] text-zinc-500 border-t border-black pt-1 leading-tight">
              * The % Daily Value (DV) is based on a 2,000 calorie diet.
            </p>
          </div>

          {/* Column 2: Macro Density & Exercise Burn */}
          <div className="space-y-4">
            {/* Caloric & Macro Density */}
            <div className="border border-zinc-300 rounded-xl p-3.5 bg-zinc-50">
              <div className="text-xs font-bold uppercase tracking-wider text-black border-b border-zinc-200 pb-1 mb-2">
                Caloric Energy Breakdown
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-0.5">
                    <span>Protein ({protein}g)</span>
                    <span>{proteinCals} kcal ({proteinPct}%)</span>
                  </div>
                  <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-black h-full" style={{ width: `${proteinPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-0.5">
                    <span>Carbohydrates ({totalCarbs}g)</span>
                    <span>{carbsCals} kcal ({carbsPct}%)</span>
                  </div>
                  <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-zinc-600 h-full" style={{ width: `${carbsPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-0.5">
                    <span>Dietary Fat ({totalFat}g)</span>
                    <span>{fatCals} kcal ({fatPct}%)</span>
                  </div>
                  <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-zinc-400 h-full" style={{ width: `${fatPct}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise Burn Time */}
            <div className="border border-zinc-300 rounded-xl p-3.5 bg-zinc-50">
              <div className="text-xs font-bold uppercase tracking-wider text-black border-b border-zinc-200 pb-1 mb-2">
                Estimated Energy Burn Time
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-white border border-zinc-200">
                  <div className="text-[10px] text-zinc-500 font-bold">🚶 Walking</div>
                  <div className="font-black text-sm text-black">{walkMin}m</div>
                </div>
                <div className="p-2 rounded-lg bg-white border border-zinc-200">
                  <div className="text-[10px] text-zinc-500 font-bold">🏃 Jogging</div>
                  <div className="font-black text-sm text-black">{runMin}m</div>
                </div>
                <div className="p-2 rounded-lg bg-white border border-zinc-200">
                  <div className="text-[10px] text-zinc-500 font-bold">🚴 Cycling</div>
                  <div className="font-black text-sm text-black">{cycleMin}m</div>
                </div>
              </div>
            </div>

            {/* Verified Clinical Stamp */}
            <div className="border border-zinc-300 rounded-xl p-3 text-[10px] space-y-1 bg-white">
              <div className="font-bold flex items-center gap-1.5 text-black">
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span>USDA FoodData Central Verified</span>
              </div>
              <p className="text-zinc-600 text-[9px] leading-tight">
                Data generated by CaloriePulse using official USDA Agricultural Research Service analytical reference food codes.
              </p>
            </div>
          </div>
        </div>

        {/* Official Footer Stamp */}
        <div className="border-t border-zinc-300 mt-4 pt-3 flex items-center justify-between text-[9px] text-zinc-500 font-mono">
          <span>SOURCE: USDA FoodData Central • Clinical Nutrition Database</span>
          <span>CALORIEPULSE LABS • EXPORTED DOCUMENT</span>
        </div>
      </div>
    </>
  );
};
