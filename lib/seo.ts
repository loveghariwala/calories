import { FoodItem, CategoryMeta } from '@/types/food';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://caloriepulse.vercel.app';
export const SITE_NAME = 'CaloriePulse';
export const SITE_TAGLINE = 'Instant Food Calorie Lookup, USDA Nutrition Facts & Daily Macro Tracker';

/**
 * Generate absolute canonical URL
 */
export function getCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Generate high-CTR dynamic SEO Title for a Food Item
 * Modeled after top authority structures (FDA Nutrition Facts + WebMD Calorie Counts)
 * Keeps strictly within 50-65 chars for Google SERP
 */
export function generateFoodMetaTitle(food: FoodItem): string {
  const defaultServing = food.servings.find((s) => s.isDefault) || food.servings[0];
  const ratio = (defaultServing ? defaultServing.weightGrams : 100) / 100;
  const cals = Math.round(food.nutrientsPer100g.calories * ratio);
  const prot = Math.round(food.nutrientsPer100g.protein * ratio * 10) / 10;
  const netCarbs = Math.max(0, Math.round((food.nutrientsPer100g.carbohydrates - (food.nutrientsPer100g.fiber || 0)) * ratio * 10) / 10);
  const servingLabel = defaultServing ? defaultServing.label : '100g';

  const isHighProtein = (food.nutrientsPer100g.protein * 4) / (food.nutrientsPer100g.calories || 1) >= 0.25 || food.nutrientsPer100g.protein >= 12;
  const isKeto = (food.nutrientsPer100g.carbohydrates - (food.nutrientsPer100g.fiber || 0)) <= 5 && food.nutrientsPer100g.fat >= 5;
  const isLowCal = food.nutrientsPer100g.calories <= 55;

  let title = '';
  if (isHighProtein && prot > 0) {
    title = `${food.name} Calories, Protein (${prot}g) & Nutrition Facts | ${SITE_NAME}`;
  } else if (isKeto) {
    title = `${food.name} Calories, Net Carbs (${netCarbs}g) & Nutrition Facts | ${SITE_NAME}`;
  } else if (isLowCal) {
    title = `${food.name} Calories (${cals} kcal) & Weight Loss Nutrition Facts | ${SITE_NAME}`;
  } else {
    title = `${food.name} Calories & Nutrition Facts Label (${servingLabel}) | ${SITE_NAME}`;
  }

  // Optimize for SERP width (max 65 chars)
  if (title.length > 65) {
    title = `${food.name} Calories & Nutrition Facts (${servingLabel}) | ${SITE_NAME}`;
  }
  if (title.length > 65) {
    title = `${food.name} Calories & Macro Counts | ${SITE_NAME}`;
  }

  return title;
}

/**
 * Generate high-CTR dynamic SEO Description for a Food Item
 * Target: 145-155 chars with exact numbers for maximum click-through rate
 */
export function generateFoodMetaDescription(food: FoodItem): string {
  const defaultServing = food.servings.find((s) => s.isDefault) || food.servings[0];
  const ratio = (defaultServing ? defaultServing.weightGrams : 100) / 100;
  
  const cals = Math.round(food.nutrientsPer100g.calories * ratio);
  const prot = Math.round(food.nutrientsPer100g.protein * ratio * 10) / 10;
  const carbs = Math.round(food.nutrientsPer100g.carbohydrates * ratio * 10) / 10;
  const fat = Math.round(food.nutrientsPer100g.fat * ratio * 10) / 10;
  const netCarbs = Math.max(0, Math.round((food.nutrientsPer100g.carbohydrates - (food.nutrientsPer100g.fiber || 0)) * ratio * 10) / 10);
  const serving = defaultServing ? defaultServing.label : '100g';

  return `There are ${cals} calories in ${food.name} (${serving}). Full USDA nutrition facts label: ${prot}g protein, ${carbs}g carbs (${netCarbs}g net carbs), ${fat}g fat & exercise burn time.`;
}

/**
 * Generate Category SEO Title
 * Modeled after WebMD's #1 ranking "Calorie Chart: Common Foods and Their Counts"
 */
export function generateCategoryMetaTitle(categoryName: string, count?: number): string {
  const countSuffix = count && count > 0 ? ` (${count}+ Foods)` : '';
  const title = `Calorie Chart: ${categoryName} Foods & Their Counts${countSuffix} | ${SITE_NAME}`;
  if (title.length > 65) {
    return `Calorie Chart: ${categoryName} Foods & Counts | ${SITE_NAME}`;
  }
  return title;
}

/**
 * Generate Category SEO Description
 */
