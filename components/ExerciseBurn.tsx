'use client';

import React from 'react';
import { Footprints, Flame, Bike, Waves, Dumbbell, Clock } from 'lucide-react';

interface ExerciseBurnProps {
  calories: number;
}

export const ExerciseBurn: React.FC<ExerciseBurnProps> = ({ calories }) => {
  const activities = [
    {
      name: 'Brisk Walking',
      burnRatePerMin: 4.5,
      icon: Footprints,
      color: 'text-[#3D5A45]',
      bg: 'bg-[#EBF2EC]',
    },
    {
      name: 'Outdoor Running',
      burnRatePerMin: 11.5,
      icon: Flame,
      color: 'text-[#C85A32]',
      bg: 'bg-[#F7EDE7]',
    },
    {
      name: 'Cycling',
      burnRatePerMin: 8.5,
      icon: Bike,
      color: 'text-[#D48B38]',
      bg: 'bg-[#FBF4EA]',
    },
    {
      name: 'Swimming',
      burnRatePerMin: 9.5,
      icon: Waves,
      color: 'text-[#2C4030]',
      bg: 'bg-[#EBF2EC]',
    },
    {
      name: 'Strength Training',
      burnRatePerMin: 6.0,
      icon: Dumbbell,
      color: 'text-[#7A6F66]',
      bg: 'bg-[#FAF7F2]',
    },
  ];

  return (
    <div className="editorial-card rounded-3xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#C85A32] block">
            Physical Activity Equivalent
          </span>
          <h4 className="font-serif text-lg font-bold text-[#1A1715] mt-0.5">
            Estimated Burn Duration ({calories} kcal)
          </h4>
        </div>
        <span className="text-xs font-sans text-[#7A6F66]">70kg / 154 lbs Adult</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {activities.map((act) => {
          const minutes = Math.max(1, Math.round(calories / act.burnRatePerMin));
          const Icon = act.icon;

          return (
            <div
              key={act.name}
              className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD4] flex flex-col items-center justify-between text-center group hover:border-[#C85A32] transition-colors"
            >
              <div className={`p-3 rounded-2xl ${act.bg} border border-[#E8DFD4] mb-2`}>
                <Icon className={`w-5 h-5 ${act.color}`} />
              </div>

              <div>
                <span className="text-xs font-sans text-[#7A6F66] block font-medium">
                  {act.name}
                </span>
                <div className="text-xl font-serif font-bold text-[#1A1715] mt-1">
                  {minutes} <span className="text-xs font-sans font-normal text-[#7A6F66]">min</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
