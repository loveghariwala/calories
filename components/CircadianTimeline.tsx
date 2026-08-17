'use client';

import React, { useState, useEffect } from 'react';
import { loadTodayLog, getMealSummary } from '@/lib/storage';
import { Sun, Sunset, Moon, Sunrise, Clock, Sparkles } from 'lucide-react';
import { InteractiveTilt } from './InteractiveTilt';

export const CircadianTimeline: React.FC = () => {
  const [summary, setSummary] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snack: 0,
  });
  const [targetCals, setTargetCals] = useState(2000);

  const update = () => {
    const today = loadTodayLog();
    setSummary(getMealSummary(today.entries));
    setTargetCals(today.targets.calories);
  };

  useEffect(() => {
    update();
    window.addEventListener('cp_meal_log_updated', update);
    window.addEventListener('cp_targets_updated', update);
    return () => {
      window.removeEventListener('cp_meal_log_updated', update);
      window.removeEventListener('cp_targets_updated', update);
    };
  }, []);

  const phases = [
    {
      name: 'Morning Table',
      sub: 'Breakfast (07:00 - 10:00)',
      cals: summary.breakfast,
      ideal: Math.round(targetCals * 0.25),
      icon: Sunrise,
      color: 'text-[#C9822B]',
      gradient: 'from-[#C9822B] to-[#E59E44]',
      bgPill: 'bg-[#FBF4E8]',
      borderPill: 'border-[#EAE3D9]',
    },
    {
      name: 'Midday Meal',
      sub: 'Lunch (12:00 - 14:30)',
      cals: summary.lunch,
      ideal: Math.round(targetCals * 0.35),
      icon: Sun,
      color: 'text-[#3B5842]',
      gradient: 'from-[#3B5842] to-[#527A5C]',
      bgPill: 'bg-[#EBF2EC]',
      borderPill: 'border-[#EAE3D9]',
    },
    {
      name: 'Evening Dinner',
      sub: 'Dinner (18:30 - 21:00)',
      cals: summary.dinner,
      ideal: Math.round(targetCals * 0.30),
      icon: Sunset,
      color: 'text-[#C4552D]',
      gradient: 'from-[#C4552D] to-[#E06B42]',
      bgPill: 'bg-[#F8EFEA]',
      borderPill: 'border-[#EAE3D9]',
    },
    {
      name: 'Light Bites',
      sub: 'Anytime Snack',
      cals: summary.snack,
      ideal: Math.round(targetCals * 0.10),
      icon: Moon,
      color: 'text-[#786C62]',
      gradient: 'from-[#786C62] to-[#9E9084]',
      bgPill: 'bg-[#FAF8F5]',
      borderPill: 'border-[#EAE3D9]',
    },
  ];

  return (
    <div className="editorial-card rounded-3xl p-6 sm:p-10 my-12 relative overflow-hidden font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[11px] font-sans font-bold tracking-widest text-[#C4552D] uppercase block">
            Circadian Chrono-Nutrition
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513] mt-0.5">
            Daily Energy &amp; Meal Distribution
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs font-sans text-[#786C62] uppercase block font-semibold">Today’s Calorie Ledger</span>
          <span className="text-2xl font-serif font-bold text-[#181513]">
            {summary.calories} <span className="text-xs font-sans font-normal text-[#C4552D]">/ {targetCals} kcal</span>
          </span>
        </div>
      </div>

      {/* 4 Phases */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {phases.map((phase) => {
          const Icon = phase.icon;
          const pct = Math.min(100, Math.round((phase.cals / (phase.ideal || 1)) * 100));

          return (
            <InteractiveTilt key={phase.name} maxTilt={6} scale={1.02} className="h-full">
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] flex flex-col justify-between h-full group hover:border-[#C4552D] transition-colors shadow-2xs">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${phase.bgPill} border ${phase.borderPill} shadow-2xs group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${phase.color}`} />
                    </div>
                    <span className="text-xs font-sans text-[#786C62]">
                      Target: {phase.ideal} kcal
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-base text-[#181513] group-hover:text-[#C4552D] transition-colors">{phase.name}</h4>
                  <span className="text-[11px] font-sans text-[#786C62] block mb-3">{phase.sub}</span>

                  <div className="py-2 border-t border-[#EAE3D9] flex items-baseline justify-between">
                    <span className="text-2xl font-serif font-bold text-[#181513]">
                      {phase.cals}{' '}
                      <span className="text-xs font-sans font-normal text-[#786C62]">kcal</span>
                    </span>
                    <span className={`text-xs font-sans font-bold ${phase.color}`}>
                      {pct}%
                    </span>
                  </div>
                </div>

                {/* Animated Gradient Progress Bar */}
                <div className="w-full bg-[#EAE3D9] rounded-full h-2 mt-3 overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full bg-linear-to-r ${phase.gradient} transition-all duration-700`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>
            </InteractiveTilt>
          );
        })}
      </div>
    </div>
  );
};
