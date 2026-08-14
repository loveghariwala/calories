import React from 'react';

export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-pulse font-sans">
      {/* Hero Skeleton */}
      <div className="max-w-4xl mx-auto space-y-6 text-center">
        <div className="h-6 w-48 bg-[#EAE3D9] rounded-full mx-auto" />
        <div className="h-14 w-3/4 bg-[#EAE3D9] rounded-2xl mx-auto" />
        <div className="h-5 w-1/2 bg-[#EAE3D9] rounded-xl mx-auto" />
        <div className="h-12 w-full max-w-xl bg-[#EAE3D9] rounded-full mx-auto" />
      </div>

      {/* Grid Skeleton */}
      <div className="editorial-card rounded-3xl p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div className="h-8 w-64 bg-[#EAE3D9] rounded-xl" />
          <div className="h-8 w-40 bg-[#EAE3D9] rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-[#FAF8F5] border border-[#EAE3D9] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EAE3D9]" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 bg-[#EAE3D9] rounded" />
                  <div className="h-3 w-1/2 bg-[#EAE3D9] rounded" />
                </div>
              </div>
              <div className="h-10 bg-[#EAE3D9] rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
