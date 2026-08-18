'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Flame, Sparkles } from 'lucide-react';

export const RouteLoadingIndicator: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const minTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navStartTimeRef = useRef<number>(0);

  // Complete loading when pathname or query parameters change
  useEffect(() => {
    if (loading) {
      const elapsed = Date.now() - navStartTimeRef.current;
      const minDisplayTime = 380; // Ensure the animation is delightfully visible
      const remaining = Math.max(0, minDisplayTime - elapsed);

      minTimerRef.current = setTimeout(() => {
        setProgress(100);
        setFadeOut(true);
        const hideTimer = setTimeout(() => {
          setLoading(false);
          setProgress(0);
          setFadeOut(false);
        }, 250);
        return () => clearTimeout(hideTimer);
      }, remaining);

      return () => {
        if (minTimerRef.current) clearTimeout(minTimerRef.current);
      };
    }
  }, [pathname, searchParams]);

  // Intercept internal link clicks to trigger animated loading transition
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const isTargetBlank = target.getAttribute('target') === '_blank';
      const isDownload = target.hasAttribute('download');

      // Only trigger for internal route changes
      if (
        href &&
        href.startsWith('/') &&
        !href.startsWith('/#') &&
        !isTargetBlank &&
        !isDownload &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        const currentUrl = window.location.pathname + window.location.search;
        if (href !== currentUrl) {
          navStartTimeRef.current = Date.now();
          setFadeOut(false);
          setLoading(true);
          setProgress(30);

          const t1 = setTimeout(() => setProgress((prev) => (prev < 70 ? 70 : prev)), 120);
          const t2 = setTimeout(() => setProgress((prev) => (prev < 90 ? 90 : prev)), 260);

          return () => {
            clearTimeout(t1);
            clearTimeout(t2);
          };
        }
      }
    };

    document.addEventListener('click', handleAnchorClick, true);
    return () => {
      document.removeEventListener('click', handleAnchorClick, true);
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div
      className={`fixed inset-0 z-99999 pointer-events-none transition-opacity duration-250 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* 1. Top Glowing Neon Progress Beam */}
      <div className="absolute top-0 left-0 right-0 h-[3.5px] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-[#C4552D] via-[#C9822B] to-[#3B5842] shadow-[0_0_16px_rgba(196,85,45,0.9)] transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-0 h-full w-32 bg-white/70 blur-[3px] -translate-x-full transition-all duration-300 pointer-events-none"
          style={{ left: `${progress}%` }}
        />
      </div>

      {/* 2. Frosted Ambient Backdrop with Subtle Warm Tone */}
      <div className="absolute inset-0 bg-[#FAF8F5]/65 backdrop-blur-[3px] transition-all duration-200" />

      {/* 3. Center Animated Laboratory Loading Badge */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Aura */}
          <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-[#C4552D]/20 via-[#C9822B]/20 to-[#3B5842]/20 animate-ping opacity-60" />

          {/* Rotating Orbital Rings */}
          <div className="w-18 h-18 rounded-full border-2 border-[#C4552D]/30 border-t-[#C4552D] animate-spin" />
          <div
            className="absolute w-14 h-14 rounded-full border-2 border-[#3B5842]/30 border-b-[#3B5842] animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}
          />

          {/* Inner Glowing Center Pill */}
          <div className="absolute w-10 h-10 rounded-2xl bg-white shadow-lg border border-[#EAE3D9] flex items-center justify-center">
            <Flame className="w-5 h-5 text-[#C4552D] animate-bounce" />
          </div>
        </div>

        {/* Brand & Loading Label */}
        <div className="text-center space-y-1 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-[#EAE3D9] shadow-lg">
          <div className="flex items-center justify-center gap-1.5 text-xs font-serif font-bold text-[#181513]">
            <span>CaloriePulse</span>
            <Sparkles className="w-3 h-3 text-[#C9822B] animate-pulse" />
          </div>
          <div className="text-[10px] font-sans font-semibold text-[#786C62] uppercase tracking-widest flex items-center justify-center gap-1">
            <span>Calibrating Data</span>
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
};
