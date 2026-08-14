'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sliders, Check, X, ArrowLeft, Lock, Cookie, Database } from 'lucide-react';

interface ConsentPreferences {
  essential: boolean;
  mealJournal: boolean;
  macroTargets: boolean;
  performance: boolean;
}

const CONSENT_STORAGE_KEY = 'cp_cookie_consent_preferences';

export const CookieConsentModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    essential: true,
    mealJournal: true,
    macroTargets: true,
    performance: false,
  });

  useEffect(() => {
    // Check if consent has already been given
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) {
      // Delay slightly for smooth page entry
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    } else {
      try {
        setPreferences(JSON.parse(stored));
      } catch (e) {
        setIsVisible(true);
      }
    }
  }, []);

  const saveAndClose = (prefs: ConsentPreferences) => {
    setPreferences(prefs);
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(prefs));
    setIsVisible(false);
    setIsCustomizeOpen(false);
  };

  const handleAcceptAll = () => {
    saveAndClose({
      essential: true,
      mealJournal: true,
      macroTargets: true,
      performance: true,
    });
  };

  const handleRejectAll = () => {
    saveAndClose({
      essential: true,
      mealJournal: false,
      macroTargets: false,
      performance: false,
    });
  };

  const handleSaveCustom = () => {
    saveAndClose(preferences);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* ========================================== */}
      {/* 1. BOTTOM FLOATING CONSENT BANNER */}
      {/* ========================================== */}
      {!isCustomizeOpen && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xl z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="editorial-card rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#EAE3D9] bg-[#FAF8F5]/98 backdrop-blur-xl space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-2xl bg-[#EBF2EC] text-[#3B5842] flex items-center justify-center shrink-0 mt-0.5">
                <Database className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-sm sm:text-base text-[#181513]">
                    Local Storage &amp; Privacy Notice
                  </h4>
                  <span className="text-[9px] font-sans font-bold px-2 py-0.5 rounded-full bg-[#EBF2EC] text-[#3B5842] uppercase tracking-wider">
                    Client-Side Only
                  </span>
                </div>
                <p className="text-xs text-[#786C62] leading-relaxed">
                  We use your browser&apos;s <strong>LocalStorage</strong> to save your daily meal logs and custom calorie targets securely on your personal device. No names, emails, or personal tracking cookies are ever collected or sent to external servers.
                </p>
              </div>
            </div>

            {/* Action Buttons: Accept, Reject, Customize */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#EAE3D9]/70">
              <button
                type="button"
                onClick={() => setIsCustomizeOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-sans font-bold text-[#786C62] hover:text-[#181513] hover:bg-white border border-[#EAE3D9] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Customize</span>
              </button>

              <button
                type="button"
                onClick={handleRejectAll}
                className="px-3.5 py-2 rounded-xl text-xs font-sans font-bold text-[#786C62] hover:text-[#C4552D] hover:bg-white border border-[#EAE3D9] transition-all cursor-pointer"
              >
                Reject Non-Essential
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-4 py-2 rounded-xl text-xs font-sans font-bold text-white bg-[#C4552D] hover:bg-[#A03E1B] shadow-2xs transition-all cursor-pointer"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. INTERACTIVE CUSTOMIZE MODAL DIALOG */}
      {/* ========================================== */}
      {isCustomizeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="editorial-card rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl bg-[#FAF8F5] border border-[#EAE3D9] space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D9]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EBF2EC] text-[#3B5842] flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#181513]">
                    Storage Preferences
                  </h3>
                  <p className="text-[11px] text-[#786C62]">Configure device-level local storage</p>
                </div>
              </div>

              <button
                onClick={() => setIsCustomizeOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white text-[#786C62] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Toggle List */}
            <div className="space-y-4 text-left">
              {/* Essential Storage */}
              <div className="p-4 rounded-2xl bg-white border border-[#EAE3D9] flex items-start justify-between gap-4 shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-[#181513]">
                      Essential Studio Engine
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#EAE3D9] text-[#786C62] uppercase">
                      Required
                    </span>
                  </div>
                  <p className="text-xs text-[#786C62] leading-relaxed">
                    Necessary for interactive whole food portion calibration, kitchen scale unit toggles, and UI themes.
                  </p>
                </div>
                <div className="p-1 rounded-full bg-[#EBF2EC] text-[#3B5842] shrink-0">
                  <Check className="w-4 h-4" />
                </div>
              </div>

              {/* Daily Meal Journal Toggle */}
              <div className="p-4 rounded-2xl bg-white border border-[#EAE3D9] flex items-start justify-between gap-4 shadow-2xs">
                <div className="space-y-1">
                  <span className="font-serif font-bold text-sm text-[#181513] block">
                    Daily Meal Journal Logs
                  </span>
                  <p className="text-xs text-[#786C62] leading-relaxed">
                    Stores your daily logged breakfast, lunch, dinner, and snack entries in your browser&apos;s localStorage.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={preferences.mealJournal}
                    onChange={(e) =>
                      setPreferences({ ...preferences, mealJournal: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-[#EAE3D9] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#EAE3D9] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B5842]" />
                </label>
              </div>

              {/* Macro & Calorie Targets Toggle */}
              <div className="p-4 rounded-2xl bg-white border border-[#EAE3D9] flex items-start justify-between gap-4 shadow-2xs">
                <div className="space-y-1">
                  <span className="font-serif font-bold text-sm text-[#181513] block">
                    Custom Macro &amp; TDEE Targets
                  </span>
                  <p className="text-xs text-[#786C62] leading-relaxed">
                    Remembers your personalized daily calorie goals, protein gram minimums, and diet protocol settings.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={preferences.macroTargets}
                    onChange={(e) =>
                      setPreferences({ ...preferences, macroTargets: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-[#EAE3D9] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#EAE3D9] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B5842]" />
                </label>
              </div>

              {/* Anonymous Performance */}
              <div className="p-4 rounded-2xl bg-white border border-[#EAE3D9] flex items-start justify-between gap-4 shadow-2xs">
                <div className="space-y-1">
                  <span className="font-serif font-bold text-sm text-[#181513] block">
                    Performance Telemetry
                  </span>
                  <p className="text-xs text-[#786C62] leading-relaxed">
                    Anonymous client-side metrics to help us optimize whole food 3D render speeds and search indexing.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={preferences.performance}
                    onChange={(e) =>
                      setPreferences({ ...preferences, performance: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-[#EAE3D9] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#EAE3D9] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B5842]" />
                </label>
              </div>
            </div>

            {/* Bottom Actions: Save Preferences & Back */}
            <div className="flex items-center justify-between pt-4 border-t border-[#EAE3D9]">
              <button
                type="button"
                onClick={() => setIsCustomizeOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-sans font-bold text-[#786C62] hover:text-[#181513] hover:bg-white border border-[#EAE3D9] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleSaveCustom}
                className="px-6 py-2.5 rounded-xl text-xs font-sans font-bold text-white bg-[#C4552D] hover:bg-[#A03E1B] shadow-2xs transition-all cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
