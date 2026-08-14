'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Food3DAsset } from '@/components/Food3DAsset';
import { RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Runtime Error:', error);
  }, [error]);

  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 text-center font-sans">
      <div className="max-w-md w-full editorial-card rounded-3xl p-8 sm:p-12 space-y-6 shadow-xl">
        <div className="flex justify-center">
          <div className="p-4 rounded-3xl bg-[#FDF2EE] border border-[#F2C5B3] shadow-xs">
            <Food3DAsset name="Steak" type="steak" size={80} />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#C4552D]">
            Error 500 • Telemetry Interruption
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#181513]">
            Something Went Wrong
          </h1>
          <p className="text-xs sm:text-sm text-[#786C62] leading-relaxed">
            Our nutrition studio encountered an unexpected calculation error. You can try refreshing or return to the main studio.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#C4552D] hover:bg-[#A03E1B] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#EAE3D9] text-[#181513] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-2xs"
          >
            <Home className="w-4 h-4" />
            <span>Return to Studio</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
