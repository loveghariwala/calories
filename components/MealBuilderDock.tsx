'use client';

import React, { useState, useEffect } from 'react';
import { loadTodayLog, getMealSummary } from '@/lib/storage';
import { MealTrackerDrawer } from './MealTrackerDrawer';
import { Sparkles, Utensils, ChevronUp } from 'lucide-react';

export const MealBuilderDock: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    itemCount: 0,
  });
  const [targetCals, setTargetCals] = useState(2000);

  const update = () => {
    const today = loadTodayLog();
    const sum = getMealSummary(today.entries);
    setSummary({
      calories: sum.calories,
      protein: sum.protein,
      carbs: sum.carbs,
      fat: sum.fat,
      itemCount: today.entries.length,
    });
    setTargetCals(today.targets.calories);
  };

  useEffect(() => {
    update();
    const handleUpdate = () => update();
    window.addEventListener('cp_meal_log_updated', handleUpdate);
    window.addEventListener('cp_targets_updated', handleUpdate);
    return () => {
      window.removeEventListener('cp_meal_log_updated', handleUpdate);
      window.removeEventListener('cp_targets_updated', handleUpdate);
    };
  }, []);

  const pct = Math.min(100, Math.round((summary.calories / (targetCals || 1)) * 100));

  return (
    <>
      <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
        <div
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto cursor-pointer bg-white/95 backdrop-blur-md border border-[#E8DFD4] shadow-xl hover:border-[#C85A32] rounded-full p-2 pr-5 flex items-center gap-4 transition-all duration-300 hover:scale-105 group"
        >
          {/* Circular Progress Meter */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#E8DFD4]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#C85A32] transition-all duration-500"
                strokeDasharray={`${pct}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-serif text-[11px] font-bold text-[#1A1715]">
              {pct}%
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div>
              <div className="font-serif text-sm font-bold text-[#1A1715] flex items-baseline gap-1">
                {summary.calories}{' '}
                <span className="text-[10px] font-sans font-normal text-[#7A6F66]">
                  / {targetCals} kcal
                </span>
              </div>
              <div className="text-[10px] font-sans text-[#7A6F66]">
                <span className="text-[#3D5A45] font-semibold">{summary.protein}g P</span> • {summary.carbs}g C • {summary.fat}g F
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-[#E8DFD4] text-xs font-sans font-semibold text-[#C85A32]">
              <span>Journal ({summary.itemCount})</span>
              <ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      <MealTrackerDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
