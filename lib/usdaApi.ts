import { FoodItem, NutrientInfo, ServingOption, FoodCategory } from '@/types/food';
import { getFoodImageUrl } from '@/lib/foodImages';

const USDA_API_BASE = 'https://api.nal.usda.gov/fdc/v1';

export const getUSDAApiKey = (): string =>
  process.env.USDA_API_KEY || "";

// USDA Official Nutrient Number & Nutrient ID Mappings
const NUTRIENT_IDS = {
  CALORIES: [1008, 2047, 2048, 1062], // Energy (kcal / kJ)
  PROTEIN: [1003],                    // Protein (g)
  FAT: [1004],                        // Total lipid (fat) (g)
  CARBS: [1005],                      // Carbohydrate, by difference (g)
  FIBER: [1079],                      // Fiber, total dietary (g)
  SUGAR: [2000],                      // Sugars, total including NLEA (g)
  SAT_FAT: [1258],                    // Fatty acids, total saturated (g)
  TRANS_FAT: [1257],                  // Fatty acids, total trans (g)
  CHOLESTEROL: [1253],                // Cholesterol (mg)
  SODIUM: [1093],                     // Sodium, Na (mg)
  POTASSIUM: [1092],                  // Potassium, K (mg)
  CALCIUM: [1087],                    // Calcium, Ca (mg)
  IRON: [1089],                       // Iron, Fe (mg)
  VITAMIN_A: [1104, 1106],            // Vitamin A (IU / RAE mcg)
  VITAMIN_C: [1162],                  // Vitamin C, total ascorbic acid (mg)
  VITAMIN_D: [1114],                  // Vitamin D (D2 + D3) (mcg)
};

export interface USDANutrientNested {
  id?: number;
  number?: string;
  name?: string;
  unitName?: string;
}

export interface USDAFoodNutrient {
  nutrientId?: number;
  nutrientName?: string;
  nutrientNumber?: string;
  unitName?: string;
  value?: number;
  amount?: number;
  nutrient?: USDANutrientNested;
}

export interface USDARawFoodItem {
  fdcId: number;
  description: string;
  dataType?: string;
  brandOwner?: string;
  brandName?: string;
  foodCategory?: string;
  brandedFoodCategory?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  householdServingFullText?: string;
  foodNutrients?: USDAFoodNutrient[];
  ingredients?: string;
  publicationDate?: string;
  publishedDate?: string;
}

export interface USDASearchResponse {
  totalHits: number;
  currentPage: number;
  totalPages: number;
  foods: USDARawFoodItem[];
}

export interface USDASearchParams {
  query?: string;
  dataType?: string[] | string;
  pageSize?: number;
  pageNumber?: number;
  sortBy?: 'dataType.keyword' | 'lowercaseDescription.keyword' | 'fdcId' | 'publishedDate';
  sortOrder?: 'asc' | 'desc';
  brandOwner?: string;
}

/**
 * Extract nutrient value matching nutrient IDs or nutrient names
 */
function extractNutrient(
  nutrients: USDAFoodNutrient[],
  ids: number[],
  fallbackName?: string
): number {
  if (Array.isArray(nutrients) && nutrients.length > 0) {
    const foundById = nutrients.find((n) => {
      const id = n.nutrientId ?? n.nutrient?.id;
      return id !== undefined && ids.includes(id);
    });

    if (foundById !== undefined) {
      const val = foundById.value ?? foundById.amount ?? 0;
      return Math.round(Number(val) * 10) / 10;
    }

    if (fallbackName) {
      const lowerFallback = fallbackName.toLowerCase();
      const foundByName = nutrients.find((n) => {
        const name = (n.nutrientName ?? n.nutrient?.name ?? '').toLowerCase();
        return name.includes(lowerFallback);
      });
      if (foundByName !== undefined) {
        const val = foundByName.value ?? foundByName.amount ?? 0;
        return Math.round(Number(val) * 10) / 10;
      }
    }
  }

  return 0;
}

/**
 * Assign appropriate emoji for food item
 */
