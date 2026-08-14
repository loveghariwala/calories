'use client';

import React, { useState, useEffect } from 'react';
import { loadTodayLog, getMealSummary } from '@/lib/storage';
import { Sun, Sunset, Moon, Sunrise, Clock, Sparkles } from 'lucide-react';

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
      color: 'text-[#D48B38]',
      bgPill: 'bg-[#FBF4EA]',
      borderPill: 'border-[#E8DFD4]',
    },
    {
      name: 'Midday Meal',
      sub: 'Lunch (12:00 - 14:30)',
      cals: summary.lunch,
      ideal: Math.round(targetCals * 0.35),
      icon: Sun,
      color: 'text-[#3D5A45]',
      bgPill: 'bg-[#EBF2EC]',
      borderPill: 'border-[#E8DFD4]',
    },
    {
      name: 'Evening Dinner',
      sub: 'Dinner (18:30 - 21:00)',
      cals: summary.dinner,
      ideal: Math.round(targetCals * 0.30),
      icon: Sunset,
      color: 'text-[#C85A32]',
      bgPill: 'bg-[#F7EDE7]',
      borderPill: 'border-[#E8DFD4]',
    },
    {
      name: 'Light Bites',
      sub: 'Anytime Snack',
      cals: summary.snack,
      ideal: Math.round(targetCals * 0.10),
      icon: Moon,
      color: 'text-[#7A6F66]',
      bgPill: 'bg-[#F4EFEB]',
      borderPill: 'border-[#E8DFD4]',
    },
  ];

  return (
    <div className="editorial-card rounded-3xl p-6 sm:p-10 my-12 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[11px] font-sans font-bold tracking-widest text-[#C85A32] uppercase block">
            The Daily Routine
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1715] mt-0.5">
            Circadian Energy & Meal Distribution
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs font-sans text-[#7A6F66] uppercase block font-semibold">Today’s Calorie Ledger</span>
          <span className="text-2xl font-serif font-bold text-[#1A1715]">
            {summary.calories} <span className="text-xs font-sans font-normal text-[#C85A32]">/ {targetCals} kcal</span>
          </span>
        </div>
      </div>

      {/* 4 Phases */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {phases.map((phase) => {
          const Icon = phase.icon;
          const pct = Math.min(100, Math.round((phase.cals / (phase.ideal || 1)) * 100));

          return (
            <div
              key={phase.name}
              className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD4] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${phase.bgPill} border ${phase.borderPill}`}>
                    <Icon className={`w-5 h-5 ${phase.color}`} />
                  </div>
                  <span className="text-xs font-sans text-[#7A6F66]">
                    Ideal: {phase.ideal} kcal
                  </span>
                </div>

                <h4 className="font-serif font-bold text-base text-[#1A1715]">{phase.name}</h4>
                <span className="text-[11px] font-sans text-[#7A6F66] block mb-3">{phase.sub}</span>

                <div className="py-2 border-t border-[#E8DFD4] flex items-baseline justify-between">
                  <span className="text-2xl font-serif font-bold text-[#1A1715]">
                    {phase.cals}{' '}
                    <span className="text-xs font-sans font-normal text-[#7A6F66]">kcal</span>
                  </span>
                  <span className={`text-xs font-sans font-bold ${phase.color}`}>
                    {pct}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#E8DFD4] rounded-full h-1.5 mt-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#C85A32] transition-all duration-500"
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
