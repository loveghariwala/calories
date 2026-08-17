'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Scale,
  Sparkles,
  Search,
  BookOpen,
  Layers,
  Flame,
  Menu,
  X,
} from 'lucide-react';
import { loadTodayLog, getMealSummary } from '@/lib/storage';
import { MealTrackerDrawer } from './MealTrackerDrawer';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [consumedCals, setConsumedCals] = useState(0);
  const [targetCals, setTargetCals] = useState(2000);
  const [proteinGrams, setProteinGrams] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const updateCalories = () => {
    const today = loadTodayLog();
    const sum = getMealSummary(today.entries);
    setConsumedCals(sum.calories);
    setProteinGrams(sum.protein);
    setTargetCals(today.targets.calories);
  };

  useEffect(() => {
    updateCalories();
    const handleUpdate = () => updateCalories();
    window.addEventListener('cp_meal_log_updated', handleUpdate);
    window.addEventListener('cp_targets_updated', handleUpdate);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('cp_meal_log_updated', handleUpdate);
      window.removeEventListener('cp_targets_updated', handleUpdate);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const caloriePct = Math.min(100, Math.round((consumedCals / (targetCals || 1)) * 100));

  const navLinks = [
    { label: 'Directory', href: '/#categories', icon: Layers },
    { label: 'Calculators', href: '/#calculators', icon: Flame },
    { label: 'Food Face-Off', href: '/compare', icon: Scale },
    { label: 'Circadian Timing', href: '/#circadian', icon: Sparkles },
    { label: 'USDA Standards', href: '/#faq', icon: BookOpen },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#') && (pathname === '/' || pathname === '')) {
      e.preventDefault();
      const targetId = href.replace('/#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', href);
      }
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-xl border-b border-[#EAE3D9] shadow-xs'
            : 'bg-[#FAF8F5]/85 backdrop-blur-md border-b border-[#EAE3D9]/70'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          {/* Masthead Brand */}
          <div className="flex items-center gap-4 xl:gap-6 shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C4552D] to-[#9E3915] text-white flex items-center justify-center font-serif text-xl font-bold shadow-md shadow-[#C4552D]/20 group-hover:scale-105 transition-transform shrink-0">
                <span>C</span>
              </div>
              <div className="shrink-0">
                <div className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#181513] flex items-center gap-1 leading-none">
                  Calorie<span className="text-[#C4552D] font-normal italic">Pulse</span>
                </div>
                <div className="flex items-center gap-2 mt-1 whitespace-nowrap">
                  <span className="text-[9px] font-sans font-bold tracking-wider text-[#786C62] uppercase">
                    USDA STUDIO
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#3B5842]" />
                  <span className="text-[9px] font-sans font-bold text-[#3B5842] uppercase tracking-wider">
                    CLINICAL GRADE
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Editorial Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1.5 ml-2 pl-4 border-l border-[#EAE3D9]">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`px-3.5 py-2 rounded-full text-xs font-sans font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-[#C4552D] font-bold border border-[#EAE3D9] shadow-2xs'
                        : 'text-[#786C62] hover:text-[#181513] hover:bg-white/80'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 opacity-70 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Hub: Search Trigger, Live Calorie Telemetry & Journal */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Quick Search Shortcut Trigger */}
            <button
              onClick={() => {
                const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (searchInput) {
                  searchInput.focus();
                  searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                  window.location.href = '/';
                }
              }}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#EAE3D9] hover:border-[#C4552D] text-xs font-sans text-[#786C62] shadow-2xs hover:text-[#181513] transition-all cursor-pointer group whitespace-nowrap"
              title="Focus search input"
            >
              <Search className="w-3.5 h-3.5 text-[#786C62] group-hover:text-[#C4552D] transition-colors shrink-0" />
              <span>Search foods...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-[#FAF8F5] border border-[#EAE3D9] text-[10px] font-mono text-[#786C62]">
                /
              </kbd>
            </button>

            {/* Live Daily Nutrition Telemetry Capsule */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2.5 sm:gap-3 p-1.5 pr-3.5 sm:pr-4 rounded-full bg-white border border-[#EAE3D9] hover:border-[#C4552D] shadow-2xs transition-all cursor-pointer group hover:shadow-xs shrink-0"
              title="Open Daily Meal Tracker Journal"
            >
              {/* Mini Radial Progress Ring */}
              <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#FAF8F5]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#C4552D] transition-all duration-500"
                    strokeDasharray={`${caloriePct}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <Flame className="w-3.5 h-3.5 text-[#C4552D] absolute" />
              </div>

              {/* Calorie & Macro Info */}
              <div className="text-left font-sans leading-tight whitespace-nowrap">
                <div className="text-xs font-bold text-[#181513] flex items-center gap-1">
                  <span>{consumedCals}</span>
                  <span className="text-[10px] text-[#786C62] font-normal">/ {targetCals} kcal</span>
                </div>
                <div className="text-[10px] font-semibold text-[#3B5842]">
                  {proteinGrams}g Protein
                </div>
              </div>

              <div className="hidden sm:block pl-2 border-l border-[#EAE3D9] text-[11px] font-semibold text-[#C4552D] whitespace-nowrap group-hover:translate-x-0.5 transition-transform">
                Journal &rarr;
              </div>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-2xl bg-white border border-[#EAE3D9] text-[#181513] hover:text-[#C4552D] transition-colors cursor-pointer shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-[#EAE3D9] bg-[#FAF8F5] px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    handleNavClick(e, link.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-[#EAE3D9] text-sm font-sans font-semibold text-[#181513] hover:border-[#C4552D] hover:text-[#C4552D] transition-colors"
                >
                  <Icon className="w-4 h-4 text-[#C4552D]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Global Meal Tracker Drawer */}
      <MealTrackerDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};
