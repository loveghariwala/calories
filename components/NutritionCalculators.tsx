'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Flame,
  Percent,
  Activity,
  Scale,
  Sliders,
  Check,
  ArrowRight,
  Award,
  Sparkles,
  Calendar,
  PieChart,
  Target,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Zap,
  Info,
  Layers,
  CheckCircle2,
  Heart,
  Dumbbell,
} from 'lucide-react';
import { saveDailyTargets } from '@/lib/storage';
import { AnimatedNumber } from './AnimatedNumber';
import { MacroOrbital3D } from './MacroOrbital3D';

// --- Type Definitions ---
export type UnitSystem = 'imperial' | 'metric';
export type Gender = 'male' | 'female';
export type EnergyUnit = 'kcal' | 'kj';
export type FormulaType = 'mifflin' | 'harris' | 'katch';

export type ActivityLevel =
  | 'bmr'
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very_active'
  | 'extra_active';

export type ResultTierKey =
  | 'maintain'
  | 'loss_mild'
  | 'loss_mod'
  | 'loss_extreme'
  | 'gain_mild'
  | 'gain_mod'
  | 'gain_fast';

export type MacroDietType = 'balanced' | 'high_protein' | 'low_carb' | 'low_fat' | 'custom';
export type ZigZagType = 'weekend_refeed' | 'alternating_wave';

export type FrameSize = 'small' | 'medium' | 'large';

