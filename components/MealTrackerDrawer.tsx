'use client';

import React, { useState, useEffect } from 'react';
import { MealEntry, MealType, DailyTargets } from '@/types/food';
import {
  loadTodayLog,
  removeMealEntry,
  clearTodayLog,
  getMealSummary,
  saveDailyTargets,
} from '@/lib/storage';
import { X, Trash2, Sliders, Check, Copy, Utensils } from 'lucide-react';

interface MealTrackerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MealTrackerDrawer: React.FC<MealTrackerDrawerProps> = ({ isOpen, onClose }) => {
  const [entries, setEntries] = useState<MealEntry[]>([]);
  const [targets, setTargets] = useState<DailyTargets>({
    calories: 2000,
    protein: 180,
    carbs: 300,
    fat: 75,
  });
  const [isEditingTargets, setIsEditingTargets] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadData = () => {
    const today = loadTodayLog();
    setEntries(today.entries);
    setTargets(today.targets);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = () => loadData();
    window.addEventListener('cp_meal_log_updated', handleUpdate);
    return () => window.removeEventListener('cp_meal_log_updated', handleUpdate);
  }, []);

  if (!isOpen) return null;

  const summary = getMealSummary(entries);

  const handleDelete = (id: string) => {
    removeMealEntry(id);
    loadData();
  };

  const handleClearAll = () => {
    if (window.confirm('Reset all daily entries in local journal?')) {
      clearTodayLog();
      loadData();
    }
  };

  const handleSaveTargets = (e: React.FormEvent) => {
    e.preventDefault();
    saveDailyTargets(targets);
    setIsEditingTargets(false);
  };

  const copyMealLog = () => {
    const text = `CaloriePulse Daily Nourishment Ledger
Energy: ${summary.calories} / ${targets.calories} kcal
Protein: ${summary.protein}g / ${targets.protein}g
Carbs: ${summary.carbs}g / ${targets.carbs}g
Fat: ${summary.fat}g / ${targets.fat}g

Logged Entries (${entries.length}):
${entries.map((e) => `- ${e.name} (${e.servingLabel}): ${e.calories} kcal | ${e.protein}P ${e.carbs}C ${e.fat}F`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mealSections: { type: MealType; title: string }[] = [
    { type: 'breakfast', title: 'Morning Table' },
    { type: 'lunch', title: 'Midday Meal' },
    { type: 'dinner', title: 'Evening Dinner' },
    { type: 'snack', title: 'Light Bites & Recovery' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#EAE3D9] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#EAE3D9] bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C4552D]" />
              <h3 className="font-serif font-bold text-xl text-[#181513]">
                Daily Nourishment Ledger
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#FAF8F5] text-[#786C62] hover:text-[#181513] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Daily Progress Ledger */}
          <div className="p-6 bg-white border-b border-[#EAE3D9] space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#786C62]">
                  Daily Energy Intake
                </span>
                <div className="text-3xl font-serif font-bold text-[#181513] leading-none mt-1">
                  {summary.calories.toLocaleString()}{' '}
                  <span className="text-sm text-[#786C62] font-normal">/ {targets.calories} kcal</span>
                </div>
              </div>

              <button
                onClick={() => setIsEditingTargets(!isEditingTargets)}
                className="text-xs font-semibold text-[#C4552D] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                {isEditingTargets ? 'Done' : 'Target Presets'}
              </button>
            </div>

            {/* Quick Macro Goal Presets */}
            {isEditingTargets ? (
              <div className="pt-2 border-t border-[#EAE3D9] space-y-3">
                <div className="text-[11px] font-bold text-[#786C62] uppercase tracking-wider">
                  Select Nutrition Protocol Preset:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const newT = { calories: 1800, protein: 180, carbs: 155, fat: 50 };
                      setTargets(newT);
                      saveDailyTargets(newT);
                    }}
                    className="p-2.5 rounded-xl border border-[#EAE3D9] bg-[#FAF8F5] hover:border-[#C4552D] text-left transition-colors cursor-pointer"
                  >
                    <div className="font-serif font-bold text-xs text-[#181513]">🏃 Fat Loss Cut</div>
                    <div className="text-[10px] text-[#786C62]">1,800 kcal • 180g P / 155g C / 50g F</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const newT = { calories: 2600, protein: 195, carbs: 325, fat: 60 };
                      setTargets(newT);
                      saveDailyTargets(newT);
                    }}
                    className="p-2.5 rounded-xl border border-[#EAE3D9] bg-[#FAF8F5] hover:border-[#C4552D] text-left transition-colors cursor-pointer"
                  >
                    <div className="font-serif font-bold text-xs text-[#181513]">🏋️ Hypertrophy</div>
                    <div className="text-[10px] text-[#786C62]">2,600 kcal • 195g P / 325g C / 60g F</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const newT = { calories: 2000, protein: 125, carbs: 25, fat: 155 };
                      setTargets(newT);
                      saveDailyTargets(newT);
                    }}
                    className="p-2.5 rounded-xl border border-[#EAE3D9] bg-[#FAF8F5] hover:border-[#C4552D] text-left transition-colors cursor-pointer"
                  >
                    <div className="font-serif font-bold text-xs text-[#181513]">🥑 Keto Protocol</div>
                    <div className="text-[10px] text-[#786C62]">2,000 kcal • 125g P / 25g C / 155g F</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const newT = { calories: 2200, protein: 165, carbs: 220, fat: 73 };
                      setTargets(newT);
                      saveDailyTargets(newT);
                    }}
                    className="p-2.5 rounded-xl border border-[#EAE3D9] bg-[#FAF8F5] hover:border-[#C4552D] text-left transition-colors cursor-pointer"
                  >
                    <div className="font-serif font-bold text-xs text-[#181513]">⚖️ Balanced Health</div>
                    <div className="text-[10px] text-[#786C62]">2,200 kcal • 165g P / 220g C / 73g F</div>
                  </button>
                </div>

                <form onSubmit={handleSaveTargets} className="grid grid-cols-2 gap-2 pt-2 border-t border-[#EAE3D9]">
                  <div>
                    <label className="text-[10px] text-[#786C62] font-semibold">Custom Cal:</label>
                    <input
                      type="number"
                      value={targets.calories}
                      onChange={(e) => setTargets({ ...targets, calories: Number(e.target.value) })}
                      className="w-full p-2 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl text-xs font-bold text-[#181513]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#786C62] font-semibold">Custom Prot (g):</label>
                    <input
                      type="number"
                      value={targets.protein}
                      onChange={(e) => setTargets({ ...targets, protein: Number(e.target.value) })}
                      className="w-full p-2 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl text-xs font-bold text-[#181513]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="col-span-2 py-2 bg-[#C4552D] text-white rounded-xl text-xs font-bold mt-1 cursor-pointer"
                  >
                    Save Custom Target
                  </button>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9]">
                  <span className="block text-[10px] text-[#3B5842] uppercase font-bold">Protein</span>
                  <span className="font-bold text-base text-[#181513]">{summary.protein}g</span>
                  <span className="text-[10px] text-[#786C62] block">/ {targets.protein}g</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9]">
                  <span className="block text-[10px] text-[#C9822B] uppercase font-bold">Carbs</span>
                  <span className="font-bold text-base text-[#181513]">{summary.carbs}g</span>
                  <span className="text-[10px] text-[#786C62] block">/ {targets.carbs}g</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9]">
                  <span className="block text-[10px] text-[#C4552D] uppercase font-bold">Fat</span>
                  <span className="font-bold text-base text-[#181513]">{summary.fat}g</span>
                  <span className="text-[10px] text-[#786C62] block">/ {targets.fat}g</span>
                </div>
              </div>
            )}
          </div>

          {/* Meal List Entries */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {entries.length === 0 ? (
              <div className="text-center py-12 space-y-2 text-xs text-[#786C62]">
                <Utensils className="w-8 h-8 text-[#9C8E82] mx-auto mb-2 opacity-50" />
                <div className="font-semibold text-sm text-[#181513]">No foods logged yet today</div>
                <div>Add foods from the tasting bar or food cards above.</div>
              </div>
            ) : (
              mealSections.map(({ type, title }) => {
                const mealEntries = entries.filter((e) => e.mealType === type);
                if (mealEntries.length === 0) return null;

                const mealCals = mealEntries.reduce((sum, e) => sum + e.calories, 0);

                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between pb-1 border-b border-[#EAE3D9] text-xs">
                      <span className="font-serif font-bold text-[#181513]">{title}</span>
                      <span className="font-bold text-[#C4552D]">{mealCals} kcal</span>
                    </div>

                    <div className="space-y-2">
                      {mealEntries.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#EAE3D9] text-xs shadow-2xs"
                        >
                          <div>
                            <div className="font-bold text-[#181513]">{item.name}</div>
                            <div className="text-[10px] text-[#786C62]">
                              {item.servingLabel} • {item.protein}P {item.carbs}C {item.fat}F
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-bold text-[#181513]">{item.calories} kcal</span>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-[#786C62] hover:text-[#C4552D] transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-5 bg-white border-t border-[#EAE3D9] flex items-center justify-between gap-3">
            <button
              onClick={copyMealLog}
              disabled={entries.length === 0}
              className="flex-1 py-2.5 rounded-full bg-[#C4552D] hover:bg-[#A03E1B] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard' : 'Export Journal'}
            </button>

            {entries.length > 0 && (
              <button
                onClick={handleClearAll}
                className="p-2.5 rounded-full border border-[#EAE3D9] text-[#786C62] hover:text-[#C4552D] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                title="Reset log"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