function assignEmoji(name: string, category: string): string {
  const lower = `${name} ${category}`.toLowerCase();
  if (lower.includes('chicken') || lower.includes('poultry')) return '🍗';
  if (lower.includes('beef') || lower.includes('steak') || lower.includes('meat')) return '🥩';
  if (lower.includes('salmon') || lower.includes('fish') || lower.includes('tuna') || lower.includes('seafood')) return '🐟';
  if (lower.includes('shrimp') || lower.includes('prawn') || lower.includes('crab') || lower.includes('lobster')) return '🦐';
  if (lower.includes('egg')) return '🥚';
  if (lower.includes('cheese')) return '🧀';
  if (lower.includes('milk') || lower.includes('yogurt') || lower.includes('dairy')) return '🥛';
  if (lower.includes('apple')) return '🍎';
  if (lower.includes('banana')) return '🍌';
  if (lower.includes('strawberry')) return '🍓';
  if (lower.includes('blueberry') || lower.includes('blackberry') || lower.includes('berry')) return '🫐';
  if (lower.includes('orange') || lower.includes('citrus') || lower.includes('lemon')) return '🍊';
  if (lower.includes('avocado')) return '🥑';
  if (lower.includes('broccoli')) return '🥦';
  if (lower.includes('salad') || lower.includes('spinach') || lower.includes('kale') || lower.includes('lettuce')) return '🥗';
  if (lower.includes('rice') || lower.includes('grain')) return '🍚';
  if (lower.includes('bread') || lower.includes('toast') || lower.includes('bagel')) return '🍞';
  if (lower.includes('oat') || lower.includes('cereal') || lower.includes('porridge')) return '🥣';
  if (lower.includes('nut') || lower.includes('almond') || lower.includes('peanut') || lower.includes('walnut')) return '🥜';
  if (lower.includes('potato')) return '🥔';
  if (lower.includes('coffee')) return '☕';
  if (lower.includes('tea')) return '🍵';
  if (lower.includes('chocolate') || lower.includes('cookie') || lower.includes('cake') || lower.includes('candy')) return '🍫';
  if (lower.includes('burger') || lower.includes('pizza') || lower.includes('fast food')) return '🍔';
  return '🥗';
}

/**
 * Map USDA category strings to unified FoodCategory
 */
function mapCategory(usdaCat?: string): { category: FoodCategory; name: string } {
  const lower = (usdaCat || '').toLowerCase();
  if (lower.includes('poultry') || lower.includes('meat') || lower.includes('beef') || lower.includes('pork') || lower.includes('lamb')) {
    return { category: 'meats-poultry', name: 'Meats & Poultry' };
  }
  if (lower.includes('fish') || lower.includes('seafood') || lower.includes('finfish') || lower.includes('shellfish') || lower.includes('salmon')) {
    return { category: 'seafood', name: 'Fish & Seafood' };
  }
  if (lower.includes('dairy') || lower.includes('egg') || lower.includes('milk') || lower.includes('cheese') || lower.includes('yogurt')) {
    return { category: 'dairy-eggs', name: 'Dairy & Eggs' };
  }
  if (lower.includes('fruit') || lower.includes('berry') || lower.includes('citrus') || lower.includes('juice')) {
    return { category: 'fruits', name: 'Fresh Fruits' };
  }
  if (lower.includes('vegetable') || lower.includes('green') || lower.includes('salad') || lower.includes('legume')) {
    return { category: 'vegetables', name: 'Vegetables & Greens' };
  }
  if (lower.includes('grain') || lower.includes('cereal') || lower.includes('pasta') || lower.includes('bread') || lower.includes('baked') || lower.includes('bakery')) {
    return { category: 'grains-breads', name: 'Grains & Complex Carbs' };
  }
  if (lower.includes('nut') || lower.includes('seed') || lower.includes('bean')) {
    return { category: 'legumes-nuts', name: 'Legumes, Nuts & Seeds' };
  }
  if (lower.includes('restaurant') || lower.includes('fast food') || lower.includes('pizza') || lower.includes('burger')) {
    return { category: 'fast-food-restaurant', name: 'Fast Food & Dining' };
  }
  if (lower.includes('beverage') || lower.includes('drink') || lower.includes('coffee') || lower.includes('tea') || lower.includes('soda')) {
    return { category: 'beverages', name: 'Beverages & Teas' };
  }
  return { category: 'snacks-desserts', name: 'Snacks & Clean Treats' };
}