export function generateCategoryMetaDescription(categoryName: string, count?: number, avgCalories?: number, description?: string): string {
  const countPrefix = count ? `${count}+ ` : '';
  const avgText = avgCalories ? ` (averaging ${avgCalories} kcal per 100g)` : '';
  return `Browse our complete ${countPrefix}${categoryName} calorie chart and counts. Check calories in ${categoryName.toLowerCase()}, protein density, and USDA nutrition facts${avgText}.`;
}

/**
 * Generate Comparison SEO Title
 */
export function generateComparisonMetaTitle(food1: FoodItem, food2: FoodItem): string {
  const title = `${food1.name} vs ${food2.name}: Calories & Protein Comparison | ${SITE_NAME}`;
  if (title.length > 65) {
    return `${food1.name} vs ${food2.name} Calories & Macros | ${SITE_NAME}`;
  }
  return title;
}

/**
 * Generate Comparison SEO Description
 */
export function generateComparisonMetaDescription(food1: FoodItem, food2: FoodItem): string {
  const s1 = food1.servings.find((s) => s.isDefault) || food1.servings[0];
  const s2 = food2.servings.find((s) => s.isDefault) || food2.servings[0];
  const r1 = (s1 ? s1.weightGrams : 100) / 100;
  const r2 = (s2 ? s2.weightGrams : 100) / 100;

  const c1 = Math.round(food1.nutrientsPer100g.calories * r1);
  const p1 = Math.round(food1.nutrientsPer100g.protein * r1 * 10) / 10;
  const c2 = Math.round(food2.nutrientsPer100g.calories * r2);
  const p2 = Math.round(food2.nutrientsPer100g.protein * r2 * 10) / 10;

  return `Compare ${food1.name} (${c1} kcal, ${p1}g protein) vs ${food2.name} (${c2} kcal, ${p2}g protein). Complete side-by-side USDA macro comparison, nutrient density, and diet verdict.`;
}

/**
 * Generate SEO Keywords for a Food Item
 */
export function generateFoodKeywords(food: FoodItem): string[] {
  const baseName = food.name.toLowerCase();
  return [
    `${baseName} calories`,
    `how many calories in ${baseName}`,
    `${baseName} nutrition facts`,
    `${baseName} protein grams`,
    `${baseName} macros`,
    `${baseName} carbs`,
    `${baseName} calories 100g`,
    `is ${baseName} healthy`,
    `is ${baseName} keto`,
    `${food.categoryName.toLowerCase()} calorie lookup`,
    ...food.tags,
  ];
}

/**
 * Generate Schema.org NutritionInformation & MenuItem JSON-LD
 */
export function generateNutritionJsonLd(food: FoodItem) {
  const defaultServing = food.servings.find((s) => s.isDefault) || food.servings[0];
  const ratio = (defaultServing ? defaultServing.weightGrams : 100) / 100;
  
  const cals = Math.round(food.nutrientsPer100g.calories * ratio);
  const prot = `${Math.round(food.nutrientsPer100g.protein * ratio * 10) / 10} g`;
  const carbs = `${Math.round(food.nutrientsPer100g.carbohydrates * ratio * 10) / 10} g`;
  const fat = `${Math.round(food.nutrientsPer100g.fat * ratio * 10) / 10} g`;
  const fiber = `${Math.round((food.nutrientsPer100g.fiber || 0) * ratio * 10) / 10} g`;
  const sugar = `${Math.round((food.nutrientsPer100g.sugar || 0) * ratio * 10) / 10} g`;
  const sodium = `${Math.round((food.nutrientsPer100g.sodium || 0) * ratio)} mg`;
  const cholesterol = food.nutrientsPer100g.cholesterol !== undefined 
    ? `${Math.round(food.nutrientsPer100g.cholesterol * ratio)} mg` 
    : undefined;
  const satFat = food.nutrientsPer100g.saturatedFat !== undefined 
    ? `${Math.round(food.nutrientsPer100g.saturatedFat * ratio * 10) / 10} g` 
    : undefined;

  const url = getCanonicalUrl(`/food/${food.slug}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'MenuItem',
    '@id': `${url}#item`,
    name: food.name,
    description: food.description,
    image: `${SITE_URL}/og-images/${food.slug}.png`,
    url: url,
    category: food.categoryName,
    nutrition: {
      '@type': 'NutritionInformation',
      '@id': `${url}#nutrition`,
      calories: `${cals} calories`,
      servingSize: defaultServing ? defaultServing.label : '100g',
      proteinContent: prot,
      carbohydrateContent: carbs,
      fatContent: fat,
      fiberContent: fiber,
      sugarContent: sugar,
      sodiumContent: sodium,
      ...(cholesterol ? { cholesterolContent: cholesterol } : {}),
      ...(satFat ? { saturatedFatContent: satFat } : {}),
    },
  };
}

