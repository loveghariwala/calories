'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface MacroChartProps {
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  totalCalories: number;
}

const COLORS = {
  protein: '#3D5A45', // Matcha Olive
  carbs: '#D48B38', // Warm Gold
  fat: '#C85A32', // Terracotta
};

export const MacroChart: React.FC<MacroChartProps> = ({
  proteinGrams,
  carbsGrams,
  fatGrams,
  totalCalories,
}) => {
  const proteinCal = proteinGrams * 4;
  const carbsCal = carbsGrams * 4;
  const fatCal = fatGrams * 9;
  const sumCal = proteinCal + carbsCal + fatCal || 1;

  const proteinPct = Math.round((proteinCal / sumCal) * 100);
  const carbsPct = Math.round((carbsCal / sumCal) * 100);
  const fatPct = Math.max(0, 100 - proteinPct - carbsPct);

  const data = [
    { name: 'Protein', value: proteinCal, grams: proteinGrams, pct: proteinPct, color: COLORS.protein },
    { name: 'Carbs', value: carbsCal, grams: carbsGrams, pct: carbsPct, color: COLORS.carbs },
    { name: 'Fat', value: fatCal, grams: fatGrams, pct: fatPct, color: COLORS.fat },
  ].filter((d) => d.grams > 0);

  return (
    <div className="editorial-card rounded-3xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#C85A32]">
          Macronutrient Spectrum
        </h4>
        <span className="text-xs font-sans text-[#7A6F66]">Atwater 4/4/9</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Donut Chart */}
        <div className="relative w-44 h-44 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.length ? data : [{ name: 'Empty', value: 1, color: '#E8DFD4' }]}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                paddingAngle={data.length > 1 ? 4 : 0}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, name: any, item: any) => [
                  `${item.payload.grams}g (${item.payload.pct}%)`,
                  item.payload.name,
                ]}
                contentStyle={{
                  backgroundColor: '#FAF7F2',
                  borderColor: '#E8DFD4',
                  borderRadius: '1rem',
                  color: '#1A1715',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Energy Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-serif font-bold text-[#1A1715] leading-none">
              {totalCalories}
            </span>
            <span className="text-[10px] font-sans font-semibold text-[#C85A32] uppercase tracking-widest mt-1">
              kcal
            </span>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="flex-1 w-full space-y-4">
          {/* Protein */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5 font-sans">
              <span className="font-semibold text-[#3D5A45] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3D5A45] inline-block" />
                Protein ({proteinPct}%)
              </span>
              <span className="font-bold text-[#1A1715]">
                {proteinGrams}g <span className="text-[#7A6F66] font-normal">({Math.round(proteinCal)} kcal)</span>
              </span>
            </div>
            <div className="w-full bg-[#E8DFD4] rounded-full h-2 overflow-hidden">
              <div className="bg-[#3D5A45] h-full rounded-full transition-all duration-500" style={{ width: `${proteinPct}%` }} />
            </div>
          </div>

          {/* Carbs */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5 font-sans">
              <span className="font-semibold text-[#D48B38] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D48B38] inline-block" />
                Carbohydrates ({carbsPct}%)
              </span>
              <span className="font-bold text-[#1A1715]">
                {carbsGrams}g <span className="text-[#7A6F66] font-normal">({Math.round(carbsCal)} kcal)</span>
              </span>
            </div>
            <div className="w-full bg-[#E8DFD4] rounded-full h-2 overflow-hidden">
              <div className="bg-[#D48B38] h-full rounded-full transition-all duration-500" style={{ width: `${carbsPct}%` }} />
            </div>
          </div>

          {/* Fat */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5 font-sans">
              <span className="font-semibold text-[#C85A32] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C85A32] inline-block" />
                Lipids / Fat ({fatPct}%)
              </span>
              <span className="font-bold text-[#1A1715]">
                {fatGrams}g <span className="text-[#7A6F66] font-normal">({Math.round(fatCal)} kcal)</span>
              </span>
            </div>
            <div className="w-full bg-[#E8DFD4] rounded-full h-2 overflow-hidden">
              <div className="bg-[#C85A32] h-full rounded-full transition-all duration-500" style={{ width: `${fatPct}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
