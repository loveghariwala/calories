/**
 * Smart Food Image Matcher
 * Maps food names and categories to high-resolution, curated food photography.
 */

const FOOD_IMAGE_MAP: Array<{ keywords: string[]; url: string }> = [
  // 🍗 Poultry / Chicken / Turkey
  {
    keywords: ['chicken breast', 'grilled chicken', 'cooked chicken', 'chicken fillet'],
    url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['chicken thigh', 'chicken wing', 'fried chicken', 'roasted chicken', 'rotisserie chicken'],
    url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['chicken', 'turkey', 'poultry'],
    url: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80',
  },

  // 🥩 Beef / Steak / Pork / Lamb / Meat
  {
    keywords: ['ribeye', 'steak', 'sirloin', 'filet mignon', 'beef steak'],
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['ground beef', 'minced beef', 'beef burger', 'beef'],
    url: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['pork', 'bacon', 'ham', 'pork chop', 'pork loin'],
    url: 'https://images.unsplash.com/photo-1527477321005-4d01d77b28f9?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['lamb', 'lamb chop', 'mutton'],
    url: 'https://images.unsplash.com/photo-1514944298352-2591a27e4e1f?auto=format&fit=crop&w=600&q=80',
  },

  // 🐟 Fish & Seafood
  {
    keywords: ['salmon', 'wild salmon', 'grilled salmon', 'smoked salmon'],
    url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['tuna', 'tuna steak', 'ahi tuna', 'canned tuna'],
    url: 'https://images.unsplash.com/photo-1501595091296-3aa970afb3ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['shrimp', 'prawn', 'grilled shrimp'],
    url: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['cod', 'tilapia', 'halibut', 'white fish', 'sea bass', 'fish fillet'],
    url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['lobster', 'crab', 'oyster', 'mussel', 'scallop', 'seafood'],
    url: 'https://images.unsplash.com/photo-1559737558-24cf9633e7e9?auto=format&fit=crop&w=600&q=80',
  },

  // 🥚 Eggs & Dairy
  {
    keywords: ['boiled egg', 'poached egg', 'fried egg', 'scrambled egg', 'egg', 'eggs'],
    url: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['egg white', 'egg whites'],
    url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['greek yogurt', 'yogurt', 'curd'],
    url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['cottage cheese', 'ricotta'],
    url: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['cheddar', 'mozzarella', 'parmesan', 'swiss cheese', 'cheese'],
    url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['milk', 'whole milk', 'skim milk', 'almond milk', 'oat milk'],
    url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['butter', 'ghee'],
    url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
  },

  // 🥑 Fresh Fruits
  {
    keywords: ['avocado', 'hass avocado'],
    url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['apple', 'red apple', 'green apple', 'fuji apple'],
    url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['banana', 'bananas'],
    url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['blueberry', 'blueberries'],
    url: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['strawberry', 'strawberries'],
    url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['raspberry', 'raspberries', 'blackberry', 'blackberries'],
    url: 'https://images.unsplash.com/photo-1577069808021-5f2122822a10?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['orange', 'citrus', 'mandarin', 'tangerine', 'clementine', 'grapefruit'],
    url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['lemon', 'lime'],
    url: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['mango', 'pineapple', 'papaya'],
    url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['watermelon', 'melon', 'cantaloupe'],
    url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['grape', 'grapes'],
    url: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['peach', 'plum', 'apricot', 'cherry', 'cherries'],
    url: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80',
  },

  // 🥦 Vegetables & Greens
  {
    keywords: ['broccoli', 'broccolini'],
    url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['spinach', 'kale', 'salad', 'lettuce', 'mixed greens', 'arugula'],
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['cucumber', 'zucchini'],
    url: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['tomato', 'tomatoes', 'cherry tomato'],
    url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['carrot', 'carrots'],
    url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['sweet potato', 'yam'],
    url: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['potato', 'potatoes', 'baked potato', 'french fries'],
    url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['asparagus', 'green beans', 'brussels sprout'],
    url: 'https://images.unsplash.com/photo-1515471204630-d3148f95c1a0?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['bell pepper', 'pepper', 'capsicum', 'chili'],
    url: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['mushroom', 'mushrooms'],
    url: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['onion', 'garlic'],
    url: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80',
  },

  // 🍚 Grains, Breads & Pasta
  {
    keywords: ['oats', 'oatmeal', 'rolled oats', 'steel cut oats', 'porridge'],
    url: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['rice', 'white rice', 'brown rice', 'jasmine rice', 'basmati rice'],
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['quinoa', 'couscous', 'barley'],
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['bread', 'sourdough', 'whole wheat bread', 'toast', 'bagel'],
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['pasta', 'spaghetti', 'macaroni', 'noodle', 'noodles', 'penne'],
    url: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=600&q=80',
  },

  // 🥜 Legumes, Nuts & Seeds
  {
    keywords: ['almond', 'almonds'],
    url: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['peanut butter', 'peanut', 'peanuts'],
    url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['walnut', 'cashew', 'pistachio', 'mixed nuts', 'nuts'],
    url: 'https://images.unsplash.com/photo-1536591375315-1b838421867c?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['chia seed', 'flaxseed', 'pumpkin seed', 'seeds'],
    url: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['lentil', 'lentils', 'chickpea', 'chickpeas', 'hummus', 'black bean', 'beans', 'kidney bean'],
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['tofu', 'tempeh', 'edamame', 'soybean'],
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
  },

  // ☕ Beverages & Teas
  {
    keywords: ['coffee', 'espresso', 'cappuccino', 'latte', 'cold brew', 'americano'],
    url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['tea', 'green tea', 'black tea', 'matcha', 'herbal tea'],
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['juice', 'smoothie', 'protein shake', 'shake'],
    url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
  },

  // 🍫 Snacks, Treats & Fast Food
  {
    keywords: ['dark chocolate', 'chocolate', 'cocoa'],
    url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['pizza'],
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['burger', 'cheeseburger'],
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
  },
  {
    keywords: ['protein bar', 'granola bar', 'cookie', 'cookies'],
    url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
  },
];

// Fallbacks by category
const CATEGORY_FALLBACKS: Record<string, string> = {
  'meats-poultry': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80',
  'seafood': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
  'dairy-eggs': 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=600&q=80',
  'fruits': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80',
  'vegetables': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  'grains-breads': 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80',
  'legumes-nuts': 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80',
  'fast-food-restaurant': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
  'beverages': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
  'snacks-desserts': 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80',
};

/**
 * Get distinct, high-resolution food photo URL based on food name and category
 */
export function getFoodImageUrl(name: string, category?: string): string {
  const cleanName = (name || '').toLowerCase();

  for (const entry of FOOD_IMAGE_MAP) {
    if (entry.keywords.some((kw) => cleanName.includes(kw))) {
      return entry.url;
    }
  }

  if (category && CATEGORY_FALLBACKS[category]) {
    return CATEGORY_FALLBACKS[category];
  }

  return 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80';
}
