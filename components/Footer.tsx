import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/data/foodDatabase';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#EAE3D9] bg-[#FAF8F5] text-[#786C62] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-white border border-[#EAE3D9] shadow-2xs group-hover:scale-105 transition-transform p-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.jpg"
                  alt="CaloriePulse Logo"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <span className="font-serif text-xl font-bold text-[#181513]">
                Calorie<span className="text-[#C4552D] italic font-normal">Pulse</span>
              </span>
            </Link>
            <p className="text-xs text-[#786C62] leading-relaxed max-w-sm">
              A thoughtful, ad-free whole food calorie directory, clinical TDEE calculator, and daily nutritional journal powered by official USDA FoodData Central.
            </p>
            <div className="pt-1 text-[11px] font-sans text-[#3B5842] font-semibold">
              ● USDA Agricultural Research Service • 2026 Reference Edition
            </div>
          </div>

          {/* High-Intent SEO Calculators & Guides */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#181513] uppercase tracking-wider">
              Calculators &amp; Guides
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/anti-inflammatory-diet" className="hover:text-[#C4552D] font-medium transition-colors">
                  🛡️ Anti-Inflammatory Diet
                </Link>
              </li>
              <li>
                <Link href="/calorie-calculator" className="hover:text-[#C4552D] font-medium transition-colors">
                  🔥 Calorie Calculator
                </Link>
              </li>
              <li>
                <Link href="/low-calorie-snacks" className="hover:text-[#C4552D] font-medium transition-colors">
                  🍎 Low Calorie Snacks
                </Link>
              </li>
              <li>
                <Link href="/low-calorie-meals" className="hover:text-[#C4552D] font-medium transition-colors">
                  🥗 Low Calorie Meals
                </Link>
              </li>
              <li>
                <Link href="/what-is-calorie-deficit" className="hover:text-[#C4552D] font-medium transition-colors">
                  📖 What is Calorie Deficit?
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-[#C4552D] font-medium transition-colors">
                  ⚖️ Food Face-Off Arena
                </Link>
              </li>
            </ul>
          </div>

          {/* Food Categories Column 1 */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#181513] uppercase tracking-wider">
              Whole Food Groups
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-[#C4552D] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Food Categories Column 2 */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#181513] uppercase tracking-wider">
              More Food Groups
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(5).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-[#C4552D] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}

            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#EAE3D9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#786C62]">
          <div className="flex flex-wrap items-center gap-4">
            <span>&copy; {new Date().getFullYear()} CaloriePulse.</span>
            <Link href="/about" className="hover:text-[#C4552D] transition-colors">
              About Us
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-[#C4552D] transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#C4552D] transition-colors">
              Terms of Service
            </Link>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#786C62]">
            Nutritional data curated from <span className="font-semibold text-[#181513]">USDA FoodData Central</span>.
          </div>
        </div>
      </div>
    </footer>
  );
};
