export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type FoodCategory =
  | 'meats-poultry'
  | 'seafood'
  | 'dairy-eggs'
  | 'fruits'
  | 'vegetables'
  | 'grains-breads'
  | 'legumes-nuts'
  | 'fast-food-restaurant'
  | 'snacks-desserts'
  | 'beverages';

export interface NutrientInfo {
  // Core Macros (per 100g)
  calories: number; // kcal
  protein: number; // g
  carbohydrates: number; // g
  fat: number; // g
  fiber: number; // g
  sugar: number; // g
  saturatedFat?: number; // g
  transFat?: number; // g
  cholesterol?: number; // mg
  sodium?: number; // mg
  potassium?: number; // mg
  
  // Micronutrients & Vitamins (% DV or mg per 100g)
  calcium?: number; // mg
  iron?: number; // mg
  vitaminA?: number; // mcg
  vitaminC?: number; // mg
  vitaminD?: number; // mcg
}

export interface ServingOption {
  label: string; // e.g. "1 medium (118g)", "1 cup chopped (150g)", "1 breast (172g)", "100g"
  weightGrams: number; // Weight in grams
  isDefault?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FoodItem {
  id: string; // unique identifier
  usdaId?: string; // USDA FoodData Central ID e.g. "8841"
  slug: string; // URL friendly slug e.g. "grilled-chicken-breast"
  name: string; // Display name e.g. "Grilled Chicken Breast"
  brand?: string; // Optional brand e.g. "USDA Standard", "Chipotle", "Starbucks"
  emoji: string; // Visual icon/emoji e.g. "🍗", "🥑"
  category: FoodCategory;
  categoryName: string; // e.g. "Meats & Poultry"
  description: string; // SEO description
  tags: string[]; // e.g. ["high-protein", "keto", "low-carb", "gluten-free", "breakfast"]
  
  // Advanced Health Intelligence & Satiety Metrics
  healthScore?: number; // 0 - 100
  healthGrade?: 'S+' | 'S' | 'A' | 'B' | 'C';
  glycemicIndex?: 'Low' | 'Medium' | 'High' | 'Zero';
  satietyIndex?: 'Extreme' | 'High' | 'Moderate' | 'Low';
  
  // Base nutrients strictly per 100g
  nutrientsPer100g: NutrientInfo;
  
  // Serving size options
  servings: ServingOption[];
  
  // Pre-generated SEO FAQs for People Also Ask (PAA)
  faqs?: FAQItem[];
  
  // Related food slugs for programmatic interlinking
  relatedSlugs?: string[];
  
  // Data source
  fdcId?: number; // USDA FoodData Central ID if applicable
  dataType?: 'SR Legacy' | 'Survey (FNDDS)' | 'Foundation Foods' | 'Branded';
}

export interface MealEntry {
  id: string; // unique entry id
  foodId: string;
  name: string;
  emoji: string;
  mealType: MealType;
  servingLabel: string;
  weightGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  timestamp: number;
}

export interface DailyTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMl?: number;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  entries: MealEntry[];
  targets: DailyTargets;
}

export interface CategoryMeta {
  slug: FoodCategory;
  name: string;
  emoji: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  bgGradient: string;
  accentColor: string;
  popularTags: string[];
}
