'use client';

import React, { useState } from 'react';
import { getAllFoods } from '@/data/foodDatabase';
import { FoodItem, MealType } from '@/types/food';
import { addMealEntry } from '@/lib/storage';
import { Flame, Zap, Activity, Sliders, Check, Plus, ArrowUpRight, Radio, ShieldCheck, Gauge } from 'lucide-react';
import Link from 'next/link';

export const MetabolicTerminalHero: React.FC = () => {
  const allFoods = getAllFoods();
  const samplePicks = [
    allFoods.find((f) => f.slug === 'grilled-chicken-breast') || allFoods[0],
    allFoods.find((f) => f.slug === 'grilled-salmon-fillet') || allFoods[6],
    allFoods.find((f) => f.slug === 'avocado-fresh') || allFoods[20],
    allFoods.find((f) => f.slug === 'rolled-oats-dry') || allFoods[29],
    allFoods.find((f) => f.slug === 'ribeye-steak-cooked') || allFoods[3],
    allFoods.find((f) => f.slug === 'mcdonalds-big-mac') || allFoods[36],
  ];

  const [activeFood, setActiveFood] = useState<FoodItem>(samplePicks[0]);
  const [weightGrams, setWeightGrams] = useState<number>(175);
  const [added, setAdded] = useState<boolean>(false);

  const ratio = weightGrams / 100;
  const n = activeFood.nutrientsPer100g;

  const calories = Math.round(n.calories * ratio);
  const protein = Math.round(n.protein * ratio * 10) / 10;
  const carbs = Math.round(n.carbohydrates * ratio * 10) / 10;
  const fat = Math.round(n.fat * ratio * 10) / 10;

  // Macro Energy Ratios
  const pCal = protein * 4;
  const cCal = carbs * 4;
  const fCal = fat * 9;
  const totalCal = pCal + cCal + fCal || 1;

  const pPct = Math.round((pCal / totalCal) * 100);
  const cPct = Math.round((cCal / totalCal) * 100);
  const fPct = Math.max(0, 100 - pPct - cPct);

  // Metabolic metrics
  const runMinutes = Math.max(1, Math.round(calories / 11.5));
  const walkMinutes = Math.max(1, Math.round(calories / 4.8));
  const isHighProtein = pPct >= 35;
  const satietyRank = isHighProtein ? '99.4%' : calories <= 70 ? '94.2%' : '88.0%';
  const glycemicResponse = carbs <= 5 ? 'Zero Spike' : carbs <= 20 ? 'Slow Release' : 'Fast Glycogen';

  const handleQuickInject = (mealType: MealType) => {
    addMealEntry({
      foodId: activeFood.id,
      name: activeFood.name,
      emoji: activeFood.emoji,
      mealType,
      servingLabel: `${weightGrams}g Portion`,
      weightGrams,
      calories,
      protein,
      carbs,
      fat,
      fiber: Math.round((n.fiber || 0) * ratio * 10) / 10,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-12 hardware-chassis rounded-[32px] p-6 sm:p-10 relative overflow-hidden border border-white/15 shadow-2xl">
      {/* Top Telemetry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#00f59b] animate-pulse shadow-[0_0_12px_#00f59b]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#00f59b] font-bold">
            [ METABOLIC CALIBRATION DECK // V2.6 ]
          </span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="text-xs font-mono text-zinc-400 hidden sm:inline">LIVE USDA ATWATER SYNTHESIS</span>
        </div>

        {/* Food Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {samplePicks.map((food) => (
            <button
              key={food.id}
              onClick={() => {
                setActiveFood(food);
                const def = food.servings.find((s) => s.isDefault) || food.servings[0];
                setWeightGrams(def ? def.weightGrams : 100);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeFood.id === food.id
                  ? 'bg-[#00f59b] text-black font-black shadow-[0_0_15px_rgba(0,245,155,0.4)]'
                  : 'bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              <span>{food.emoji}</span>
              <span>{food.name.split('(')[0].trim()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Instrument Core */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-center">
        {/* Module 1: The Bio-Core Calorie Dial */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-3xl bg-black/40 border border-white/10 relative scanlines">
          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-1.5 font-bold">
            <Radio className="w-3.5 h-3.5 text-[#00f59b]" /> Caloric Frequency
          </div>

          {/* Radial HUD Display */}
          <div className="relative w-48 h-48 my-2 flex items-center justify-center">
            {/* Outer Tachometer Ring */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-white/5"
                strokeWidth="6"
                stroke="currentColor"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-[#00f59b] transition-all duration-300"
                strokeWidth="6"
                strokeDasharray="264"
                strokeDashoffset={264 - (Math.min(calories, 1000) / 1000) * 264}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
              />
            </svg>

            {/* Centered LED Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-black text-white tracking-tighter font-mono neon-mint">
                {calories}
              </span>
              <span className="text-[11px] font-mono font-bold text-[#00f59b] uppercase tracking-widest mt-1">
                KILOCALORIES
              </span>
            </div>
          </div>

          {/* Gram Scrubber Slider */}
          <div className="w-full mt-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-400">Scale Weight:</span>
              <span className="text-white font-bold text-sm bg-white/10 px-2 py-0.5 rounded-md">
                {weightGrams} <span className="text-[#00f59b]">g</span>
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="500"
              step="5"
              value={weightGrams}
              onChange={(e) => setWeightGrams(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>20g (Taste)</span>
              <span>150g (Standard)</span>
              <span>500g (Feast)</span>
            </div>
          </div>
        </div>

        {/* Module 2: The Macro Triple-Helix Fluid Chambers */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-black/40 border border-white/10 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#00f0ff] font-bold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> Macronutrient Hydro-Columns
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Total Bio-Density</span>
          </div>

          {/* 3 Vertical Liquid Tubes */}
          <div className="grid grid-cols-3 gap-4 my-2">
            {/* Protein Chamber */}
            <div className="flex flex-col items-center">
              <div className="w-full h-44 bg-[#0a101d] rounded-2xl p-1 border border-cyan-500/30 relative flex flex-col justify-end overflow-hidden shadow-[inset_0_0_15px_rgba(0,240,255,0.15)]">
                <div
                  style={{ height: `${Math.min(100, Math.max(12, pPct))}%` }}
                  className="w-full bg-gradient-to-t from-cyan-600 via-cyan-400 to-[#00f0ff] rounded-xl transition-all duration-500 relative flex items-start justify-center pt-2 shadow-[0_0_20px_rgba(0,240,255,0.5)]"
                >
                  <span className="text-[10px] font-mono font-black text-black">
                    {pPct}%
                  </span>
                </div>
              </div>
              <div className="mt-2.5 text-center">
                <span className="block text-[10px] font-mono uppercase text-cyan-400 font-bold">PROTEIN</span>
                <span className="text-xl font-black text-white font-mono">{protein}g</span>
              </div>
            </div>

            {/* Carbs Chamber */}
            <div className="flex flex-col items-center">
              <div className="w-full h-44 bg-[#141108] rounded-2xl p-1 border border-amber-500/30 relative flex flex-col justify-end overflow-hidden shadow-[inset_0_0_15px_rgba(255,184,0,0.15)]">
                <div
                  style={{ height: `${Math.min(100, Math.max(12, cPct))}%` }}
                  className="w-full bg-gradient-to-t from-amber-600 via-amber-400 to-[#ffb800] rounded-xl transition-all duration-500 relative flex items-start justify-center pt-2 shadow-[0_0_20px_rgba(255,184,0,0.5)]"
                >
                  <span className="text-[10px] font-mono font-black text-black">
                    {cPct}%
                  </span>
                </div>
              </div>
              <div className="mt-2.5 text-center">
                <span className="block text-[10px] font-mono uppercase text-amber-400 font-bold">CARBS</span>
                <span className="text-xl font-black text-white font-mono">{carbs}g</span>
              </div>
            </div>

            {/* Fat Chamber */}
            <div className="flex flex-col items-center">
              <div className="w-full h-44 bg-[#160910] rounded-2xl p-1 border border-rose-500/30 relative flex flex-col justify-end overflow-hidden shadow-[inset_0_0_15px_rgba(255,45,85,0.15)]">
                <div
                  style={{ height: `${Math.min(100, Math.max(12, fPct))}%` }}
                  className="w-full bg-gradient-to-t from-rose-600 via-rose-400 to-[#ff2d55] rounded-xl transition-all duration-500 relative flex items-start justify-center pt-2 shadow-[0_0_20px_rgba(255,45,85,0.5)]"
                >
                  <span className="text-[10px] font-mono font-black text-black">
                    {fPct}%
                  </span>
                </div>
              </div>
              <div className="mt-2.5 text-center">
                <span className="block text-[10px] font-mono uppercase text-rose-400 font-bold">LIPIDS (FAT)</span>
                <span className="text-xl font-black text-white font-mono">{fat}g</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-zinc-400 flex justify-between">
            <span>Metabolic Ratio</span>
            <span className="text-white font-bold">{protein}P / {carbs}C / {fat}F</span>
          </div>
        </div>

        {/* Module 3: Metabolic Velocity & Bio-Injection */}
        <div className="lg:col-span-3 space-y-3">
          {/* Burn Velocity */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" /> Kinetic Burn Velocity
            </span>
            <div className="flex items-baseline justify-between pt-1">
              <div className="text-2xl font-black text-white font-mono">
                {runMinutes} <span className="text-xs text-orange-400 font-normal">min run</span>
              </div>
              <span className="text-xs text-zinc-400 font-mono">or {walkMinutes}m walk</span>
            </div>
          </div>

          {/* Satiety Index */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00f59b]" /> Satiety & Satiation
            </span>
            <div className="flex items-baseline justify-between pt-1">
              <div className="text-2xl font-black text-[#00f59b] font-mono">
                {satietyRank}
              </div>
              <span className="text-[10px] font-mono text-zinc-400">{glycemicResponse}</span>
            </div>
          </div>

          {/* 1-Click Inject Button */}
          <div className="pt-2">
            <button
              onClick={() => handleQuickInject('lunch')}
              className={`w-full py-3.5 rounded-2xl text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl ${
                added
                  ? 'bg-[#00f59b] text-black shadow-[0_0_20px_#00f59b]'
                  : 'bg-gradient-to-r from-[#00f59b] via-teal-400 to-[#00f0ff] hover:opacity-95 text-black'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" /> INJECTED INTO BIO-LOG
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> INJECT {weightGrams}G TO MEAL LOG
                </>
              )}
            </button>

            <Link
              href={`/food/${activeFood.slug}`}
              className="w-full mt-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/5"
            >
              Open Complete Biometric Sheet <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
