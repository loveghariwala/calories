'use client';

import React, { useState, useMemo } from 'react';
import { FoodItem } from '@/types/food';
import { FoodCard } from './FoodCard';
import { Sparkles, Flame, ShieldCheck, Dumbbell, Zap } from 'lucide-react';

interface FoodGridWithFiltersProps {
  initialFoods: FoodItem[];
  title: string;
  subtitle: string;
  categoryLink?: string;
  categoryLinkText?: string;
  emojiIcon?: string;
}

type FilterKey = 'all' | 'high-protein' | 'keto' | 'low-calorie' | 'high-fiber';

export const FoodGridWithFilters: React.FC<FoodGridWithFiltersProps> = ({
  initialFoods,
  title,
  subtitle,
  categoryLink,
  categoryLinkText,
  emojiIcon = '🍗',
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filters: { key: FilterKey; label: string; icon: any }[] = [
    { key: 'all', label: 'All Items', icon: Sparkles },
    { key: 'high-protein', label: 'High Protein (>20g)', icon: Dumbbell },
    { key: 'keto', label: 'Keto / Low Carb (<5g)', icon: ShieldCheck },
    { key: 'low-calorie', label: 'Low Calorie (<120 kcal)', icon: Flame },
    { key: 'high-fiber', label: 'Fiber-Rich (>4g)', icon: Zap },
  ];

  const filteredFoods = useMemo(() => {
    if (!initialFoods || !Array.isArray(initialFoods)) return [];
    return initialFoods.filter((food) => {
      const n = food.nutrientsPer100g || { calories: 0, protein: 0, carbohydrates: 0, fat: 0 };
      if (activeFilter === 'high-protein') return (n.protein || 0) >= 18;
      if (activeFilter === 'keto') return (n.carbohydrates || 0) <= 6;
      if (activeFilter === 'low-calorie') return (n.calories || 0) <= 120;
      if (activeFilter === 'high-fiber') return (n.fiber || 0) >= 3.5;
      return true;
    });
  }, [initialFoods, activeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-[#3B5842]">
            {subtitle}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513] mt-0.5 flex items-center gap-2.5">
            <span>{emojiIcon}</span> {title}
          </h2>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {filters.map((f) => {
            const Icon = f.icon;
            const isSelected = activeFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#181513] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#786C62] hover:text-[#181513] hover:bg-[#F4EFEB] border border-[#EAE3D9]'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {filteredFoods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-[#FAF8F5] border border-[#EAE3D9] rounded-3xl text-sm text-[#786C62]">
          No whole foods found matching this exact filter criteria.
        </div>
      )}
    </div>
  );
};