/**
 * Transform raw USDA item into unified FoodItem schema
 */
export function transformUSDAItemToFoodItem(item: USDARawFoodItem): FoodItem {
  const nutrients = item.foodNutrients || [];
  const rawCat = item.foodCategory || item.brandedFoodCategory || '';
  const cat = mapCategory(rawCat);

  // Extract base nutrients from official USDA foodNutrients array
  const calories = Math.round(extractNutrient(nutrients, NUTRIENT_IDS.CALORIES, 'energy'));
  const protein = extractNutrient(nutrients, NUTRIENT_IDS.PROTEIN, 'protein');
  const fat = extractNutrient(nutrients, NUTRIENT_IDS.FAT, 'total lipid');
  const carbohydrates = extractNutrient(nutrients, NUTRIENT_IDS.CARBS, 'carbohydrate');
  const fiber = extractNutrient(nutrients, NUTRIENT_IDS.FIBER, 'fiber');
  const sugar = extractNutrient(nutrients, NUTRIENT_IDS.SUGAR, 'sugar');
  const saturatedFat = extractNutrient(nutrients, NUTRIENT_IDS.SAT_FAT, 'saturated');
  const transFat = extractNutrient(nutrients, NUTRIENT_IDS.TRANS_FAT, 'trans');
  const cholesterol = extractNutrient(nutrients, NUTRIENT_IDS.CHOLESTEROL, 'cholesterol');
  const sodium = extractNutrient(nutrients, NUTRIENT_IDS.SODIUM, 'sodium');
  const potassium = extractNutrient(nutrients, NUTRIENT_IDS.POTASSIUM, 'potassium');
  const calcium = extractNutrient(nutrients, NUTRIENT_IDS.CALCIUM, 'calcium');
  const iron = extractNutrient(nutrients, NUTRIENT_IDS.IRON, 'iron');
  const vitaminA = extractNutrient(nutrients, NUTRIENT_IDS.VITAMIN_A, 'vitamin a');
  const vitaminC = extractNutrient(nutrients, NUTRIENT_IDS.VITAMIN_C, 'vitamin c');
  const vitaminD = extractNutrient(nutrients, NUTRIENT_IDS.VITAMIN_D, 'vitamin d');

  const nutrientsPer100g: NutrientInfo = {
    calories,
    protein,
    carbohydrates,
    fat,
    fiber,
    sugar,
    saturatedFat,
    transFat,
    cholesterol,
    sodium,
    potassium,
    calcium,
    iron,
    vitaminA,
    vitaminC,
    vitaminD,
  };

  const cleanName = (item.description || 'Unknown Specimen')
    .toLowerCase()
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(', ');

  const slug = `usda-${item.fdcId}-${cleanName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')}`;

  const servingGramWeight = item.servingSize || 100;
  const servingLabel =
    item.householdServingFullText ||
    (item.servingSize ? `${item.servingSize} ${item.servingSizeUnit || 'g'}` : '1 Standard Serving (100g)');

  const servings: ServingOption[] = [
    {
      label: servingLabel,
      weightGrams: servingGramWeight,
      isDefault: true,
    },
    {
      label: '100 Grams (Laboratory Reference Standard)',
      weightGrams: 100,
    },
  ];

  const tags: string[] = ['usda-live', cat.category];
  if (protein >= 15 || (protein * 4) / (calories || 1) >= 0.25) tags.push('high-protein');
  if (carbohydrates - fiber <= 5) tags.push('keto', 'low-carb');
  if (calories <= 80 && calories > 0) tags.push('low-calorie');
  if (fiber >= 4) tags.push('high-fiber');

  return {
    id: `usda-${item.fdcId}`,
    usdaId: String(item.fdcId),
    fdcId: item.fdcId,
    slug,
    name: cleanName,
    brand: item.brandOwner || item.brandName || (item.dataType ? `USDA ${item.dataType}` : 'USDA FoodData Central'),
    emoji: assignEmoji(cleanName, cat.name),
    imageUrl: getFoodImageUrl(cleanName, cat.category),
    category: cat.category,
    categoryName: cat.name,
    description: `Official USDA FoodData Central profile for ${cleanName}. Contains ${calories} kcal, ${protein}g protein, ${carbohydrates}g carbs, and ${fat}g fat per 100g.`,
    tags,
    nutrientsPer100g,
    servings,
    relatedSlugs: [],
  };
}