export const generateFoodJsonLd = generateNutritionJsonLd;

/**
 * Generate BreadcrumbList Schema.org JSON-LD
 */
export function generateBreadcrumbJsonLd(crumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: getCanonicalUrl(crumb.url),
    })),
  };
}

/**
 * Generate FAQPage Schema.org JSON-LD for Google "People Also Ask" Rich Results
 */
export function generateFaqJsonLd(faqs: { q?: string; a?: string; question?: string; answer?: string }[]) {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question || faq.q || '',
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer || faq.a || '',
      },
    })),
  };
}

/**
 * Generate WebSite Schema with Sitelinks SearchBox
 */
export function generateWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_TAGLINE,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate automatic PAA FAQs for a food item
 */
export function generateDefaultFaqs(food: FoodItem): { question: string; answer: string }[] {
  const defaultServing = food.servings.find((s) => s.isDefault) || food.servings[0];
  const ratio = (defaultServing ? defaultServing.weightGrams : 100) / 100;
  
  const cals = Math.round(food.nutrientsPer100g.calories * ratio);
  const prot = Math.round(food.nutrientsPer100g.protein * ratio * 10) / 10;
  const carbs = Math.round(food.nutrientsPer100g.carbohydrates * ratio * 10) / 10;
  const fat = Math.round(food.nutrientsPer100g.fat * ratio * 10) / 10;
  const servingName = defaultServing ? defaultServing.label : '100 grams';

  const walkMinutes = Math.round((cals / 4.5));
  const runMinutes = Math.round((cals / 11.5));
  const cycleMinutes = Math.round((cals / 8.5));

  const isHighProtein = (food.nutrientsPer100g.protein * 4) / (food.nutrientsPer100g.calories || 1) >= 0.25 || food.nutrientsPer100g.protein >= 15;
  const isKeto = food.nutrientsPer100g.carbohydrates - (food.nutrientsPer100g.fiber || 0) <= 5;
  const isLowCal = food.nutrientsPer100g.calories <= 75;

  return [
    {
      question: `How many calories are in ${food.name}?`,
      answer: `There are ${cals} calories in ${servingName} of ${food.name}. Per 100 grams, it contains ${food.nutrientsPer100g.calories} calories, ${food.nutrientsPer100g.protein}g protein, ${food.nutrientsPer100g.carbohydrates}g carbohydrates, and ${food.nutrientsPer100g.fat}g fat.`,
    },
    {
      question: `What are the macronutrients in ${food.name}?`,
      answer: `In a ${servingName} serving, ${food.name} provides ${prot}g protein, ${carbs}g carbohydrates (${Math.round((food.nutrientsPer100g.fiber || 0) * ratio * 10) / 10}g dietary fiber, ${Math.round((food.nutrientsPer100g.sugar || 0) * ratio * 10) / 10}g sugars), and ${fat}g fat.`,
    },
    {
      question: `Is ${food.name} good for weight loss or keto diets?`,
      answer: isKeto 
        ? `Yes, ${food.name} has only ${Math.round((food.nutrientsPer100g.carbohydrates - (food.nutrientsPer100g.fiber || 0)) * ratio * 10) / 10}g net carbs per serving, making it very suitable for ketogenic and low-carb diets.`
        : isLowCal
        ? `Yes! At only ${cals} calories per ${servingName}, ${food.name} is a nutrient-dense, low-calorie choice that easily fits into calorie-deficit weight loss plans.`
        : `${food.name} contains ${cals} calories per ${servingName}. When tracking your daily calorie budget, it can be enjoyed as part of a balanced diet for muscle building or energy.`,
    },
    {
      question: `What is a calorie in ${food.name} and how does the body use it?`,
      answer: `A calorie is a unit of measurement for energy. In nutrition, the ${cals} calories in ${servingName} of ${food.name} supply chemical energy that your body uses for basal metabolism, organ function, and daily physical activity.`,
    },
    {
      question: `How much exercise does it take to burn off ${cals} calories from ${food.name}?`,
      answer: `To burn off the ${cals} calories in ${servingName} of ${food.name}, an average adult would need to walk at a moderate pace for about ${walkMinutes} minutes, jog for approximately ${runMinutes} minutes, or cycle for around ${cycleMinutes} minutes.`,
    },
  ];
}
