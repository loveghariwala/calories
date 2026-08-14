import { FoodItem, NutrientInfo, ServingOption, FoodCategory } from '@/types/food';

const USDA_API_BASE = 'https://api.nal.usda.gov/fdc/v1';
const USDA_API_KEY = process.env.USDA_API_KEY || process.env.NEXT_PUBLIC_USDA_API_KEY || 'DEMO_KEY';

// USDA Nutrient Number / ID Mappings
const NUTRIENT_IDS = {
  CALORIES: [1008, 2047, 2048], // Energy (kcal)
  PROTEIN: [1003],              // Protein (g)
  FAT: [1004],                  // Total lipid (fat) (g)
  CARBS: [1005],                // Carbohydrate, by difference (g)
  FIBER: [1079],                // Fiber, total dietary (g)
  SUGAR: [2000],                // Sugars, total including NLEA (g)
  SAT_FAT: [1258],              // Fatty acids, total saturated (g)
  CHOLESTEROL: [1253],          // Cholesterol (mg)
  SODIUM: [1093],               // Sodium, Na (mg)
  POTASSIUM: [1092],            // Potassium, K (mg)
  CALCIUM: [1087],              // Calcium, Ca (mg)
  IRON: [1089],                 // Iron, Fe (mg)
  VITAMIN_C: [1162],            // Vitamin C, total ascorbic acid (mg)
  VITAMIN_D: [1114],            // Vitamin D (D2 + D3) (mcg)
};

interface USDAFoodNutrient {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber?: string;
  unitName: string;
  value: number;
}

interface USDAFoodSearchItem {
  fdcId: number;
  description: string;
  dataType?: string;
  brandOwner?: string;
  brandName?: string;
  foodCategory?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  householdServingFullText?: string;
  foodNutrients: USDAFoodNutrient[];
}

/**
 * Extract nutrient value by matching USDA nutrient IDs
 */
function extractNutrient(nutrients: USDAFoodNutrient[], ids: number[]): number {
  const found = nutrients.find((n) => ids.includes(n.nutrientId));
  return found ? Math.round(found.value * 10) / 10 : 0;
}

/**
 * Assign a smart emoji based on food name and category
 */
function assignEmoji(name: string, category: string): string {
  const lower = (name + ' ' + category).toLowerCase();
  if (lower.includes('chicken') || lower.includes('poultry')) return '🍗';
  if (lower.includes('beef') || lower.includes('steak')) return '🥩';
  if (lower.includes('salmon') || lower.includes('fish') || lower.includes('tuna')) return '🐟';
  if (lower.includes('shrimp') || lower.includes('prawn')) return '🦐';
  if (lower.includes('egg')) return '🥚';
  if (lower.includes('milk') || lower.includes('yogurt') || lower.includes('cheese')) return '🥛';
  if (lower.includes('apple')) return '🍎';
  if (lower.includes('banana')) return '🍌';
  if (lower.includes('berry') || lower.includes('blueberry') || lower.includes('strawberry')) return '🫐';
  if (lower.includes('avocado')) return '🥑';
  if (lower.includes('broccoli')) return '🥦';
  if (lower.includes('spinach') || lower.includes('kale') || lower.includes('salad')) return '🥗';
  if (lower.includes('rice') || lower.includes('grain')) return '🍚';
  if (lower.includes('bread') || lower.includes('toast')) return '🍞';
  if (lower.includes('oat') || lower.includes('cereal')) return '🥣';
  if (lower.includes('nut') || lower.includes('almond') || lower.includes('peanut')) return '🥜';
  if (lower.includes('potato') || lower.includes('sweet potato')) return '🥔';
  if (lower.includes('coffee')) return '☕';
  if (lower.includes('tea')) return '🍵';
  if (lower.includes('chocolate')) return '🍫';
  return '🥗';
}

/**
 * Map USDA category name to our clean FoodCategory
 */
function mapCategory(usdaCat?: string): { category: FoodCategory; name: string } {
  const lower = (usdaCat || '').toLowerCase();
  if (lower.includes('poultry') || lower.includes('meat') || lower.includes('beef') || lower.includes('pork')) {
    return { category: 'meats-poultry', name: 'Meats & Poultry' };
  }
  if (lower.includes('fish') || lower.includes('seafood') || lower.includes('finfish') || lower.includes('shellfish')) {
    return { category: 'seafood', name: 'Fish & Seafood' };
  }
  if (lower.includes('dairy') || lower.includes('egg') || lower.includes('milk') || lower.includes('cheese')) {
    return { category: 'dairy-eggs', name: 'Dairy & Eggs' };
  }
  if (lower.includes('fruit') || lower.includes('berry') || lower.includes('citrus')) {
    return { category: 'fruits', name: 'Fresh Fruits' };
  }
  if (lower.includes('vegetable') || lower.includes('green') || lower.includes('salad')) {
    return { category: 'vegetables', name: 'Vegetables & Greens' };
  }
  if (lower.includes('grain') || lower.includes('cereal') || lower.includes('pasta') || lower.includes('bread') || lower.includes('baked')) {
    return { category: 'grains-breads', name: 'Grains & Complex Carbs' };
  }
  if (lower.includes('nut') || lower.includes('seed') || lower.includes('legume') || lower.includes('bean')) {
    return { category: 'legumes-nuts', name: 'Legumes, Nuts & Seeds' };
  }
  if (lower.includes('restaurant') || lower.includes('fast food')) {
    return { category: 'fast-food-restaurant', name: 'Fast Food & Dining' };
  }
  if (lower.includes('beverage') || lower.includes('drink') || lower.includes('coffee') || lower.includes('tea')) {
    return { category: 'beverages', name: 'Beverages & Teas' };
  }
  return { category: 'snacks-desserts', name: 'Snacks & Clean Treats' };
}

