'use client';

import React, { useState } from 'react';
import { Flame, Percent, Activity, Scale, Sliders, Check, ArrowRight, Award, Sparkles } from 'lucide-react';
import { saveDailyTargets } from '@/lib/storage';
import { InteractiveTilt } from './InteractiveTilt';
import { MacroOrbital3D } from './MacroOrbital3D';

type UnitSystem = 'imperial' | 'metric';
type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'heavy' | 'athlete';
type CalorieGoal = 'cut_fast' | 'cut_mod' | 'maintain' | 'bulk_lean';

export const NutritionCalculators: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calories' | 'bodyfat'>('calories');

  // --- Calorie / TDEE Calculator State ---
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState<number>(28);
  // Imperial
  const [weightLbs, setWeightLbs] = useState<number>(175);
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(10);
  // Metric
  const [weightKg, setWeightKg] = useState<number>(79.5);
  const [heightCm, setHeightCm] = useState<number>(178);

  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<CalorieGoal>('cut_mod');
  const [appliedTargets, setAppliedTargets] = useState<boolean>(false);

  // --- Body Fat Calculator State (US Navy Method) ---
  const [neckInches, setNeckInches] = useState<number>(15.5);
  const [waistInches, setWaistInches] = useState<number>(33.5);
  const [hipInches, setHipInches] = useState<number>(38.0); // For females
  const [neckCm, setNeckCm] = useState<number>(39.5);
  const [waistCm, setWaistCm] = useState<number>(85.0);
  const [hipCm, setHipCm] = useState<number>(96.5);

  // ==========================================
  // Calculations: Calorie & TDEE (Mifflin-St Jeor)
  // ==========================================
  const currentWeightKg = unit === 'imperial' ? weightLbs * 0.453592 : weightKg;
  const currentHeightCm = unit === 'imperial' ? (heightFeet * 12 + heightInches) * 2.54 : heightCm;

  // BMR
  let bmr =
    gender === 'male'
      ? 10 * currentWeightKg + 6.25 * currentHeightCm - 5 * age + 5
      : 10 * currentWeightKg + 6.25 * currentHeightCm - 5 * age - 161;

  const activityMultipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    heavy: 1.725,
    athlete: 1.9,
  };

  const tdee = Math.round(bmr * activityMultipliers[activity]);

  const goalAdjustments: Record<CalorieGoal, { cal: number; label: string; pGramsPerKg: number }> = {
    cut_fast: { cal: -500, label: 'Aggressive Cut (-500 kcal)', pGramsPerKg: 2.2 },
    cut_mod: { cal: -300, label: 'Moderate Fat Loss (-300 kcal)', pGramsPerKg: 2.0 },
    maintain: { cal: 0, label: 'Weight Maintenance (0 kcal)', pGramsPerKg: 1.8 },
    bulk_lean: { cal: 300, label: 'Lean Muscle Surplus (+300 kcal)', pGramsPerKg: 2.0 },
  };

  const targetCalories = Math.max(1200, tdee + goalAdjustments[goal].cal);
  const targetProtein = Math.round(currentWeightKg * goalAdjustments[goal].pGramsPerKg);
  const targetFat = Math.round((targetCalories * 0.25) / 9);
  const remainingCalForCarbs = Math.max(0, targetCalories - targetProtein * 4 - targetFat * 9);
  const targetCarbs = Math.round(remainingCalForCarbs / 4);

  const handleApplyToJournal = () => {
    saveDailyTargets({
      calories: targetCalories,
      protein: targetProtein,
      carbs: targetCarbs,
      fat: targetFat,
    });
    setAppliedTargets(true);
    setTimeout(() => setAppliedTargets(false), 2000);
  };

  // ==========================================
  // Calculations: US Navy Body Fat %
  // ==========================================
  const curNeckCm = unit === 'imperial' ? neckInches * 2.54 : neckCm;
  const curWaistCm = unit === 'imperial' ? waistInches * 2.54 : waistCm;
  const curHipCm = unit === 'imperial' ? hipInches * 2.54 : hipCm;

  let bodyFatPct = 0;
  if (gender === 'male') {
    // Male formula: 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
    const diff = curWaistCm - curNeckCm;
    if (diff > 0 && currentHeightCm > 0) {
      bodyFatPct = 495 / (1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(currentHeightCm)) - 450;
    }
  } else {
    // Female formula: 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
    const diff = curWaistCm + curHipCm - curNeckCm;
    if (diff > 0 && currentHeightCm > 0) {
      bodyFatPct = 495 / (1.29579 - 0.35004 * Math.log10(diff) + 0.221 * Math.log10(currentHeightCm)) - 450;
    }
  }

  bodyFatPct = Math.min(50, Math.max(3, Math.round(bodyFatPct * 10) / 10));

  const totalWeightKgVal = currentWeightKg;
  const fatMassKg = (totalWeightKgVal * (bodyFatPct / 100)).toFixed(1);
  const leanMassKg = (totalWeightKgVal - parseFloat(fatMassKg)).toFixed(1);

  const getFatCategory = (bf: number, g: Gender) => {
    if (g === 'male') {
      if (bf < 6) return { label: 'Essential Fat', color: 'text-amber-600', bg: 'bg-amber-50' };
      if (bf <= 13) return { label: 'Athletic / Lean', color: 'text-[#3B5842]', bg: 'bg-[#EBF2EC]' };
      if (bf <= 17) return { label: 'Fitness / Optimal', color: 'text-[#3B5842]', bg: 'bg-[#EBF2EC]' };
      if (bf <= 24) return { label: 'Average / Healthy', color: 'text-[#C9822B]', bg: 'bg-[#FBF4E8]' };
      return { label: 'Overfat / Bulking', color: 'text-[#C4552D]', bg: 'bg-[#F8EFEA]' };
    } else {
      if (bf < 14) return { label: 'Essential Fat', color: 'text-amber-600', bg: 'bg-amber-50' };
      if (bf <= 20) return { label: 'Athletic / Lean', color: 'text-[#3B5842]', bg: 'bg-[#EBF2EC]' };
      if (bf <= 24) return { label: 'Fitness / Optimal', color: 'text-[#3B5842]', bg: 'bg-[#EBF2EC]' };
      if (bf <= 31) return { label: 'Average / Healthy', color: 'text-[#C9822B]', bg: 'bg-[#FBF4E8]' };
      return { label: 'Overfat / Bulking', color: 'text-[#C4552D]', bg: 'bg-[#F8EFEA]' };
    }
  };

  const fatCat = getFatCategory(bodyFatPct, gender);

  return (
    <div id="calculators" className="editorial-card rounded-3xl p-6 sm:p-10 relative overflow-hidden text-left font-sans shadow-md">
      {/* Masthead Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EAE3D9]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#C4552D]" />
            <span className="text-[11px] font-sans font-bold tracking-widest text-[#C4552D] uppercase">
              Clinical Telemetry Studio
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513]">
            Energy Expenditure &amp; Body Fat Calculators
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9]">
          <button
            onClick={() => setActiveTab('calories')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'calories'
                ? 'bg-[#181513] text-white shadow-xs'
                : 'text-[#786C62] hover:text-[#181513]'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#C4552D]" />
            <span>TDEE &amp; Calorie Budget</span>
          </button>
          <button
            onClick={() => setActiveTab('bodyfat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'bodyfat'
                ? 'bg-[#181513] text-white shadow-xs'
                : 'text-[#786C62] hover:text-[#181513]'
            }`}
          >
            <Percent className="w-3.5 h-3.5 text-[#3B5842]" />
            <span>US Navy Body Fat %</span>
          </button>
        </div>
      </div>

      {/* Calculator Body */}
      <div className="pt-8">
        {/* ========================================== */}
        {/* TAB 1: CALORIES & TDEE CALCULATOR */}
        {/* ========================================== */}
        {activeTab === 'calories' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Inputs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Units & Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#786C62] uppercase tracking-wider block mb-1.5">
                    Measurement Units
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl">
                    <button
                      type="button"
                      onClick={() => setUnit('imperial')}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        unit === 'imperial' ? 'bg-white text-[#181513] shadow-2xs' : 'text-[#786C62]'
                      }`}
                    >
                      US (lbs, ft)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnit('metric')}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        unit === 'metric' ? 'bg-white text-[#181513] shadow-2xs' : 'text-[#786C62]'
                      }`}
                    >
                      Metric (kg, cm)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#786C62] uppercase tracking-wider block mb-1.5">
                    Biological Sex
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        gender === 'male' ? 'bg-white text-[#181513] shadow-2xs' : 'text-[#786C62]'
                      }`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        gender === 'female' ? 'bg-white text-[#181513] shadow-2xs' : 'text-[#786C62]'
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>
              </div>

              {/* Age, Weight, Height */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#786C62] block mb-1.5">Age (Years)</label>
                  <input
                    type="number"
                    min="14"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-sm font-bold text-[#181513] outline-none focus:border-[#C4552D]"
                  />
                </div>

                {unit === 'imperial' ? (
                  <>
                    <div>
                      <label className="text-xs font-bold text-[#786C62] block mb-1.5">Weight (lbs)</label>
                      <input
                        type="number"
                        min="60"
                        max="500"
                        value={weightLbs}
                        onChange={(e) => setWeightLbs(Number(e.target.value))}
                        className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-sm font-bold text-[#181513] outline-none focus:border-[#C4552D]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#786C62] block mb-1.5">Height (ft &amp; in)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min="4"
                          max="7"
                          value={heightFeet}
                          onChange={(e) => setHeightFeet(Number(e.target.value))}
                          placeholder="ft"
                          className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-sm font-bold text-[#181513] outline-none focus:border-[#C4552D]"
                        />
                        <input
                          type="number"
                          min="0"
                          max="11"
                          value={heightInches}
                          onChange={(e) => setHeightInches(Number(e.target.value))}
                          placeholder="in"
                          className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-sm font-bold text-[#181513] outline-none focus:border-[#C4552D]"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-xs font-bold text-[#786C62] block mb-1.5">Weight (kg)</label>
                      <input
                        type="number"
                        min="30"
                        max="250"
                        value={weightKg}
                        onChange={(e) => setWeightKg(Number(e.target.value))}
                        className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-sm font-bold text-[#181513] outline-none focus:border-[#C4552D]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#786C62] block mb-1.5">Height (cm)</label>
                      <input
                        type="number"
                        min="100"
                        max="230"
                        value={heightCm}
                        onChange={(e) => setHeightCm(Number(e.target.value))}
                        className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-sm font-bold text-[#181513] outline-none focus:border-[#C4552D]"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Physical Activity Level */}
              <div>
                <label className="text-xs font-bold text-[#786C62] uppercase tracking-wider block mb-1.5">
                  Weekly Activity Multiplier
                </label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value as ActivityLevel)}
                  className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-xs font-bold text-[#181513] outline-none focus:border-[#C4552D] cursor-pointer"
                >
                  <option value="sedentary">🛋️ Sedentary (Desk Job, Minimal Exercise) — 1.2x</option>
                  <option value="light">🚶 Lightly Active (1-3 Workout Days / Week) — 1.375x</option>
                  <option value="moderate">🏃 Moderately Active (3-5 Intense Workout Days) — 1.55x</option>
                  <option value="heavy">🏋️ Very Active (6-7 Heavy Lift Sessions / Week) — 1.725x</option>
                  <option value="athlete">⚡ Competitive Athlete / Physical Labor (2x / Day) — 1.9x</option>
                </select>
              </div>

              {/* Nutritional Strategy Goal */}
              <div>
                <label className="text-xs font-bold text-[#786C62] uppercase tracking-wider block mb-1.5">
                  Target Dietary Objective
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['cut_fast', 'cut_mod', 'maintain', 'bulk_lean'] as CalorieGoal[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGoal(g)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        goal === g
                          ? 'border-[#C4552D] bg-[#FDF2EE] text-[#C4552D] font-bold shadow-2xs ring-1 ring-[#C4552D]'
                          : 'border-[#EAE3D9] bg-[#FAF8F5] text-[#786C62] hover:border-[#C4552D] hover:text-[#181513]'
                      }`}
                    >
                      <div className="text-xs font-bold leading-tight">
                        {g === 'cut_fast'
                          ? '🔥 Fast Cut'
                          : g === 'cut_mod'
                          ? '🏃 Moderate Cut'
                          : g === 'maintain'
                          ? '⚖️ Maintain'
                          : '🏋️ Lean Bulk'}
                      </div>
                      <div className="text-[10px] mt-0.5 opacity-80">
                        {goalAdjustments[g].cal > 0 ? `+${goalAdjustments[g].cal}` : goalAdjustments[g].cal} kcal
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Telemetry Readout */}
            <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#EAE3D9] rounded-2xl p-6 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-[#786C62] font-bold block">
                    Daily Caloric Target
                  </span>
                  <span className="text-[10px] font-sans font-bold text-[#C4552D] uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Live 3D Orbit
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 mt-2">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-serif font-bold text-[#181513]">
                        {targetCalories}
                      </span>
                      <span className="text-sm font-bold text-[#C4552D]">kcal / day</span>
                    </div>
                    <div className="text-xs text-[#786C62] mt-1 flex items-center gap-2">
                      <span>BMR: <strong>{Math.round(bmr)}</strong></span>
                      <span>•</span>
                      <span>TDEE: <strong>{tdee}</strong></span>
                    </div>
                  </div>

                  {/* 3D Orbit Visualization */}
                  <div className="shrink-0 -my-3">
                    <MacroOrbital3D
                      calories={targetCalories}
                      protein={targetProtein}
                      carbs={targetCarbs}
                      fat={targetFat}
                      size={130}
                    />
                  </div>
                </div>
              </div>

              {/* Recommended Macro Targets */}
              <div className="space-y-2">
                <span className="text-[10px] font-sans uppercase tracking-wider text-[#786C62] font-bold block">
                  Recommended Daily Macros
                </span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-white border border-[#EAE3D9]">
                    <span className="text-[10px] font-bold text-[#3B5842] uppercase block">Protein</span>
                    <span className="text-lg font-serif font-bold text-[#181513]">{targetProtein}g</span>
                    <span className="text-[9px] text-[#786C62] block">{Math.round((targetProtein * 4 * 100) / targetCalories)}% cal</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#EAE3D9]">
                    <span className="text-[10px] font-bold text-[#C9822B] uppercase block">Carbs</span>
                    <span className="text-lg font-serif font-bold text-[#181513]">{targetCarbs}g</span>
                    <span className="text-[9px] text-[#786C62] block">{Math.round((targetCarbs * 4 * 100) / targetCalories)}% cal</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#EAE3D9]">
                    <span className="text-[10px] font-bold text-[#C4552D] uppercase block">Lipids</span>
                    <span className="text-lg font-serif font-bold text-[#181513]">{targetFat}g</span>
                    <span className="text-[9px] text-[#786C62] block">{Math.round((targetFat * 9 * 100) / targetCalories)}% cal</span>
                  </div>
                </div>
              </div>

              {/* 1-Click Sync to Meal Journal */}
              <button
                onClick={handleApplyToJournal}
                className="w-full py-3 rounded-xl bg-[#C4552D] hover:bg-[#A03E1B] text-white font-sans font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
              >
                {appliedTargets ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Applied to Daily Journal!</span>
                  </>
                ) : (
                  <>
                    <Sliders className="w-4 h-4" />
                    <span>Set as My Daily Goal in Journal</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* ========================================== */
          /* TAB 2: US NAVY BODY FAT CALCULATOR */
          /* ========================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Inputs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Unit & Gender Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#786C62] uppercase tracking-wider block mb-1.5">
                    Measurement Units
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl">
                    <button
                      type="button"
                      onClick={() => setUnit('imperial')}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        unit === 'imperial' ? 'bg-white text-[#181513] shadow-2xs' : 'text-[#786C62]'
                      }`}
                    >
                      Inches (in)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnit('metric')}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        unit === 'metric' ? 'bg-white text-[#181513] shadow-2xs' : 'text-[#786C62]'
                      }`}
                    >
                      Centimeters (cm)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#786C62] uppercase tracking-wider block mb-1.5">
                    Biological Sex
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        gender === 'male' ? 'bg-white text-[#181513] shadow-2xs' : 'text-[#786C62]'
                      }`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        gender === 'female' ? 'bg-white text-[#181513] shadow-2xs' : 'text-[#786C62]'
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>
              </div>

              {/* Tape Measurements */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#786C62] block mb-1.5">
                    Neck Circumference ({unit === 'imperial' ? 'in' : 'cm'})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={unit === 'imperial' ? neckInches : neckCm}
                    onChange={(e) =>
                      unit === 'imperial'
                        ? setNeckInches(Number(e.target.value))
                        : setNeckCm(Number(e.target.value))
                    }
                    className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-sm font-bold text-[#181513] outline-none focus:border-[#3B5842]"
                  />
                  <span className="text-[10px] text-[#786C62] mt-1 block">Measure below larynx</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#786C62] block mb-1.5">
                    Waist at Navel ({unit === 'imperial' ? 'in' : 'cm'})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={unit === 'imperial' ? waistInches : waistCm}
                    onChange={(e) =>
                      unit === 'imperial'
                        ? setWaistInches(Number(e.target.value))
                        : setWaistCm(Number(e.target.value))
                    }
                    className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-sm font-bold text-[#181513] outline-none focus:border-[#3B5842]"
                  />
                  <span className="text-[10px] text-[#786C62] mt-1 block">Measure horizontally at belly button</span>
                </div>

                {gender === 'female' ? (
                  <div>
                    <label className="text-xs font-bold text-[#786C62] block mb-1.5">
                      Hip Circumference ({unit === 'imperial' ? 'in' : 'cm'})
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={unit === 'imperial' ? hipInches : hipCm}
                      onChange={(e) =>
                        unit === 'imperial'
                          ? setHipInches(Number(e.target.value))
                          : setHipCm(Number(e.target.value))
                      }
                      className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-sm font-bold text-[#181513] outline-none focus:border-[#3B5842]"
                    />
                    <span className="text-[10px] text-[#786C62] mt-1 block">Widest gluteal point</span>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-[#786C62] block mb-1.5">Height ({unit === 'imperial' ? 'ft/in' : 'cm'})</label>
                    <input
                      type="number"
                      value={unit === 'imperial' ? heightFeet * 12 + heightInches : heightCm}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (unit === 'imperial') {
                          setHeightFeet(Math.floor(v / 12));
                          setHeightInches(v % 12);
                        } else {
                          setHeightCm(v);
                        }
                      }}
                      className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-sm font-bold text-[#181513] outline-none focus:border-[#3B5842]"
                    />
                    <span className="text-[10px] text-[#786C62] mt-1 block">Total standing height</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Readout */}
            <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#EAE3D9] rounded-2xl p-6 space-y-6">
              <div>
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#786C62] font-bold block mb-1">
                  US Navy Body Fat Estimate
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-serif font-bold text-[#181513]">
                    {bodyFatPct}%
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${fatCat.bg} ${fatCat.color}`}>
                    {fatCat.label}
                  </span>
                </div>
              </div>

              {/* Composition Breakdown */}
              <div className="space-y-2">
                <span className="text-[10px] font-sans uppercase tracking-wider text-[#786C62] font-bold block">
                  Body Composition Breakdown
                </span>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-white border border-[#EAE3D9]">
                    <span className="text-[10px] font-bold text-[#3B5842] uppercase block">Lean Mass</span>
                    <span className="text-lg font-serif font-bold text-[#181513]">
                      {unit === 'imperial' ? (parseFloat(leanMassKg) * 2.20462).toFixed(1) : leanMassKg}
                    </span>
                    <span className="text-[9px] text-[#786C62] block">{unit === 'imperial' ? 'lbs LBM' : 'kg LBM'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#EAE3D9]">
                    <span className="text-[10px] font-bold text-[#C4552D] uppercase block">Fat Mass</span>
                    <span className="text-lg font-serif font-bold text-[#181513]">
                      {unit === 'imperial' ? (parseFloat(fatMassKg) * 2.20462).toFixed(1) : fatMassKg}
                    </span>
                    <span className="text-[9px] text-[#786C62] block">{unit === 'imperial' ? 'lbs Fat' : 'kg Fat'}</span>
                  </div>
                </div>
              </div>

              {/* Visual Body Fat Gauge Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-[#786C62]">
                  <span>Lean (6-13%)</span>
                  <span>Fitness (14-17%)</span>
                  <span>Average (18-24%)</span>
                </div>
                <div className="w-full bg-[#EAE3D9] h-3 rounded-full overflow-hidden relative">
                  <div
                    style={{ width: `${Math.min(100, Math.max(5, (bodyFatPct / 35) * 100))}%` }}
                    className="bg-[#3B5842] h-full rounded-full transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
