import { FoodItem, CategoryMeta } from '@/types/food';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://caloriepulse.com';
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
 * Target: 55-60 chars optimal for Google SERP
 */
export function generateFoodMetaTitle(food: FoodItem): string {
  const defaultServing = food.servings.find((s) => s.isDefault) || food.servings[0];
  const servingText = defaultServing ? ` (${defaultServing.label})` : ' (100g)';
  return `${food.name} Calories, Protein & Nutrition Facts${servingText} | ${SITE_NAME}`;
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
  const serving = defaultServing ? defaultServing.label : '100g';

  return `There are ${cals} calories in ${food.name} (${serving}). Full USDA nutrition facts: ${prot}g protein, ${carbs}g carbs, ${fat}g fat, vitamins & exercise burn time.`;
}

/**
 * Generate Category SEO Title
 */
export function generateCategoryMetaTitle(categoryName: string): string {
  return `${categoryName} Calories, Protein & Macro Chart Guide | ${SITE_NAME}`;
}

/**
 * Generate Category SEO Description
 */
export function generateCategoryMetaDescription(categoryName: string, description?: string): string {
  return `Browse complete calorie lists, protein density, and USDA nutrition facts for ${categoryName}. ${description || 'Accurate macro breakdown & daily meal planning.'}`;
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
      question: `How much exercise does it take to burn off ${cals} calories from ${food.name}?`,
      answer: `To burn off the ${cals} calories in ${servingName} of ${food.name}, an average adult would need to walk at a moderate pace for about ${walkMinutes} minutes, jog for approximately ${runMinutes} minutes, or cycle for around ${cycleMinutes} minutes.`,
    },
  ];
}