/**
 * Transform USDA API Search Item into unified FoodItem
 */
export function transformUSDAItemToFoodItem(item: USDAFoodSearchItem): FoodItem {
  const nutrients = item.foodNutrients || [];
  const cat = mapCategory(item.foodCategory);

  const calories = Math.round(extractNutrient(nutrients, NUTRIENT_IDS.CALORIES));
  const protein = extractNutrient(nutrients, NUTRIENT_IDS.PROTEIN);
  const fat = extractNutrient(nutrients, NUTRIENT_IDS.FAT);
  const carbohydrates = extractNutrient(nutrients, NUTRIENT_IDS.CARBS);
  const fiber = extractNutrient(nutrients, NUTRIENT_IDS.FIBER);
  const sugar = extractNutrient(nutrients, NUTRIENT_IDS.SUGAR);
  const saturatedFat = extractNutrient(nutrients, NUTRIENT_IDS.SAT_FAT);
  const cholesterol = extractNutrient(nutrients, NUTRIENT_IDS.CHOLESTEROL);
  const sodium = extractNutrient(nutrients, NUTRIENT_IDS.SODIUM);
  const potassium = extractNutrient(nutrients, NUTRIENT_IDS.POTASSIUM);
  const calcium = extractNutrient(nutrients, NUTRIENT_IDS.CALCIUM);
  const iron = extractNutrient(nutrients, NUTRIENT_IDS.IRON);
  const vitaminC = extractNutrient(nutrients, NUTRIENT_IDS.VITAMIN_C);
  const vitaminD = extractNutrient(nutrients, NUTRIENT_IDS.VITAMIN_D);

  const nutrientsPer100g: NutrientInfo = {
    calories,
    protein,
    carbohydrates,
    fat,
    fiber,
    sugar,
    saturatedFat,
    cholesterol,
    sodium,
    potassium,
    calcium,
    iron,
    vitaminC,
    vitaminD,
  };

  // Clean description name
  const cleanName = item.description
    .toLowerCase()
    .split(',')
    .map((s) => s.trim())
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(', ');

  const slug = `usda-${item.fdcId}-${cleanName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')}`;

  const servings: ServingOption[] = [
    {
      label: item.householdServingFullText || (item.servingSize ? `${item.servingSize} ${item.servingSizeUnit || 'g'}` : '1 Standard Serving'),
      weightGrams: item.servingSize || 100,
      isDefault: true,
    },
    {
      label: '100 Grams (Laboratory Standard)',
      weightGrams: 100,
    },
  ];

  const tags: string[] = ['usda-live', cat.category];
  if (protein >= 15 || (protein * 4) / (calories || 1) >= 0.25) tags.push('high-protein');
  if (carbohydrates - fiber <= 5) tags.push('keto', 'low-carb');
  if (calories <= 80) tags.push('low-calorie');
  if (fiber >= 4) tags.push('high-fiber');

  return {
    id: `usda-${item.fdcId}`,
    usdaId: String(item.fdcId),
    slug,
    name: cleanName,
    brand: item.brandOwner || item.brandName || 'USDA FoodData Central',
    emoji: assignEmoji(cleanName, cat.name),
    category: cat.category,
    categoryName: cat.name,
    description: `Official USDA FoodData Central profile for ${cleanName}. Contains ${calories} kcal and ${protein}g protein per 100g.`,
    tags,
    nutrientsPer100g,
    servings,
    relatedSlugs: [],
  };
}

/**
 * Query Live USDA FoodData Central API
 */
export async function searchLiveUSDA(
  query: string,
  pageSize: number = 10
): Promise<FoodItem[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = new URL(`${USDA_API_BASE}/foods/search`);
    url.searchParams.set('api_key', USDA_API_KEY);
    url.searchParams.set('query', query.trim());
    url.searchParams.set('pageSize', String(pageSize));
    url.searchParams.set('dataType', 'Foundation,SR Legacy,Survey (FNDDS)');

    const res = await fetch(url.toString(), {
      next: { revalidate: 86400 }, // Cache USDA response for 24 hours
    });

    if (!res.ok) {
      console.warn(`USDA API responded with status ${res.status}: ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    if (!data.foods || !Array.isArray(data.foods)) return [];

    return data.foods.map(transformUSDAItemToFoodItem);
  } catch (error) {
    console.error('Error fetching from live USDA FoodData Central API:', error);
    return [];
  }
}

/**
 * Fetch a single food item by USDA FDC ID
 */
export async function getLiveUSDAFoodById(fdcId: string | number): Promise<FoodItem | null> {
  const cleanId = String(fdcId).replace(/^usda-/, '');
  try {
    const url = `${USDA_API_BASE}/food/${cleanId}?api_key=${USDA_API_KEY}`;
    const res = await fetch(url, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return transformUSDAItemToFoodItem(data);
  } catch (error) {
    console.error(`Error fetching food item ${fdcId} from USDA API:`, error);
    return null;
  }
}
