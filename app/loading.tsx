import React from 'react';
import { Flame, Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-99999 flex flex-col items-center justify-center bg-[#FAF8F5]/80 backdrop-blur-sm font-sans select-none">
      {/* 1. Center Animated Laboratory Badge */}
      <div className="flex flex-col items-center gap-4 animate-in fade-in duration-200">
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Aura */}
          <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-[#C4552D]/20 via-[#C9822B]/20 to-[#3B5842]/20 animate-ping opacity-60" />

          {/* Rotating Dual Orbit Rings */}
          <div className="w-20 h-20 rounded-full border-2 border-[#C4552D]/30 border-t-[#C4552D] animate-spin" />
          <div
            className="absolute w-16 h-16 rounded-full border-2 border-[#3B5842]/30 border-b-[#3B5842] animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}
          />

          {/* Inner Glowing Pill */}
          <div className="absolute w-11 h-11 rounded-2xl bg-white shadow-xl border border-[#EAE3D9] flex items-center justify-center">
            <Flame className="w-6 h-6 text-[#C4552D] animate-bounce" />
          </div>
        </div>

        {/* Loading Description */}
        <div className="text-center space-y-1.5 bg-white/95 backdrop-blur-md px-6 py-3 rounded-2xl border border-[#EAE3D9] shadow-xl">
          <div className="flex items-center justify-center gap-1.5 text-sm font-serif font-bold text-[#181513]">
            <span>CaloriePulse</span>
            <Sparkles className="w-3.5 h-3.5 text-[#C9822B] animate-pulse" />
          </div>
          <div className="text-xs font-sans font-semibold text-[#786C62] uppercase tracking-widest flex items-center justify-center gap-1">
            <span>Retrieving USDA Specimen</span>
            <span className="inline-flex">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