export const NutritionCalculators: React.FC = () => {
  // Main Top-Level Tab (3 Suites)
  const [activeMainTab, setActiveMainTab] = useState<'calories' | 'bodyfat' | 'idealweight'>('calories');

  // Sub-tab under Calorie Results
  const [resultSubTab, setResultSubTab] = useState<'overview' | 'zigzag' | 'macros' | 'target_date'>('overview');

  // --- General Form Inputs (allow string/number for unrestricted typing) ---
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState<number | string>(25);
  const [energyUnit, setEnergyUnit] = useState<EnergyUnit>('kcal');
  const [formula, setFormula] = useState<FormulaType>('mifflin');
  const [bodyFatInput, setBodyFatInput] = useState<number | string>(18);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Imperial Inputs
  const [weightLbs, setWeightLbs] = useState<number | string>(165);
  const [heightFeet, setHeightFeet] = useState<number | string>(5);
  const [heightInches, setHeightInches] = useState<number | string>(10);

  // Metric Inputs
  const [weightKg, setWeightKg] = useState<number | string>(75);
  const [heightCm, setHeightCm] = useState<number | string>(178);

  // Activity & Selected Tier
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [selectedTier, setSelectedTier] = useState<ResultTierKey>('loss_mod');
  const [appliedTargets, setAppliedTargets] = useState<boolean>(false);

  // --- ZigZag Calorie Cycling State ---
  const [zigzagType, setZigzagType] = useState<ZigZagType>('weekend_refeed');

  // --- Macronutrient State ---
  const [macroDiet, setMacroDiet] = useState<MacroDietType>('balanced');
  const [customProteinPct, setCustomProteinPct] = useState<number>(30);
  const [customCarbsPct, setCustomCarbsPct] = useState<number>(40);
  const [customFatPct, setCustomFatPct] = useState<number>(30);

  // --- Target Date Forecaster State ---
  const [targetWeight, setTargetWeight] = useState<number | string>(155);
  const [targetWeeks, setTargetWeeks] = useState<number>(12);

  // --- US Navy Body Fat Tape Inputs ---
  const [neckInches, setNeckInches] = useState<number | string>(15.5);
  const [waistInches, setWaistInches] = useState<number | string>(33.5);
  const [hipInches, setHipInches] = useState<number | string>(38.0);
  const [neckCm, setNeckCm] = useState<number | string>(39.5);
  const [waistCm, setWaistCm] = useState<number | string>(85.0);
  const [hipCm, setHipCm] = useState<number | string>(96.5);

  // --- Ideal Weight Frame Size ---
  const [frameSize, setFrameSize] = useState<FrameSize>('medium');

  // =========================================================================
  // URL Param Hydration (Matching Calculator.net URL query parameters)
  // =========================================================================
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has('cage')) setAge(Number(params.get('cage')) || 25);
      if (params.has('csex')) setGender(params.get('csex') === 'f' ? 'female' : 'male');
      if (params.has('ctype')) {
        const u = params.get('ctype');
        if (u === 'metric' || u === 'standard') setUnit(u === 'metric' ? 'metric' : 'imperial');
      }
      if (params.has('cheightfeet')) setHeightFeet(Number(params.get('cheightfeet')) || 5);
      if (params.has('cheightinch')) setHeightInches(Number(params.get('cheightinch')) || 10);
      if (params.has('cpound')) setWeightLbs(Number(params.get('cpound')) || 165);
      if (params.has('cheightmeter')) {
        const mVal = Number(params.get('cheightmeter'));
        if (mVal > 50) setHeightCm(mVal);
        else if (mVal > 0) setHeightCm(Math.round(mVal * 100));
      }
      if (params.has('ckg')) setWeightKg(Number(params.get('ckg')) || 75);
      if (params.has('coutunit')) setEnergyUnit(params.get('coutunit') === 'j' ? 'kj' : 'kcal');
      if (params.has('cfatpct')) setBodyFatInput(Number(params.get('cfatpct')) || 18);
      if (params.has('cformula')) {
        const f = params.get('cformula');
        if (f === 'm' || f === 'mifflin') setFormula('mifflin');
        else if (f === 'h' || f === 'harris') setFormula('harris');
        else if (f === 'k' || f === 'katch') setFormula('katch');
      }
      if (params.has('cactivity')) {
        const actVal = params.get('cactivity');
        if (actVal === '1' || actVal === '1.0') setActivity('bmr');
        else if (actVal === '1.2') setActivity('sedentary');
        else if (actVal === '1.375') setActivity('light');
        else if (actVal === '1.465' || actVal === '1.55') setActivity('moderate');
        else if (actVal === '1.725') setActivity('very_active');
        else if (actVal === '1.9' || actVal === '2.0' || actVal === '2') setActivity('extra_active');
      }
    } catch (e) {
      console.warn('URL params parsing notice:', e);
    }
  }, []);

  // Update URL Search Params dynamically on change for bookmarking / sharing
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      if (age !== '') url.searchParams.set('cage', String(age));
      url.searchParams.set('csex', gender === 'male' ? 'm' : 'f');
      url.searchParams.set('ctype', unit);
      if (unit === 'imperial') {
        if (heightFeet !== '') url.searchParams.set('cheightfeet', String(heightFeet));
        if (heightInches !== '') url.searchParams.set('cheightinch', String(heightInches));
        if (weightLbs !== '') url.searchParams.set('cpound', String(weightLbs));
      } else {
        if (heightCm !== '') url.searchParams.set('cheightmeter', String(heightCm));
        if (weightKg !== '') url.searchParams.set('ckg', String(weightKg));
      }
      url.searchParams.set('cformula', formula);
      if (bodyFatInput !== '') url.searchParams.set('cfatpct', String(bodyFatInput));
      url.searchParams.set('coutunit', energyUnit === 'kj' ? 'j' : 'c');
      window.history.replaceState({}, '', url.toString());
    } catch {}
  }, [age, gender, unit, heightFeet, heightInches, weightLbs, heightCm, weightKg, formula, bodyFatInput, energyUnit]);

  // Normalize numeric values for calculations
  const numAge = Number(age) || 25;
  const numWeightLbs = Number(weightLbs) || 165;
  const numHeightFeet = Number(heightFeet) || 5;
  const numHeightInches = Number(heightInches) || 0;
  const numWeightKg = Number(weightKg) || 75;
  const numHeightCm = Number(heightCm) || 178;
  const numBodyFat = Number(bodyFatInput) || 18;
  const numTargetWeight = Number(targetWeight) || (unit === 'imperial' ? 155 : 70);

  const currentWeightKg = unit === 'imperial' ? numWeightLbs * 0.453592 : numWeightKg;
  const currentHeightCm = unit === 'imperial' ? (numHeightFeet * 12 + numHeightInches) * 2.54 : numHeightCm;
  const currentHeightInchesTotal = unit === 'imperial' ? numHeightFeet * 12 + numHeightInches : numHeightCm / 2.54;

  // =========================================================================
  // 1. TDEE & BMR CALCULATIONS (Calculator.net exact constants)
  // =========================================================================
  const bmr = useMemo(() => {
    const W = currentWeightKg;
    const H = currentHeightCm;
    const A = numAge;

    if (formula === 'katch') {
      const lbmKg = W * (1 - numBodyFat / 100);
      return Math.round(370 + 21.6 * lbmKg);
    } else if (formula === 'harris') {
      if (gender === 'male') {
        return Math.round(88.362 + 13.397 * W + 4.799 * H - 5.677 * A);
      } else {
        return Math.round(447.593 + 9.247 * W + 3.098 * H - 4.330 * A);
      }
    } else {
      if (gender === 'male') {
        return Math.round(10 * W + 6.25 * H - 5 * A + 5);
      } else {
        return Math.round(10 * W + 6.25 * H - 5 * A - 161);
      }
    }
  }, [formula, currentWeightKg, currentHeightCm, numAge, gender, numBodyFat]);

  const activityMultipliers: Record<ActivityLevel, { multiplier: number; label: string; desc: string }> = {
    bmr: { multiplier: 1.0, label: 'Basal Metabolic Rate', desc: 'BMR Only (Resting Vitality)' },
    sedentary: { multiplier: 1.2, label: 'Sedentary', desc: 'Little or no exercise (Desk Job)' },
    light: { multiplier: 1.375, label: 'Light Exercise', desc: '1–3 workout sessions / week' },
    moderate: { multiplier: 1.465, label: 'Moderate Exercise', desc: '4–5 workout sessions / week' },
    active: { multiplier: 1.55, label: 'Active Lifestyle', desc: 'Daily exercise or intense 3–4 days/wk' },
    very_active: { multiplier: 1.725, label: 'Very Active', desc: 'Intense exercise 6–7 days / week' },
    extra_active: { multiplier: 1.9, label: 'Extra Active', desc: 'Very intense daily training or physical labor' },
  };

  const tdeeKcal = Math.round(bmr * activityMultipliers[activity].multiplier);

  const resultsMatrix: Record<
    ResultTierKey,
    {
      title: string;
      rateLabel: string;
      kcalOffset: number;
      pct: number;
      tag: string;
      tagBg: string;
      tagColor: string;
      isWarning?: boolean;
    }
  > = {
    maintain: {
      title: 'Maintain Current Weight',
      rateLabel: '0 kg / 0 lb per week',
      kcalOffset: 0,
      pct: 100,
      tag: '100% Maintenance',
      tagBg: 'bg-[#EBF2EC]',
      tagColor: 'text-[#3B5842]',
    },
    loss_mild: {
      title: 'Mild Weight Loss',
      rateLabel: '0.25 kg (0.5 lb) / week',
      kcalOffset: -250,
      pct: Math.round(((tdeeKcal - 250) / tdeeKcal) * 100),
      tag: 'Gentle Deficit',
      tagBg: 'bg-[#FBF4E8]',
      tagColor: 'text-[#C9822B]',
    },
    loss_mod: {
      title: 'Standard Weight Loss',
      rateLabel: '0.50 kg (1.0 lb) / week',
      kcalOffset: -500,
      pct: Math.round(((tdeeKcal - 500) / tdeeKcal) * 100),
      tag: 'Optimal Fat Loss',
      tagBg: 'bg-[#FDF2EE]',
      tagColor: 'text-[#C4552D]',
    },
    loss_extreme: {
      title: 'Extreme Weight Loss',
      rateLabel: '1.00 kg (2.0 lb) / week',
      kcalOffset: -1000,
      pct: Math.round(((tdeeKcal - 1000) / tdeeKcal) * 100),
      tag: 'Aggressive / Rapid',
      tagBg: 'bg-[#FDF2EE]',
      tagColor: 'text-[#C4552D]',
      isWarning: tdeeKcal - 1000 < (gender === 'female' ? 1200 : 1500),
    },
    gain_mild: {
      title: 'Mild Weight Gain',
      rateLabel: '0.25 kg (0.5 lb) / week',
      kcalOffset: 250,
      pct: Math.round(((tdeeKcal + 250) / tdeeKcal) * 100),
      tag: 'Lean Bulk',
      tagBg: 'bg-[#FBF4E8]',
      tagColor: 'text-[#C9822B]',
    },
    gain_mod: {
      title: 'Standard Weight Gain',
      rateLabel: '0.50 kg (1.0 lb) / week',
      kcalOffset: 500,
      pct: Math.round(((tdeeKcal + 500) / tdeeKcal) * 100),
      tag: 'Hypertrophy Surge',
      tagBg: 'bg-[#FBF4E8]',
      tagColor: 'text-[#C9822B]',
    },
    gain_fast: {
      title: 'Fast Weight Gain',
      rateLabel: '1.00 kg (2.0 lb) / week',
      kcalOffset: 1000,
      pct: Math.round(((tdeeKcal + 1000) / tdeeKcal) * 100),
      tag: 'Maximum Mass',
      tagBg: 'bg-[#FBF4E8]',
      tagColor: 'text-[#C9822B]',
    },
  };

  const activeKcalTarget = Math.max(800, tdeeKcal + resultsMatrix[selectedTier].kcalOffset);

  const formatEnergy = (kcalVal: number) => {
    if (energyUnit === 'kj') {
      return Math.round(kcalVal * 4.184);
    }
    return Math.round(kcalVal);
  };

  const energyUnitLabel = energyUnit === 'kj' ? 'kJ / day' : 'kcal / day';

  // Macronutrient Prescriptions
  const macroDistributions = useMemo(() => {
    let pPct = 25;
    let cPct = 50;
    let fPct = 25;

    if (macroDiet === 'high_protein') {
      pPct = 35;
      cPct = 40;
      fPct = 25;
    } else if (macroDiet === 'low_carb') {
      pPct = 25;
      cPct = 10;
      fPct = 65;
    } else if (macroDiet === 'low_fat') {
      pPct = 20;
      cPct = 65;
      fPct = 15;
    } else if (macroDiet === 'custom') {
      pPct = customProteinPct;
      cPct = customCarbsPct;
      fPct = customFatPct;
    }

    const proteinCalories = (activeKcalTarget * pPct) / 100;
    const carbsCalories = (activeKcalTarget * cPct) / 100;
    const fatCalories = (activeKcalTarget * fPct) / 100;

    const proteinGrams = Math.round(proteinCalories / 4);
    const carbsGrams = Math.round(carbsCalories / 4);
    const fatGrams = Math.round(fatCalories / 9);

    return {
      proteinGrams,
      carbsGrams,
      fatGrams,
      pPct,
      cPct,
      fPct,
      proteinCalories: Math.round(proteinCalories),
      carbsCalories: Math.round(carbsCalories),
      fatCalories: Math.round(fatCalories),
    };
  }, [macroDiet, customProteinPct, customCarbsPct, customFatPct, activeKcalTarget]);

  // 7-Day ZigZag Calorie Shifting Schedule
  const zigZagDays = useMemo(() => {
    const weeklyBudget = activeKcalTarget * 7;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    if (zigzagType === 'weekend_refeed') {
      const lowDay = Math.round(activeKcalTarget - 200);
      const midDay = Math.round(activeKcalTarget + 100);
      const highDay = Math.round(activeKcalTarget + 350);

      const schedule = [lowDay, lowDay, lowDay, lowDay, midDay, highDay, highDay];
      const sum = schedule.reduce((a, b) => a + b, 0);
      schedule[6] += weeklyBudget - sum;

      return days.map((day, i) => ({
        day,
        kcal: schedule[i],
        isHigh: i >= 4,
      }));
    } else {
      const high = Math.round(activeKcalTarget + 250);
      const low = Math.round(activeKcalTarget - 250);
      const schedule = [high, low, high, low, high, low, activeKcalTarget];
      const sum = schedule.reduce((a, b) => a + b, 0);
      schedule[6] += weeklyBudget - sum;

      return days.map((day, i) => ({
        day,
        kcal: schedule[i],
        isHigh: schedule[i] > activeKcalTarget,
      }));
    }
  }, [activeKcalTarget, zigzagType]);

  // Target Date Forecaster
  const targetDateResult = useMemo(() => {
    const startW = unit === 'imperial' ? numWeightLbs : numWeightKg;
    const goalW = numTargetWeight;
    const deltaW = goalW - startW;
    const deltaLbs = unit === 'imperial' ? deltaW : deltaW * 2.20462;
    const totalCalorieDiff = deltaLbs * 3500;
    const days = Math.max(7, targetWeeks * 7);
    const dailyCalorieAdjustment = Math.round(totalCalorieDiff / days);
    const requiredDailyCalories = Math.max(800, tdeeKcal + dailyCalorieAdjustment);
    const weeklyRateLbs = Math.abs(deltaLbs / targetWeeks);

    let safetyStatus: 'safe' | 'aggressive' | 'extreme' = 'safe';
    if (weeklyRateLbs > 2.0) safetyStatus = 'extreme';
    else if (weeklyRateLbs > 1.2) safetyStatus = 'aggressive';

    return {
      deltaW,
      requiredDailyCalories,
      dailyCalorieAdjustment,
      weeklyRateLbs: weeklyRateLbs.toFixed(1),
      weeklyRateKg: (weeklyRateLbs * 0.453592).toFixed(2),
      safetyStatus,
    };
  }, [unit, numWeightLbs, numWeightKg, numTargetWeight, targetWeeks, tdeeKcal]);

  // =========================================================================
  // 2. US NAVY BODY FAT % & JACKSON-POLLOCK DETAILED TELEMETRY
  // =========================================================================
  const curNeckCm = unit === 'imperial' ? (Number(neckInches) || 15.5) * 2.54 : (Number(neckCm) || 39.5);
  const curWaistCm = unit === 'imperial' ? (Number(waistInches) || 33.5) * 2.54 : (Number(waistCm) || 85);
  const curHipCm = unit === 'imperial' ? (Number(hipInches) || 38) * 2.54 : (Number(hipCm) || 96.5);

  const bodyFatResults = useMemo(() => {
    let bfpNavy = 0;
    if (gender === 'male') {
      const diff = curWaistCm - curNeckCm;
      if (diff > 0 && currentHeightCm > 0) {
        bfpNavy = 495 / (1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(currentHeightCm)) - 450;
      }
    } else {
      const diff = curWaistCm + curHipCm - curNeckCm;
      if (diff > 0 && currentHeightCm > 0) {
        bfpNavy = 495 / (1.29579 - 0.35004 * Math.log10(diff) + 0.221 * Math.log10(currentHeightCm)) - 450;
      }
    }
    bfpNavy = Math.min(55, Math.max(2, Math.round(bfpNavy * 10) / 10));

    // Body Fat Mass & Lean Mass
    const fatMassKg = (currentWeightKg * (bfpNavy / 100));
    const leanMassKg = currentWeightKg - fatMassKg;

    // BMI Method: (1.20 * BMI) + (0.23 * Age) - 16.2 (men) / - 5.4 (women)
    const bmiVal = currentWeightKg / Math.pow(currentHeightCm / 100, 2);
    let bfpBmi = gender === 'male'
      ? 1.20 * bmiVal + 0.23 * numAge - 16.2
      : 1.20 * bmiVal + 0.23 * numAge - 5.4;
    bfpBmi = Math.max(2, Math.round(bfpBmi * 10) / 10);

    // Jackson & Pollock Ideal Body Fat for Age
    let idealBfp = 10.5;
    if (gender === 'male') {
      if (numAge <= 20) idealBfp = 8.5;
      else if (numAge <= 25) idealBfp = 10.5;
      else if (numAge <= 30) idealBfp = 12.7;
      else if (numAge <= 35) idealBfp = 13.7;
      else if (numAge <= 40) idealBfp = 15.3;
      else if (numAge <= 45) idealBfp = 16.4;
      else if (numAge <= 50) idealBfp = 18.9;
      else idealBfp = 20.9;
    } else {
      if (numAge <= 20) idealBfp = 17.7;
      else if (numAge <= 25) idealBfp = 18.4;
      else if (numAge <= 30) idealBfp = 19.3;
      else if (numAge <= 35) idealBfp = 21.5;
      else if (numAge <= 40) idealBfp = 22.2;
      else if (numAge <= 45) idealBfp = 22.9;
      else if (numAge <= 50) idealBfp = 25.2;
      else idealBfp = 26.3;
    }

    // Fat to Lose to Reach Ideal
    const fatToLoseKg = Math.max(0, currentWeightKg * ((bfpNavy - idealBfp) / 100));

    // ACE Category
    let category = 'Fitness';
    let catColor = 'text-[#3B5842]';
    let catBg = 'bg-[#EBF2EC]';

    if (gender === 'male') {
      if (bfpNavy < 6) { category = 'Essential Fat'; catColor = 'text-amber-700'; catBg = 'bg-amber-100'; }
      else if (bfpNavy <= 13) { category = 'Athletes'; catColor = 'text-emerald-700'; catBg = 'bg-emerald-100'; }
      else if (bfpNavy <= 17) { category = 'Fitness'; catColor = 'text-[#3B5842]'; catBg = 'bg-[#EBF2EC]'; }
      else if (bfpNavy <= 24) { category = 'Average'; catColor = 'text-[#C9822B]'; catBg = 'bg-[#FBF4E8]'; }
      else { category = 'Obese / Overfat'; catColor = 'text-[#C4552D]'; catBg = 'bg-[#FDF2EE]'; }
    } else {
      if (bfpNavy < 14) { category = 'Essential Fat'; catColor = 'text-amber-700'; catBg = 'bg-amber-100'; }
      else if (bfpNavy <= 20) { category = 'Athletes'; catColor = 'text-emerald-700'; catBg = 'bg-emerald-100'; }
      else if (bfpNavy <= 24) { category = 'Fitness'; catColor = 'text-[#3B5842]'; catBg = 'bg-[#EBF2EC]'; }
      else if (bfpNavy <= 31) { category = 'Average'; catColor = 'text-[#C9822B]'; catBg = 'bg-[#FBF4E8]'; }
      else { category = 'Obese / Overfat'; catColor = 'text-[#C4552D]'; catBg = 'bg-[#FDF2EE]'; }
    }

    return {
      bfpNavy,
      fatMassKg: fatMassKg.toFixed(1),
      leanMassKg: leanMassKg.toFixed(1),
      fatMassLbs: (fatMassKg * 2.20462).toFixed(1),
      leanMassLbs: (leanMassKg * 2.20462).toFixed(1),
      bmiVal: bmiVal.toFixed(1),
      bfpBmi,
      idealBfp,
      fatToLoseKg: fatToLoseKg.toFixed(1),
      fatToLoseLbs: (fatToLoseKg * 2.20462).toFixed(1),
      category,
      catColor,
      catBg,
    };
  }, [gender, curWaistCm, curNeckCm, curHipCm, currentHeightCm, currentWeightKg, numAge]);

  // =========================================================================
  // 3. IDEAL BODY WEIGHT (IBW) CLINICAL FORMULAS
  // =========================================================================
  const idealWeightResults = useMemo(() => {
    // Height in inches over 5 feet (60 inches)
    const hInchesOver5 = Math.max(0, currentHeightInchesTotal - 60);

    // 1. J.D. Robinson (1983)
    // Male: 52 kg + 1.9 kg/in, Female: 49 kg + 1.7 kg/in
    const robinsonKg = gender === 'male' ? 52 + 1.9 * hInchesOver5 : 49 + 1.7 * hInchesOver5;

    // 2. D.R. Miller (1983)
    // Male: 56.2 kg + 1.41 kg/in, Female: 53.1 kg + 1.36 kg/in
    const millerKg = gender === 'male' ? 56.2 + 1.41 * hInchesOver5 : 53.1 + 1.36 * hInchesOver5;

    // 3. B.J. Devine (1974)
    // Male: 50.0 kg + 2.3 kg/in, Female: 45.5 kg + 2.3 kg/in
    const devineKg = gender === 'male' ? 50.0 + 2.3 * hInchesOver5 : 45.5 + 2.3 * hInchesOver5;

    // 4. G.J. Hamwi (1964)
    // Male: 48.0 kg + 2.7 kg/in, Female: 45.5 kg + 2.2 kg/in
    const hamwiKg = gender === 'male' ? 48.0 + 2.7 * hInchesOver5 : 45.5 + 2.2 * hInchesOver5;

    // 5. Healthy WHO BMI Range (18.5 - 25.0 kg/m²)
    const heightM = currentHeightCm / 100;
    const minHealthyBmiKg = 18.5 * Math.pow(heightM, 2);
    const maxHealthyBmiKg = 25.0 * Math.pow(heightM, 2);

    // Average IBW
    const avgIbwKg = (robinsonKg + millerKg + devineKg + hamwiKg) / 4;

    // Frame size adjustment factor (-10% for small, 0 for med, +10% for large)
    const frameFactor = frameSize === 'small' ? 0.9 : frameSize === 'large' ? 1.1 : 1.0;

    const toDisplay = (kg: number) => {
      const adjusted = kg * frameFactor;
      if (unit === 'imperial') {
        return `${(adjusted * 2.20462).toFixed(1)} lbs`;
      }
      return `${adjusted.toFixed(1)} kg`;
    };

    return {
      robinson: toDisplay(robinsonKg),
      miller: toDisplay(millerKg),
      devine: toDisplay(devineKg),
      hamwi: toDisplay(hamwiKg),
      bmiMin: toDisplay(minHealthyBmiKg),
      bmiMax: toDisplay(maxHealthyBmiKg),
      avgIbw: toDisplay(avgIbwKg),
      avgIbwNum: Math.round(unit === 'imperial' ? avgIbwKg * 2.20462 * frameFactor : avgIbwKg * frameFactor),
      heightM,
    };
  }, [currentHeightInchesTotal, currentHeightCm, gender, unit, frameSize]);

  const handleApplyToJournal = () => {
    saveDailyTargets({
      calories: activeKcalTarget,
      protein: macroDistributions.proteinGrams,
      carbs: macroDistributions.carbsGrams,
      fat: macroDistributions.fatGrams,
    });
    setAppliedTargets(true);
    setTimeout(() => setAppliedTargets(false), 2200);
  };

  const handleUseCalculatedBodyFat = () => {
    setBodyFatInput(bodyFatResults.bfpNavy);
    setFormula('katch');
    setActiveMainTab('calories');
  };

  return (
    <div id="calculators" className="editorial-card rounded-3xl p-6 sm:p-10 relative overflow-hidden text-left font-sans shadow-md border border-[#EAE3D9] bg-white">
      {/* Top Level Studio Navigation (3 Complete Suites) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE3D9]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#C4552D]" />
            <span className="text-[11px] font-sans font-bold tracking-widest text-[#C4552D] uppercase">
              Clinical Telemetry Studio
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513]">
            {activeMainTab === 'calories' && 'Energy Expenditure & Calorie Budget'}
            {activeMainTab === 'bodyfat' && 'US Navy Body Fat & Composition Suite'}
            {activeMainTab === 'idealweight' && 'Clinical Ideal Body Weight (IBW) Calculator'}
          </h2>
        </div>

        {/* 3-Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9]">
          <button
            onClick={() => setActiveMainTab('calories')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeMainTab === 'calories'
                ? 'bg-[#181513] text-white shadow-xs'
                : 'text-[#786C62] hover:text-[#181513]'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#C4552D]" />
            <span>TDEE &amp; Calories</span>
          </button>

          <button
            onClick={() => setActiveMainTab('bodyfat')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeMainTab === 'bodyfat'
                ? 'bg-[#181513] text-white shadow-xs'
                : 'text-[#786C62] hover:text-[#181513]'
            }`}
          >
            <Percent className="w-3.5 h-3.5 text-[#3B5842]" />
            <span>Body Fat %</span>
          </button>

          <button
            onClick={() => setActiveMainTab('idealweight')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeMainTab === 'idealweight'
                ? 'bg-[#181513] text-white shadow-xs'
                : 'text-[#786C62] hover:text-[#181513]'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-[#C9822B]" />
            <span>Ideal Weight</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="pt-8">
        {/* ========================================================================= */}
        {/* TAB 1: TDEE & CALORIE CALCULATOR */}
        {/* ========================================================================= */}
        {activeMainTab === 'calories' && (
          <div className="space-y-10">
            {/* Top Grid: Left Inputs vs Right High-End Telemetry Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Sleek Form Inputs */}
              <div className="lg:col-span-7 space-y-6">
                {/* Switchers Row: Unit System, Biological Sex, Energy Display */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1.5">
                      Units System
                    </span>
                    <div className="grid grid-cols-2 gap-1 p-1 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl">
                      <button
                        type="button"
                        onClick={() => {
                          setUnit('imperial');
                          setTargetWeight(155);
                        }}
                        className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          unit === 'imperial' ? 'bg-white text-[#181513] shadow-2xs' : 'text-[#786C62]'
                        }`}
                      >
                        US (lbs, ft)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUnit('metric');
                          setTargetWeight(70);
                        }}
                        className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          unit === 'metric' ? 'bg-white text-[#181513] shadow-2xs' : 'text-[#786C62]'
                        }`}
                      >
                        Metric (kg, cm)
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1.5">
                      Biological Sex
                    </span>
                    <div className="grid grid-cols-2 gap-1 p-1 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl">
                      <button
                        type="button"
                        onClick={() => setGender('male')}
                        className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          gender === 'male' ? 'bg-white text-[#181513] shadow-2xs' : 'text-[#786C62]'
                        }`}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('female')}
                        className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          gender === 'female' ? 'bg-white text-[#181513] shadow-2xs' : 'text-[#786C62]'
                        }`}
                      >
                        Female
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1.5">
                      Energy Display
                    </span>
                    <div className="grid grid-cols-2 gap-1 p-1 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl">
                      <button
                        type="button"
                        onClick={() => setEnergyUnit('kcal')}
                        className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          energyUnit === 'kcal' ? 'bg-white text-[#181513] shadow-2xs' : 'text-[#786C62]'
                        }`}
                      >
                        Calories
                      </button>
                      <button
                        type="button"
                        onClick={() => setEnergyUnit('kj')}
                        className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          energyUnit === 'kj' ? 'bg-white text-[#181513] shadow-2xs' : 'text-[#786C62]'
                        }`}
                      >
                        Kilojoules
                      </button>
                    </div>
                  </div>
                </div>

                {/* Measurements: Age, Weight, Height */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1.5">
                      Age (Years)
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value === '' ? '' : e.target.value)}
                      onBlur={() => {
                        const n = Number(age);
                        if (age === '' || isNaN(n) || n < 14) setAge(14);
                        else if (n > 100) setAge(100);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-sm font-bold text-[#181513] outline-none focus:border-[#C4552D] focus:bg-white transition-all"
                    />
                  </div>

                  {unit === 'imperial' ? (
                    <>
                      <div>
                        <label className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1.5">
                          Weight (lbs)
                        </label>
                        <input
                          type="number"
                          value={weightLbs}
                          onChange={(e) => setWeightLbs(e.target.value === '' ? '' : e.target.value)}
                          onBlur={() => {
                            const n = Number(weightLbs);
                            if (weightLbs === '' || isNaN(n) || n < 40) setWeightLbs(40);
                            else if (n > 800) setWeightLbs(800);
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-sm font-bold text-[#181513] outline-none focus:border-[#C4552D] focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1.5">
                          Height (ft &amp; in)
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="number"
                            value={heightFeet}
                            onChange={(e) => setHeightFeet(e.target.value === '' ? '' : e.target.value)}
                            onBlur={() => {
                              const n = Number(heightFeet);
                              if (heightFeet === '' || isNaN(n) || n < 3) setHeightFeet(3);
                              else if (n > 8) setHeightFeet(8);
                            }}
                            placeholder="ft"
                            className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-sm font-bold text-[#181513] outline-none focus:border-[#C4552D] focus:bg-white text-center"
                          />
                          <input
                            type="number"
                            value={heightInches}
                            onChange={(e) => setHeightInches(e.target.value === '' ? '' : e.target.value)}
                            onBlur={() => {
                              const n = Number(heightInches);
                              if (heightInches === '' || isNaN(n) || n < 0) setHeightInches(0);
                              else if (n > 11) setHeightInches(11);
                            }}
                            placeholder="in"
                            className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-sm font-bold text-[#181513] outline-none focus:border-[#C4552D] focus:bg-white text-center"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1.5">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          value={weightKg}
                          onChange={(e) => setWeightKg(e.target.value === '' ? '' : e.target.value)}
                          onBlur={() => {
                            const n = Number(weightKg);
                            if (weightKg === '' || isNaN(n) || n < 20) setWeightKg(20);
                            else if (n > 350) setWeightKg(350);
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-sm font-bold text-[#181513] outline-none focus:border-[#C4552D] focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1.5">
                          Height (cm)
                        </label>
                        <input
                          type="number"
                          value={heightCm}
                          onChange={(e) => setHeightCm(e.target.value === '' ? '' : e.target.value)}
                          onBlur={() => {
                            const n = Number(heightCm);
                            if (heightCm === '' || isNaN(n) || n < 80) setHeightCm(80);
                            else if (n > 250) setHeightCm(250);
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-sm font-bold text-[#181513] outline-none focus:border-[#C4552D] focus:bg-white transition-all"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Activity Level Selector */}
                <div>
                  <label className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1.5">
                    Physical Activity Multiplier
                  </label>
                  <select
                    value={activity}
                    onChange={(e) => setActivity(e.target.value as ActivityLevel)}
                    className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-xs font-bold text-[#181513] outline-none focus:border-[#C4552D] cursor-pointer transition-all hover:border-[#C4552D]"
                  >
                    <option value="bmr">💤 Basal Metabolic Rate (BMR only, complete rest) — 1.0x</option>
                    <option value="sedentary">🛋️ Sedentary: Little or no exercise (Desk job) — 1.2x</option>
                    <option value="light">🚶 Light Exercise: 1–3 workout sessions / week — 1.375x</option>
                    <option value="moderate">🏃 Moderate Exercise: 4–5 workout sessions / week — 1.465x</option>
                    <option value="active">🏋️ Active Lifestyle: Daily exercise or intense 3–4 days / week — 1.55x</option>
                    <option value="very_active">⚡ Very Active: Intense exercise 6–7 days / week — 1.725x</option>
                    <option value="extra_active">🔥 Extra Active: Very intense daily training or physical labor — 1.9x</option>
                  </select>
                </div>

                {/* Collapsible Advanced Settings (Formula & Body Fat) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-xs font-bold text-[#C4552D] hover:text-[#A03E1B] transition-colors cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{showAdvanced ? 'Hide Advanced Formula Settings' : 'Advanced Formula Settings & Body Fat %'}</span>
                    {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showAdvanced && (
                    <div className="mt-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1">
                          BMR Clinical Equation
                        </label>
                        <select
                          value={formula}
                          onChange={(e) => setFormula(e.target.value as FormulaType)}
                          className="w-full p-2.5 rounded-xl bg-white border border-[#EAE3D9] text-xs font-bold text-[#181513] outline-none focus:border-[#C4552D] cursor-pointer"
                        >
                          <option value="mifflin">Mifflin-St Jeor (Standard Clinical)</option>
                          <option value="harris">Revised Harris-Benedict (1984)</option>
                          <option value="katch">Katch-McArdle (Uses Body Fat %)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1">
                          Body Fat % {formula === 'katch' && <span className="text-[#C4552D]">(Required for Katch)</span>}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.1"
                            value={bodyFatInput}
                            onChange={(e) => setBodyFatInput(e.target.value === '' ? '' : e.target.value)}
                            onBlur={() => {
                              const n = Number(bodyFatInput);
                              if (bodyFatInput === '' || isNaN(n) || n < 3) setBodyFatInput(3);
                              else if (n > 60) setBodyFatInput(60);
                            }}
                            className="w-full p-2.5 rounded-xl bg-white border border-[#EAE3D9] text-xs font-bold text-[#181513] outline-none focus:border-[#C4552D]"
                          />
                          <span className="text-xs font-bold text-[#786C62]">%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Premium High-Contrast Telemetry Dashboard */}
              <div className="lg:col-span-5 bg-[#181513] text-white rounded-3xl p-7 space-y-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#C4552D]/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9822B]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4C8BA] font-bold">
                      TARGET ENERGY BUDGET
                    </span>
                    <span className="text-[10px] font-sans font-bold text-[#E06B42] uppercase flex items-center gap-1.5 bg-[#C4552D]/10 px-2.5 py-1 rounded-full border border-[#C4552D]/20">
                      <Sparkles className="w-3 h-3" /> 3D Live Orbit
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl sm:text-6xl font-serif font-bold text-white tracking-tight">
                          <AnimatedNumber value={formatEnergy(activeKcalTarget)} />
                        </span>
                        <span className="text-sm font-bold text-[#E06B42]">{energyUnitLabel}</span>
                      </div>
                      <div className="text-xs text-[#A89E92] mt-1 flex flex-wrap items-center gap-2">
                        <span>BMR: <strong className="text-white">{formatEnergy(bmr)}</strong></span>
                        <span>•</span>
                        <span>TDEE: <strong className="text-white">{formatEnergy(tdeeKcal)}</strong></span>
                        <span>•</span>
                        <span className="text-[#E06B42] font-bold">{resultsMatrix[selectedTier].tag}</span>
                      </div>
                    </div>

                    {/* 3D Orbit */}
                    <div className="shrink-0">
                      <MacroOrbital3D
                        calories={activeKcalTarget}
                        protein={macroDistributions.proteinGrams}
                        carbs={macroDistributions.carbsGrams}
                        fat={macroDistributions.fatGrams}
                        size={110}
                      />
                    </div>
                  </div>
                </div>

                {/* Macro Prescription Grid */}
                <div className="relative z-10 space-y-2 pt-2 border-t border-white/10">
                  <span className="text-[10px] font-sans uppercase tracking-wider text-[#A89E92] font-bold block">
                    Macro Prescription ({macroDiet.replace('_', ' ')})
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[10px] font-bold text-[#86EFAC] uppercase block">Protein</span>
                      <span className="text-lg font-serif font-bold text-white">
                        <AnimatedNumber value={macroDistributions.proteinGrams} />g
                      </span>
                      <span className="text-[9px] text-[#A89E92] block">{macroDistributions.pPct}% cal</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[10px] font-bold text-[#FDE047] uppercase block">Carbs</span>
                      <span className="text-lg font-serif font-bold text-white">
                        <AnimatedNumber value={macroDistributions.carbsGrams} />g
                      </span>
                      <span className="text-[9px] text-[#A89E92] block">{macroDistributions.cPct}% cal</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[10px] font-bold text-[#FCA5A5] uppercase block">Fats</span>
                      <span className="text-lg font-serif font-bold text-white">
                        <AnimatedNumber value={macroDistributions.fatGrams} />g
                      </span>
                      <span className="text-[9px] text-[#A89E92] block">{macroDistributions.fPct}% cal</span>
                    </div>
                  </div>
                </div>

                {/* 1-Click Apply */}
                <button
                  onClick={handleApplyToJournal}
                  className="relative z-10 w-full py-3.5 rounded-2xl bg-[#C4552D] hover:bg-[#A03E1B] text-white font-sans font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98"
                >
                  {appliedTargets ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Applied to Active Journal!</span>
                    </>
                  ) : (
                    <>
                      <Sliders className="w-4 h-4" />
                      <span>Set as My Daily Goal in Meal Journal</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sub-Telemetry Suites */}
            <div className="space-y-6 pt-6 border-t border-[#EAE3D9]">
              <div className="flex flex-wrap items-center gap-2 pb-2">
                <button
                  onClick={() => setResultSubTab('overview')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    resultSubTab === 'overview'
                      ? 'bg-[#181513] text-white shadow-xs'
                      : 'bg-[#FAF8F5] border border-[#EAE3D9] text-[#786C62] hover:text-[#181513]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-[#C4552D]" />
                  <span>1. Full Results Matrix</span>
                </button>
                <button
                  onClick={() => setResultSubTab('zigzag')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    resultSubTab === 'zigzag'
                      ? 'bg-[#181513] text-white shadow-xs'
                      : 'bg-[#FAF8F5] border border-[#EAE3D9] text-[#786C62] hover:text-[#181513]'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-[#C9822B]" />
                  <span>2. Zig-Zag Calorie Cycling</span>
                </button>
                <button
                  onClick={() => setResultSubTab('macros')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    resultSubTab === 'macros'
                      ? 'bg-[#181513] text-white shadow-xs'
                      : 'bg-[#FAF8F5] border border-[#EAE3D9] text-[#786C62] hover:text-[#181513]'
                  }`}
                >
                  <PieChart className="w-3.5 h-3.5 text-[#3B5842]" />
                  <span>3. Macronutrient Breakdown</span>
                </button>
                <button
                  onClick={() => setResultSubTab('target_date')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    resultSubTab === 'target_date'
                      ? 'bg-[#181513] text-white shadow-xs'
                      : 'bg-[#FAF8F5] border border-[#EAE3D9] text-[#786C62] hover:text-[#181513]'
                  }`}
                >
                  <Target className="w-3.5 h-3.5 text-[#C4552D]" />
                  <span>4. Goal by Target Date</span>
                </button>
              </div>

              {/* TAB 1: ALL RESULTS MATRIX */}
              {resultSubTab === 'overview' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#181513]">
                        Daily Caloric Target Breakdown by Goal
                      </h3>
                      <p className="text-xs text-[#786C62]">
                        Click any objective below to update your primary telemetry dial, 3D orbit, and meal journal.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {(Object.keys(resultsMatrix) as ResultTierKey[]).map((key) => {
                      const tier = resultsMatrix[key];
                      const tierKcal = Math.max(800, tdeeKcal + tier.kcalOffset);
                      const isSelected = selectedTier === key;

                      return (
                        <div
                          key={key}
                          onClick={() => setSelectedTier(key)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between gap-3 ${
                            isSelected
                              ? 'border-[#C4552D] bg-[#FDF2EE] shadow-sm ring-2 ring-[#C4552D]/30'
                              : 'border-[#EAE3D9] bg-[#FAF8F5] hover:border-[#C4552D] hover:bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-serif font-bold text-sm text-[#181513] block">
                                {tier.title}
                              </span>
                              <span className="text-[11px] text-[#786C62] block mt-0.5 font-medium">
                                {tier.rateLabel}
                              </span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tier.tagBg} ${tier.tagColor}`}>
                              {tier.tag}
                            </span>
                          </div>

                          <div className="flex items-baseline justify-between pt-1 border-t border-[#EAE3D9]/60">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-2xl font-serif font-bold text-[#181513]">
                                <AnimatedNumber value={formatEnergy(tierKcal)} />
                              </span>
                              <span className="text-[11px] font-bold text-[#C4552D]">{energyUnitLabel}</span>
                            </div>
                            <span className="text-xs font-bold text-[#786C62]">{tier.pct}%</span>
                          </div>

                          {tier.isWarning && (
                            <div className="flex items-center gap-1.5 text-[10px] text-amber-700 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                              <span>Clinical Minimum Warning: consult a physician.</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: ZIG-ZAG CALORIE CYCLING */}
              {resultSubTab === 'zigzag' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#181513]">
                        Zig-Zag Calorie Shifting Schedule (7-Day Plan)
                      </h3>
                      <p className="text-xs text-[#786C62]">
                        Alternate higher and lower calorie days to prevent metabolic adaptation and sustain social life.
                      </p>
                    </div>

                    <div className="flex items-center gap-1 p-1 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl">
                      <button
                        type="button"
                        onClick={() => setZigzagType('weekend_refeed')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          zigzagType === 'weekend_refeed'
                            ? 'bg-white text-[#181513] shadow-2xs'
                            : 'text-[#786C62]'
                        }`}
                      >
                        Weekend Refeed
                      </button>
                      <button
                        type="button"
                        onClick={() => setZigzagType('alternating_wave')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          zigzagType === 'alternating_wave'
                            ? 'bg-white text-[#181513] shadow-2xs'
                            : 'text-[#786C62]'
                        }`}
                      >
                        Alternating Wave
                      </button>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] space-y-4">
                    <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 pt-4">
                      {zigZagDays.map((d, i) => {
                        const maxVal = activeKcalTarget + 500;
                        const barHeightPct = Math.min(100, Math.max(30, (d.kcal / maxVal) * 100));

                        return (
                          <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                            <span className="text-[10px] sm:text-xs font-bold text-[#181513] opacity-90 group-hover:text-[#C4552D] transition-colors">
                              {formatEnergy(d.kcal)}
                            </span>
                            <div className="w-full bg-[#EAE3D9] rounded-xl h-full max-h-36 flex items-end overflow-hidden p-0.5">
                              <div
                                style={{ height: `${barHeightPct}%` }}
                                className={`w-full rounded-lg transition-all duration-500 ${
                                  d.isHigh
                                    ? 'bg-gradient-to-t from-[#C4552D] to-[#E06B42] shadow-xs'
                                    : 'bg-gradient-to-t from-[#3B5842] to-[#527A5C]'
                                }`}
                              />
                            </div>
                            <span className="text-xs font-bold text-[#786C62]">{d.day}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-xs text-[#786C62] pt-4 border-t border-[#EAE3D9]">
                      <span>Weekly Total: <strong>{formatEnergy(activeKcalTarget * 7)} {energyUnitLabel.replace('/ day', '')}</strong></span>
                      <span>Weekly Daily Average: <strong>{formatEnergy(activeKcalTarget)} {energyUnitLabel}</strong></span>
                      <span className="text-[#3B5842] font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Leptin &amp; Thyroid Protected
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: MACRONUTRIENT BREAKDOWN MATRIX */}
              {resultSubTab === 'macros' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#181513]">
                        Macronutrient Prescription Plans
                      </h3>
                      <p className="text-xs text-[#786C62]">
                        Choose an evidence-based macro split or customize your ratios directly.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 p-1 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl">
                      {[
                        { id: 'balanced', label: 'Balanced' },
                        { id: 'high_protein', label: 'High Protein' },
                        { id: 'low_carb', label: 'Keto / Low-Carb' },
                        { id: 'low_fat', label: 'Low Fat' },
                        { id: 'custom', label: 'Custom' },
                      ].map((diet) => (
                        <button
                          key={diet.id}
                          type="button"
                          onClick={() => setMacroDiet(diet.id as MacroDietType)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            macroDiet === diet.id
                              ? 'bg-white text-[#181513] shadow-2xs'
                              : 'text-[#786C62]'
                          }`}
                        >
                          {diet.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-white border border-[#EAE3D9] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#3B5842] uppercase">Protein (4 kcal/g)</span>
                        <span className="text-xs font-bold text-[#786C62]">{macroDistributions.pPct}%</span>
                      </div>
                      <div className="text-2xl font-serif font-bold text-[#181513]">
                        <AnimatedNumber value={macroDistributions.proteinGrams} /> grams
                      </div>
                      <p className="text-[11px] text-[#786C62]">
                        {macroDistributions.proteinCalories} kcal ({((macroDistributions.proteinGrams / currentWeightKg)).toFixed(1)}g per kg body weight)
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-[#EAE3D9] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#C9822B] uppercase">Carbohydrates (4 kcal/g)</span>
                        <span className="text-xs font-bold text-[#786C62]">{macroDistributions.cPct}%</span>
                      </div>
                      <div className="text-2xl font-serif font-bold text-[#181513]">
                        <AnimatedNumber value={macroDistributions.carbsGrams} /> grams
                      </div>
                      <p className="text-[11px] text-[#786C62]">
                        {macroDistributions.carbsCalories} kcal (Primary glycogen &amp; high-output fuel)
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-[#EAE3D9] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#C4552D] uppercase">Dietary Fats (9 kcal/g)</span>
                        <span className="text-xs font-bold text-[#786C62]">{macroDistributions.fPct}%</span>
                      </div>
                      <div className="text-2xl font-serif font-bold text-[#181513]">
                        <AnimatedNumber value={macroDistributions.fatGrams} /> grams
                      </div>
                      <p className="text-[11px] text-[#786C62]">
                        {macroDistributions.fatCalories} kcal (Crucial for hormone balance &amp; cellular health)
                      </p>
                    </div>
                  </div>

                  {macroDiet === 'custom' && (
                    <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] space-y-4">
                      <span className="text-xs font-bold text-[#181513] block">Adjust Custom Macro Percentages:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-[#3B5842] block mb-1">Protein: {customProteinPct}%</label>
                          <input
                            type="range"
                            min="10"
                            max="60"
                            value={customProteinPct}
                            onChange={(e) => setCustomProteinPct(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-[#C9822B] block mb-1">Carbs: {customCarbsPct}%</label>
                          <input
                            type="range"
                            min="5"
                            max="70"
                            value={customCarbsPct}
                            onChange={(e) => setCustomCarbsPct(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-[#C4552D] block mb-1">Fats: {customFatPct}%</label>
                          <input
                            type="range"
                            min="10"
                            max="70"
                            value={customFatPct}
                            onChange={(e) => setCustomFatPct(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: GOAL BY TARGET DATE */}
              {resultSubTab === 'target_date' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#181513]">
                      Target Weight &amp; Deadline Forecaster
                    </h3>
                    <p className="text-xs text-[#786C62]">
                      Calculate the precise daily caloric intake required to reach your target weight by a specific timeline.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] space-y-4">
                      <div>
                        <label className="text-xs font-bold text-[#786C62] block mb-1.5">
                          Desired Goal Weight ({unit === 'imperial' ? 'lbs' : 'kg'})
                        </label>
                        <input
                          type="number"
                          value={targetWeight}
                          onChange={(e) => setTargetWeight(e.target.value === '' ? '' : e.target.value)}
                          onBlur={() => {
                            const n = Number(targetWeight);
                            if (targetWeight === '' || isNaN(n) || n < 30) setTargetWeight(unit === 'imperial' ? 120 : 50);
                          }}
                          className="w-full p-3 rounded-xl bg-white border border-[#EAE3D9] text-sm font-bold text-[#181513] outline-none focus:border-[#C4552D]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#786C62] block mb-1.5">
                          Timeline in Weeks ({targetWeeks} weeks / {(targetWeeks / 4.3).toFixed(1)} months)
                        </label>
                        <input
                          type="range"
                          min="4"
                          max="52"
                          value={targetWeeks}
                          onChange={(e) => setTargetWeeks(Number(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-[10px] text-[#786C62] mt-1 font-bold">
                          <span>4 Weeks</span>
                          <span>26 Weeks</span>
                          <span>52 Weeks</span>
                        </div>
                      </div>
                    </div>

                    {/* Calculated Target Output */}
                    <div className="p-6 rounded-2xl bg-[#FDF2EE] border border-[#C4552D]/30 space-y-3">
                      <span className="text-[10px] font-sans font-bold text-[#C4552D] uppercase tracking-wider block">
                        Required Intake to Hit Deadline
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-serif font-bold text-[#181513]">
                          <AnimatedNumber value={formatEnergy(targetDateResult.requiredDailyCalories)} />
                        </span>
                        <span className="text-sm font-bold text-[#C4552D]">{energyUnitLabel}</span>
                      </div>

                      <div className="space-y-1 text-xs text-[#786C62]">
                        <p>
                          Target Change: <strong>{Math.abs(targetDateResult.deltaW)} {unit === 'imperial' ? 'lbs' : 'kg'}</strong> total
                        </p>
                        <p>
                          Weekly Rate: <strong>{targetDateResult.weeklyRateLbs} lbs / wk ({targetDateResult.weeklyRateKg} kg / wk)</strong>
                        </p>
                        <p className="flex items-center gap-1.5 pt-1">
                          Status:{' '}
                          <span
                            className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                              targetDateResult.safetyStatus === 'safe'
                                ? 'bg-emerald-100 text-emerald-800'
                                : targetDateResult.safetyStatus === 'aggressive'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {targetDateResult.safetyStatus === 'safe'
                              ? 'Healthy & Sustainable Pace'
                              : targetDateResult.safetyStatus === 'aggressive'
                              ? 'Aggressive Pace'
                              : 'Medical Warning: Deficit Too Steep'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: US NAVY BODY FAT & COMPOSITION SUITE (Full Calculator.net Parity) */}
        {/* ========================================================================= */}
        {activeMainTab === 'bodyfat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
            {/* Left Inputs */}
            <div className="lg:col-span-6 space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1.5">
                    Tape Units
                  </label>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl">
                    <button
                      type="button"
                      onClick={() => setUnit('imperial')}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        unit === 'imperial' ? 'bg-white text-[#181513] shadow-2xs' : 'text-[#786C62]'
                      }`}
                    >
                      Inches (in)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnit('metric')}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        unit === 'metric' ? 'bg-white text-[#181513] shadow-2xs' : 'text-[#786C62]'
                      }`}
                    >
                      Centimeters (cm)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1.5">
                    Biological Sex
                  </label>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        gender === 'male' ? 'bg-white text-[#181513] shadow-2xs' : 'text-[#786C62]'
                      }`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        gender === 'female' ? 'bg-white text-[#181513] shadow-2xs' : 'text-[#786C62]'
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>
              </div>

              {/* Age, Weight, Height */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-xs font-bold text-[#181513] outline-none focus:border-[#3B5842]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1">
                    Weight ({unit === 'imperial' ? 'lbs' : 'kg'})
                  </label>
                  <input
                    type="number"
                    value={unit === 'imperial' ? weightLbs : weightKg}
                    onChange={(e) =>
                      unit === 'imperial'
                        ? setWeightLbs(e.target.value === '' ? '' : e.target.value)
                        : setWeightKg(e.target.value === '' ? '' : e.target.value)
                    }
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-xs font-bold text-[#181513] outline-none focus:border-[#3B5842]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1">
                    Height ({unit === 'imperial' ? 'in' : 'cm'})
                  </label>
                  <input
                    type="number"
                    value={unit === 'imperial' ? Math.round(currentHeightInchesTotal) : heightCm}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (unit === 'imperial') {
                        setHeightFeet(Math.floor(v / 12));
                        setHeightInches(v % 12);
                      } else {
                        setHeightCm(e.target.value === '' ? '' : e.target.value);
                      }
                    }}
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-xs font-bold text-[#181513] outline-none focus:border-[#3B5842]"
                  />
                </div>
              </div>

              {/* Tape Measurements */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1">
                    Neck ({unit === 'imperial' ? 'in' : 'cm'})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={unit === 'imperial' ? neckInches : neckCm}
                    onChange={(e) =>
                      unit === 'imperial'
                        ? setNeckInches(e.target.value === '' ? '' : e.target.value)
                        : setNeckCm(e.target.value === '' ? '' : e.target.value)
                    }
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-xs font-bold text-[#181513] outline-none focus:border-[#3B5842]"
                  />
                  <span className="text-[9px] text-[#786C62] mt-0.5 block">Below Adam's apple</span>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1">
                    Waist ({unit === 'imperial' ? 'in' : 'cm'})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={unit === 'imperial' ? waistInches : waistCm}
                    onChange={(e) =>
                      unit === 'imperial'
                        ? setWaistInches(e.target.value === '' ? '' : e.target.value)
                        : setWaistCm(e.target.value === '' ? '' : e.target.value)
                    }
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-xs font-bold text-[#181513] outline-none focus:border-[#3B5842]"
                  />
                  <span className="text-[9px] text-[#786C62] mt-0.5 block">At belly button</span>
                </div>

                {gender === 'female' ? (
                  <div>
                    <label className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1">
                      Hips ({unit === 'imperial' ? 'in' : 'cm'})
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={unit === 'imperial' ? hipInches : hipCm}
                      onChange={(e) =>
                        unit === 'imperial'
                          ? setHipInches(e.target.value === '' ? '' : e.target.value)
                          : setHipCm(e.target.value === '' ? '' : e.target.value)
                      }
                      className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-xs font-bold text-[#181513] outline-none focus:border-[#3B5842]"
                    />
                    <span className="text-[9px] text-[#786C62] mt-0.5 block">Widest gluteal point</span>
                  </div>
                ) : (
                  <div className="flex items-center text-xs text-[#786C62] pt-6">
                    <span className="text-[10px] text-[#786C62] italic">Hips not needed for males</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Detailed Telemetry Card Matching Calculator.net */}
            <div className="lg:col-span-6 bg-[#FAF8F5] border border-[#EAE3D9] rounded-3xl p-6 space-y-5">
              <div>
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#786C62] font-bold block mb-1">
                  Body Fat Analysis (U.S. Navy Method)
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-serif font-bold text-[#181513]">
                    <AnimatedNumber value={bodyFatResults.bfpNavy} formatter={(v) => v.toFixed(1)} />%
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${bodyFatResults.catBg} ${bodyFatResults.catColor}`}>
                    {bodyFatResults.category}
                  </span>
                </div>
              </div>

              {/* Visual Multi-Color Spectrum Gauge Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[10px] font-bold text-[#786C62]">
                  <span>2% Essential</span>
                  <span>6% Athletes</span>
                  <span>14% Fitness</span>
                  <span>18% Avg</span>
                  <span>25%+ Obese</span>
                </div>
                <div className="relative h-3.5 w-full rounded-full overflow-hidden flex shadow-inner">
                  <div className="w-[12%] bg-[#F59E0B]" title="Essential Fat" />
                  <div className="w-[20%] bg-[#10B981]" title="Athletes" />
                  <div className="w-[16%] bg-[#3B5842]" title="Fitness" />
                  <div className="w-[22%] bg-[#EAB308]" title="Average" />
                  <div className="w-[30%] bg-[#EF4444]" title="Obese" />
                </div>
                {/* Pointer indicator */}
                <div className="relative w-full h-3">
                  <div
                    style={{ left: `${Math.min(95, Math.max(5, (bodyFatResults.bfpNavy / 40) * 100))}%` }}
                    className="absolute -top-1 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                  >
                    <span className="w-0 h-0 border-x-4 border-x-transparent border-b-6 border-b-[#181513]" />
                    <span className="text-[9px] font-bold text-[#181513]">{bodyFatResults.bfpNavy}%</span>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown Table (Exact Calculator.net Matrix) */}
              <div className="overflow-hidden rounded-2xl border border-[#EAE3D9] bg-white divide-y divide-[#EAE3D9] text-xs">
                <div className="flex justify-between p-2.5 px-3.5">
                  <span className="text-[#786C62]">Body Fat (U.S. Navy Method)</span>
                  <strong className="text-[#181513] font-mono">{bodyFatResults.bfpNavy}%</strong>
                </div>
                <div className="flex justify-between p-2.5 px-3.5">
                  <span className="text-[#786C62]">Body Fat Category</span>
                  <strong className="text-[#181513]">{bodyFatResults.category}</strong>
                </div>
                <div className="flex justify-between p-2.5 px-3.5">
                  <span className="text-[#786C62]">Body Fat Mass</span>
                  <strong className="text-[#181513] font-mono">
                    {unit === 'imperial' ? `${bodyFatResults.fatMassLbs} lbs` : `${bodyFatResults.fatMassKg} kg`}
                  </strong>
                </div>
                <div className="flex justify-between p-2.5 px-3.5">
                  <span className="text-[#786C62]">Lean Body Mass</span>
                  <strong className="text-[#181513] font-mono">
                    {unit === 'imperial' ? `${bodyFatResults.leanMassLbs} lbs` : `${bodyFatResults.leanMassKg} kg`}
                  </strong>
                </div>
                <div className="flex justify-between p-2.5 px-3.5">
                  <span className="text-[#786C62]">Ideal Body Fat for Given Age (Jackson &amp; Pollock)</span>
                  <strong className="text-[#3B5842] font-mono">{bodyFatResults.idealBfp}%</strong>
                </div>
                <div className="flex justify-between p-2.5 px-3.5">
                  <span className="text-[#786C62]">Body Fat to Lose to Reach Ideal</span>
                  <strong className="text-[#C4552D] font-mono">
                    {unit === 'imperial' ? `${bodyFatResults.fatToLoseLbs} lbs` : `${bodyFatResults.fatToLoseKg} kg`}
                  </strong>
                </div>
                <div className="flex justify-between p-2.5 px-3.5 bg-[#FAF8F5]/50">
                  <span className="text-[#786C62]">Body Fat (BMI method)</span>
                  <strong className="text-[#786C62] font-mono">{bodyFatResults.bfpBmi}%</strong>
                </div>
              </div>

              <button
                onClick={handleUseCalculatedBodyFat}
                className="w-full py-3.5 rounded-2xl bg-[#3B5842] hover:bg-[#2F4634] text-white font-sans font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
              >
                <Check className="w-4 h-4" />
                <span>Use {bodyFatResults.bfpNavy}% in Katch-McArdle Calorie Formula</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: IDEAL BODY WEIGHT (IBW) CALCULATOR (Full Calculator.net Parity) */}
        {/* ========================================================================= */}
        {activeMainTab === 'idealweight' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
            {/* Left Inputs */}
            <div className="lg:col-span-6 space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1.5">
                    Units System
                  </label>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl">
                    <button
                      type="button"
                      onClick={() => setUnit('imperial')}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        unit === 'imperial' ? 'bg-white text-[#181513] shadow-2xs' : 'text-[#786C62]'
                      }`}
                    >
                      US (ft, in)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnit('metric')}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        unit === 'metric' ? 'bg-white text-[#181513] shadow-2xs' : 'text-[#786C62]'
                      }`}
                    >
                      Metric (cm)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1.5">
                    Biological Sex
                  </label>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        gender === 'male' ? 'bg-white text-[#181513] shadow-2xs' : 'text-[#786C62]'
                      }`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        gender === 'female' ? 'bg-white text-[#181513] shadow-2xs' : 'text-[#786C62]'
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>
              </div>

              {/* Age, Height, Body Frame Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1.5">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-sm font-bold text-[#181513] outline-none focus:border-[#C9822B]"
                  />
                </div>

                {unit === 'imperial' ? (
                  <div>
                    <label className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1.5">
                      Height (ft &amp; in)
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="number"
                        value={heightFeet}
                        onChange={(e) => setHeightFeet(e.target.value === '' ? '' : e.target.value)}
                        placeholder="ft"
                        className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-sm font-bold text-[#181513] outline-none focus:border-[#C9822B] text-center"
                      />
                      <input
                        type="number"
                        value={heightInches}
                        onChange={(e) => setHeightInches(e.target.value === '' ? '' : e.target.value)}
                        placeholder="in"
                        className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-sm font-bold text-[#181513] outline-none focus:border-[#C9822B] text-center"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1.5">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value === '' ? '' : e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-sm font-bold text-[#181513] outline-none focus:border-[#C9822B]"
                    />
                  </div>
                )}
              </div>

              {/* Body Frame Size Selector */}
              <div>
                <label className="text-[10px] font-bold text-[#786C62] uppercase tracking-wider block mb-1.5">
                  Body Frame Size (Bone Structure)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'small', label: 'Small Frame (-10%)' },
                    { id: 'medium', label: 'Medium Frame (0%)' },
                    { id: 'large', label: 'Large Frame (+10%)' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFrameSize(f.id as FrameSize)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        frameSize === f.id
                          ? 'border-[#C9822B] bg-[#FBF4E8] text-[#C9822B] shadow-2xs'
                          : 'border-[#EAE3D9] bg-[#FAF8F5] text-[#786C62]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Telemetry Card Matching Calculator.net IBW */}
            <div className="lg:col-span-6 bg-[#FAF8F5] border border-[#EAE3D9] rounded-3xl p-6 space-y-5">
              <div>
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#786C62] font-bold block mb-1">
                  Ideal Body Weight Range
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-5xl font-serif font-bold text-[#181513]">
                    {idealWeightResults.avgIbw}
                  </span>
                  <span className="text-xs font-bold text-[#C9822B]">Clinical Average</span>
                </div>
                <p className="text-xs text-[#786C62] mt-1">
                  Healthy WHO BMI Range for your height: <strong>{idealWeightResults.bmiMin} – {idealWeightResults.bmiMax}</strong>
                </p>
              </div>

              {/* IBW Formulas Comparison Table */}
              <div className="overflow-hidden rounded-2xl border border-[#EAE3D9] bg-white divide-y divide-[#EAE3D9] text-xs">
                <div className="flex justify-between p-2.5 px-3.5 bg-[#FAF8F5] font-bold text-[#181513]">
                  <span>Formula</span>
                  <span>Ideal Weight</span>
                </div>
                <div className="flex justify-between p-2.5 px-3.5">
                  <span className="text-[#786C62]">J. D. Robinson (1983)</span>
                  <strong className="text-[#181513] font-mono">{idealWeightResults.robinson}</strong>
                </div>
                <div className="flex justify-between p-2.5 px-3.5">
                  <span className="text-[#786C62]">D. R. Miller (1983)</span>
                  <strong className="text-[#181513] font-mono">{idealWeightResults.miller}</strong>
                </div>
                <div className="flex justify-between p-2.5 px-3.5">
                  <span className="text-[#786C62]">B. J. Devine (1974)</span>
                  <strong className="text-[#181513] font-mono">{idealWeightResults.devine}</strong>
                </div>
                <div className="flex justify-between p-2.5 px-3.5">
                  <span className="text-[#786C62]">G. J. Hamwi (1964)</span>
                  <strong className="text-[#181513] font-mono">{idealWeightResults.hamwi}</strong>
                </div>
                <div className="flex justify-between p-2.5 px-3.5 bg-[#EBF2EC]">
                  <span className="text-[#3B5842] font-bold">Healthy BMI Range (18.5 - 25.0)</span>
                  <strong className="text-[#3B5842] font-mono font-bold">{idealWeightResults.bmiMin} – {idealWeightResults.bmiMax}</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  setTargetWeight(idealWeightResults.avgIbwNum);
                  setResultSubTab('target_date');
                  setActiveMainTab('calories');
                }}
                className="w-full py-3.5 rounded-2xl bg-[#C9822B] hover:bg-[#A86B1E] text-white font-sans font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
              >
                <Target className="w-4 h-4" />
                <span>Use {idealWeightResults.avgIbw} as Goal in Target Date Forecaster</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