/**
 * 1. Search USDA FoodData Central API (/foods/search)
 */
export async function searchUSDA(params: USDASearchParams = {}): Promise<{
  totalHits: number;
  currentPage: number;
  totalPages: number;
  foods: FoodItem[];
}> {
  try {
    const apiKey = getUSDAApiKey();
    const url = new URL(`${USDA_API_BASE}/foods/search`);
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('query', params.query || '*');
    url.searchParams.set('pageSize', String(params.pageSize || 25));
    url.searchParams.set('pageNumber', String(params.pageNumber || 1));

    if (params.dataType) {
      const dt = Array.isArray(params.dataType) ? params.dataType.join(',') : params.dataType;
      url.searchParams.set('dataType', dt);
    }
    if (params.sortBy) {
      url.searchParams.set('sortBy', params.sortBy);
    }
    if (params.sortOrder) {
      url.searchParams.set('sortOrder', params.sortOrder);
    }
    if (params.brandOwner) {
      url.searchParams.set('brandOwner', params.brandOwner);
    }

    const res = await fetch(url.toString(), {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      console.warn(`USDA Search API responded with status ${res.status}: ${res.statusText}`);
      return { totalHits: 0, currentPage: 1, totalPages: 0, foods: [] };
    }

    const data: USDASearchResponse = await res.json();
    const rawFoods = data.foods || [];
    const foods = rawFoods.map(transformUSDAItemToFoodItem);

    return {
      totalHits: data.totalHits || foods.length,
      currentPage: data.currentPage || 1,
      totalPages: data.totalPages || Math.ceil((data.totalHits || 0) / (params.pageSize || 25)),
      foods,
    };
  } catch (error) {
    console.error('Error querying USDA Search API:', error);
    return { totalHits: 0, currentPage: 1, totalPages: 0, foods: [] };
  }
}

/**
 * 2. Get Single Food by FDC ID (/food/{fdcId})
 */
export async function getFoodByFdcId(fdcId: string | number): Promise<FoodItem | null> {
  const cleanId = String(fdcId).replace(/^usda-/, '').split('-')[0];
  if (!cleanId || !/^\d+$/.test(cleanId)) return null;

  try {
    const apiKey = getUSDAApiKey();
    const url = `${USDA_API_BASE}/food/${cleanId}?api_key=${apiKey}&format=full`;

    const res = await fetch(url, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      console.warn(`USDA Food details API responded with status ${res.status}`);
      return null;
    }

    const data: USDARawFoodItem = await res.json();
    return transformUSDAItemToFoodItem(data);
  } catch (error) {
    console.error(`Error fetching food ${fdcId} from USDA API:`, error);
    return null;
  }
}

/**
 * 3. Get Paged Food List (/foods/list)
 */
export async function listUSDAFoods(
  pageNumber: number = 1,
  pageSize: number = 25,
  dataType?: string
): Promise<FoodItem[]> {
  try {
    const apiKey = getUSDAApiKey();
    const url = new URL(`${USDA_API_BASE}/foods/list`);
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('pageNumber', String(pageNumber));
    url.searchParams.set('pageSize', String(pageSize));
    if (dataType) {
      url.searchParams.set('dataType', dataType);
    }

    const res = await fetch(url.toString(), {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return [];
    }

    const data: USDARawFoodItem[] = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map(transformUSDAItemToFoodItem);
  } catch (error) {
    console.error('Error fetching foods list from USDA API:', error);
    return [];
  }
}

/**
 * Backward compatibility helpers for existing pages
 */
export async function searchLiveUSDA(query: string, pageSize: number = 10): Promise<FoodItem[]> {
  const res = await searchUSDA({ query, pageSize });
  return res.foods;
}

export async function getLiveUSDAFoodById(fdcId: string | number): Promise<FoodItem | null> {
  return getFoodByFdcId(fdcId);
}

export async function getLiveUSDAList(pageNumber: number = 1, pageSize: number = 25, dataType?: string): Promise<FoodItem[]> {
  return listUSDAFoods(pageNumber, pageSize, dataType);
}
