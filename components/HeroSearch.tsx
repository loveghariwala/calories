'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import { getAllFoods } from '@/data/foodDatabase';
import { FoodItem } from '@/types/food';
import { Search, Flame, ArrowRight, Sparkles, X, ChevronRight, Database, Loader2 } from 'lucide-react';
import Link from 'next/link';

export const HeroSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const allFoods = getAllFoods();

  const fuse = useRef(
    new Fuse(allFoods, {
      keys: [
        { name: 'name', weight: 0.6 },
        { name: 'tags', weight: 0.25 },
        { name: 'categoryName', weight: 0.15 },
      ],
      threshold: 0.35,
    })
  );

  // Instant local search + Debounced Live USDA API fetch
  useEffect(() => {
    if (query.trim().length > 1) {
      // 1. Instant local search (0ms)
      const localMatches = fuse.current.search(query.trim()).slice(0, 5).map((r) => r.item);
      setResults(localMatches);
      setIsOpen(true);
      setSelectedIndex(-1);

      // 2. Debounced Live USDA API query (pulls from 300,000+ USDA database)
      setIsLoadingLive(true);
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`/api/foods/search?q=${encodeURIComponent(query.trim())}&limit=10`);
          if (res.ok) {
            const data = await res.json();
            if (data.results && Array.isArray(data.results)) {
              setResults(data.results.slice(0, 8));
            }
          }
        } catch (err) {
          console.warn('Live USDA API fetch failed:', err);
        } finally {
          setIsLoadingLive(false);
        }
      }, 250);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsOpen(false);
      setIsLoadingLive(false);
    }
  }, [query]);

  // Keyboard shortcut '/' to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const selected = results[selectedIndex];
      router.push(`/food/${selected.slug}`);
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full font-sans" ref={dropdownRef}>
      {/* Luxury Search Input Bar */}
      <div className="relative flex items-center">
        <div className="absolute left-4.5 sm:left-5 text-[#786C62] pointer-events-none">
          {isLoadingLive ? (
            <Loader2 className="w-5 h-5 text-[#C4552D] animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-[#786C62]" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length > 1 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search 300,000+ foods (e.g., 'Chicken Breast', 'Avocado', 'Salmon')..."
          className="w-full pl-12 sm:pl-13 pr-24 py-4 sm:py-4.5 rounded-full bg-white border border-[#EAE3D9] text-[#181513] placeholder-[#786C62] text-sm sm:text-base font-sans outline-none focus:border-[#C4552D] focus:ring-4 focus:ring-[#C4552D]/10 transition-all shadow-md"
          aria-label="Search USDA Whole Foods"
        />

        <div className="absolute right-3.5 flex items-center gap-1.5">
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsOpen(false);
              }}
              className="p-1 rounded-full hover:bg-[#FAF8F5] text-[#786C62] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#EAE3D9] text-[11px] font-mono text-[#786C62]">
            <Database className="w-3 h-3 text-[#3B5842]" />
            <span>Live USDA</span>
          </div>
        </div>
      </div>

      {/* Live Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#EAE3D9] rounded-3xl shadow-2xl overflow-hidden z-50 animate-in fade-in-50 duration-150 text-left">
          {results.length > 0 ? (
            <div className="p-2 space-y-1 max-h-[380px] overflow-y-auto">
              <div className="px-3.5 py-1.5 flex items-center justify-between text-[10px] font-sans font-bold text-[#786C62] uppercase tracking-wider border-b border-[#FAF8F5]">
                <span>Matching USDA Whole Foods</span>
                <span className="text-[#3B5842] flex items-center gap-1">
                  <Database className="w-3 h-3" /> FoodData Central API
                </span>
              </div>

              {results.map((food, idx) => {
                const isSelected = idx === selectedIndex;
                const defServing = food.servings.find((s) => s.isDefault) || food.servings[0];
                const ratio = (defServing ? defServing.weightGrams : 100) / 100;
                const cals = Math.round(food.nutrientsPer100g.calories * ratio);
                const prot = Math.round(food.nutrientsPer100g.protein * ratio * 10) / 10;

                return (
                  <Link
                    key={food.id}
                    href={`/food/${food.slug}`}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                      isSelected
                        ? 'bg-[#FDF2EE] border border-[#F2C5B3]'
                        : 'hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl p-2 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] shrink-0">
                        {food.emoji}
                      </span>
                      <div className="min-w-0">
                        <div className="font-serif font-bold text-sm text-[#181513] truncate">
                          {food.name}
                        </div>
                        <div className="text-[11px] text-[#786C62] flex items-center gap-2">
                          <span>{food.categoryName}</span>
                          <span>•</span>
                          <span>{defServing ? defServing.label : '100g'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-3">
                      <div className="text-sm font-bold text-[#181513] flex items-center justify-end gap-1">
                        <span>{cals}</span>
                        <span className="text-[10px] text-[#C4552D] font-normal">kcal</span>
                      </div>
                      <div className="text-[11px] text-[#3B5842] font-semibold">
                        {prot}g Protein
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center space-y-2">
              <div className="text-2xl">🔍</div>
              <div className="font-serif font-bold text-base text-[#181513]">
                No exact USDA matches for &ldquo;{query}&rdquo;
              </div>
              <div className="text-xs text-[#786C62]">
                Try searching for whole ingredient names like &ldquo;Eggs&rdquo;, &ldquo;Oats&rdquo;, or &ldquo;Tuna&rdquo;.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
