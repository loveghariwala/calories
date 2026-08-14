import { DailyLog, DailyTargets, MealEntry, MealType } from '@/types/food';

const STORAGE_KEYS = {
  DAILY_LOG_PREFIX: 'cp_log_',
  TARGETS: 'cp_targets',
  UNIT_SYSTEM: 'cp_unit_system',
  RECENT_SEARCHES: 'cp_recent_searches',
  FAVORITES: 'cp_favorites',
};

export const DEFAULT_TARGETS: DailyTargets = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 65,
  waterMl: 2500,
};

export function getTodayKey(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

export function loadDailyTargets(): DailyTargets {
  if (typeof window === 'undefined') return DEFAULT_TARGETS;
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.TARGETS);
    if (saved) {
      return { ...DEFAULT_TARGETS, ...JSON.parse(saved) };
    }
  } catch (err) {
    console.error('Failed to load daily targets', err);
  }
  return DEFAULT_TARGETS;
}

export function saveDailyTargets(targets: DailyTargets): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.TARGETS, JSON.stringify(targets));
    window.dispatchEvent(new Event('cp_targets_updated'));
  } catch (err) {
    console.error('Failed to save daily targets', err);
  }
}

export function loadTodayLog(): DailyLog {
  const dateKey = getTodayKey();
  const targets = loadDailyTargets();
  const defaultLog: DailyLog = {
    date: dateKey,
    entries: [],
    targets,
  };

  if (typeof window === 'undefined') return defaultLog;

  try {
    const saved = localStorage.getItem(`${STORAGE_KEYS.DAILY_LOG_PREFIX}${dateKey}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultLog,
        ...parsed,
        targets,
      };
    }
  } catch (err) {
    console.error('Failed to load today log', err);
  }

  return defaultLog;
}

export function addMealEntry(entry: Omit<MealEntry, 'id' | 'timestamp'>): MealEntry {
  const dateKey = getTodayKey();
  const currentLog = loadTodayLog();
  
  const newEntry: MealEntry = {
    ...entry,
    id: `entry_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
  };

  currentLog.entries.push(newEntry);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`${STORAGE_KEYS.DAILY_LOG_PREFIX}${dateKey}`, JSON.stringify(currentLog));
      window.dispatchEvent(new CustomEvent('cp_meal_log_updated', { detail: currentLog }));
    } catch (err) {
      console.error('Failed to save meal entry', err);
    }
  }

  return newEntry;
}

export function removeMealEntry(entryId: string): void {
  const dateKey = getTodayKey();
  const currentLog = loadTodayLog();

  currentLog.entries = currentLog.entries.filter((e) => e.id !== entryId);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`${STORAGE_KEYS.DAILY_LOG_PREFIX}${dateKey}`, JSON.stringify(currentLog));
      window.dispatchEvent(new CustomEvent('cp_meal_log_updated', { detail: currentLog }));
    } catch (err) {
      console.error('Failed to remove meal entry', err);
    }
  }
}

export function clearTodayLog(): void {
  const dateKey = getTodayKey();
  const targets = loadDailyTargets();
  const freshLog: DailyLog = { date: dateKey, entries: [], targets };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`${STORAGE_KEYS.DAILY_LOG_PREFIX}${dateKey}`, JSON.stringify(freshLog));
      window.dispatchEvent(new CustomEvent('cp_meal_log_updated', { detail: freshLog }));
    } catch (err) {
      console.error('Failed to clear daily log', err);
    }
  }
}

export function getMealSummary(entries: MealEntry[]) {
  return entries.reduce(
    (acc, entry) => {
      acc.calories += entry.calories;
      acc.protein += entry.protein;
      acc.carbs += entry.carbs;
      acc.fat += entry.fat;
      acc.fiber += entry.fiber;
      acc[entry.mealType] = (acc[entry.mealType] || 0) + entry.calories;
      return acc;
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0,
    }
  );
}

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): void {
  if (typeof window === 'undefined' || !query.trim()) return;
  try {
    const recents = getRecentSearches();
    const filtered = [query.trim(), ...recents.filter((q) => q.toLowerCase() !== query.trim().toLowerCase())].slice(0, 8);
    localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to add recent search', err);
  }
}
