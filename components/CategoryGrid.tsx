import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/data/foodDatabase';
import { getAllFoods } from '@/data/foodDatabase';
import { ArrowUpRight } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const allFoods = getAllFoods();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-sans">
      {CATEGORIES.map((cat, idx) => {
        const count = allFoods.filter((f) => f.category === cat.slug).length;

        return (
          <Link key={cat.slug} href={`/category/${cat.slug}`} className="block group">
            <div className="editorial-card rounded-3xl p-5 h-full flex flex-col justify-between hover:border-[#C4552D] transition-all duration-300 cursor-pointer hover:-translate-y-1 shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] shadow-2xs">
                    {cat.emoji}
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#EAE3D9] text-[#786C62] font-semibold">
                    {count > 0 ? `${count} items` : 'USDA Live'}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-[#181513] group-hover:text-[#C4552D] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#786C62] line-clamp-2 mt-1 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-3 mt-4 border-t border-[#EAE3D9] flex items-center justify-between text-xs font-semibold text-[#C4552D]">
                <span>Explore Directory</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
