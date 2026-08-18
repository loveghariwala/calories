import { FoodItem, CategoryMeta, FoodCategory } from '@/types/food';
import { searchLiveUSDA, getLiveUSDAFoodById } from '@/lib/usdaApi';

export const CATEGORY_SLUGS: FoodCategory[] = [
  'meats-poultry',
  'seafood',
  'dairy-eggs',
  'fruits',
  'vegetables',
  'grains-breads',
  'legumes-nuts',
  'fast-food-restaurant',
  'snacks-desserts',
  'beverages',
];

const EMOJI_MAP: Record<string, string> = {
  'meats-poultry': '🥩',
  'seafood': '🐟',
  'dairy-eggs': '🥚',
  'fruits': '🍎',
  'vegetables': '🥦',
  'grains-breads': '🍚',
  'legumes-nuts': '🥜',
  'fast-food-restaurant': '🍔',
  'snacks-desserts': '🍫',
  'beverages': '☕',
};

export function getCategoryMeta(slug: string): CategoryMeta {
  const name = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .replace('And', '&');

  return {
    slug: slug as FoodCategory,
    name,
    emoji: EMOJI_MAP[slug] || '🥗',
    description: `Clinical calories, protein density, and macronutrient breakdowns for ${name} from USDA FoodData Central.`,
    seoTitle: `${name} Calories, Protein & Nutrition Guide | CaloriePulse`,
    seoDescription: `Comprehensive calorie counts, macros, and nutrient distributions for ${name}.`,
    bgGradient: 'from-emerald-500/10 to-teal-500/10',
    accentColor: '#10b981',
    popularTags: ['high-protein', 'low-calorie', 'healthy-fats', 'nutrient-dense'],
  };
}

export const getCategoryBySlug = getCategoryMeta;
export const CATEGORIES: CategoryMeta[] = CATEGORY_SLUGS.map(getCategoryMeta);
export const USDA_CATEGORIES = CATEGORIES;

const dynamicFoodCache: Map<string, FoodItem> = new Map();

export function registerDynamicFood(food: FoodItem) {
  dynamicFoodCache.set(food.slug, food);
  dynamicFoodCache.set(food.id, food);
  if (food.usdaId) {
    dynamicFoodCache.set(`usda-${food.usdaId}`, food);
  }
}

export function getAllFoods(): FoodItem[] {
  const seen = new Set<string>();
  const unique: FoodItem[] = [];
  for (const food of dynamicFoodCache.values()) {
    if (food && food.id && !seen.has(food.id)) {
      seen.add(food.id);
      unique.push(food);
    }
  }
  return unique;
}

export function getFoodBySlug(slug: string): FoodItem | undefined {
  return dynamicFoodCache.get(slug);
}

export function getFoodsByCategory(categorySlug: string): FoodItem[] {
  return getAllFoods().filter((f) => f.category === categorySlug);
}

export function getRelatedFoods(food: FoodItem, limit: number = 4): FoodItem[] {
  const relSlugs = food.relatedSlugs || [];
  const seenIds = new Set<string>([food.id]);
  const result: FoodItem[] = [];

  for (const s of relSlugs) {
    const f = getFoodBySlug(s);
    if (f && !seenIds.has(f.id)) {
      seenIds.add(f.id);
      result.push(f);
    }
  }

  const all = getAllFoods();
  for (const f of all) {
    if (f.category === food.category && !seenIds.has(f.id)) {
      seenIds.add(f.id);
      result.push(f);
      if (result.length >= limit) break;
    }
  }

  return result.slice(0, limit);
}

export function getTopComparisonPairs(): { food1: FoodItem; food2: FoodItem; slug: string }[] {
  const foods = getAllFoods();
  if (foods.length < 2) return [];

  const pairs: { food1: FoodItem; food2: FoodItem; slug: string }[] = [];
  for (let i = 0; i < Math.min(foods.length - 1, 4); i++) {
    const food1 = foods[i];
    const food2 = foods[i + 1];
    pairs.push({
      food1,
      food2,
      slug: `${food1.slug}-vs-${food2.slug}`,
    });
  }
  return pairs;
}
