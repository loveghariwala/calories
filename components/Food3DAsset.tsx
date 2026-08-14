'use client';

import React from 'react';

interface Food3DAssetProps {
  name?: string;
  type?: string;
  size?: number;
  className?: string;
  animate?: boolean;
  floatDelay?: number;
}

export const Food3DAsset: React.FC<Food3DAssetProps> = ({
  name = '',
  type = '',
  size = 48,
  className = '',
  animate = false,
  floatDelay = 0,
}) => {
  // Combine name and type into a searchable string
  const text = `${name} ${type}`.toLowerCase();

  const render3DShape = () => {
    switch (true) {
      // 🥛 MILK (Milk carton / Bottle / Glass)
      case text.includes('milk') && !text.includes('chocolate'):
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="milk-carton" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor="#EBF4FA" />
                <stop offset="100%" stopColor="#C8DFEE" />
              </linearGradient>
              <linearGradient id="milk-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4A90E2" />
                <stop offset="100%" stopColor="#1E5EA8" />
              </linearGradient>
            </defs>
            {/* 3D Milk Glass Bottle / Carton */}
            <path d="M30,36 L38,18 L62,18 L70,36 L70,82 C70,88 64,92 58,92 L42,92 C36,92 30,88 30,82 Z" fill="#99BDD8" transform="translate(0, 3)" />
            <path d="M30,36 L38,18 L62,18 L70,36 L70,82 C70,88 64,92 58,92 L42,92 C36,92 30,88 30,82 Z" fill="url(#milk-carton)" />
            {/* Blue Banner Label */}
            <rect x="30" y="44" width="40" height="22" fill="url(#milk-blue)" />
            {/* Fresh Milk Drop on label */}
            <path d="M50,48 C50,48 44,56 44,59 C44,62 46.7,64 50,64 C53.3,64 56,62 56,59 C56,56 50,48 50,48 Z" fill="#FFFFFF" />
            {/* Bottle Cap */}
            <rect x="42" y="12" width="16" height="8" rx="2" fill="url(#milk-blue)" />
            {/* Glass Specular Highlight */}
            <rect x="34" y="38" width="4" height="42" rx="2" fill="#FFFFFF" opacity="0.6" />
          </svg>
        );

      // 🧀 CHEESE / CHEDDAR / COTTAGE
      case text.includes('cheese') || text.includes('cheddar') || text.includes('cottage'):
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="cheese-wedge" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFDE59" />
                <stop offset="50%" stopColor="#FFAE00" />
                <stop offset="100%" stopColor="#E67E00" />
              </linearGradient>
              <linearGradient id="cheese-side" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E69500" />
                <stop offset="100%" stopColor="#A85700" />
              </linearGradient>
            </defs>
            {/* 3D Cheese Wedge Side */}
            <path d="M14,64 L82,78 L86,48 L14,32 Z" fill="url(#cheese-side)" />
            {/* Top Surface Wedge */}
            <path d="M14,32 L86,48 L56,18 Z" fill="url(#cheese-wedge)" />
            {/* Swiss Cheese Holes with 3D shadow */}
            <ellipse cx="40" cy="48" rx="7" ry="5" fill="#C96B00" />
            <ellipse cx="65" cy="60" rx="9" ry="6" fill="#C96B00" />
            <ellipse cx="45" cy="28" rx="5" ry="3" fill="#D98200" />
            <ellipse cx="68" cy="42" rx="6" ry="4" fill="#D98200" />
            {/* Specular Highlight */}
            <path d="M18,34 L54,20" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          </svg>
        );

      // 🥣 GREEK YOGURT / YOGURT BOWL
      case text.includes('yogurt') || text.includes('parfait'):
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="bowl-ceram" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6C8A74" />
                <stop offset="100%" stopColor="#2E4734" />
              </linearGradient>
              <linearGradient id="yog-creme" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="80%" stopColor="#F5EFEB" />
                <stop offset="100%" stopColor="#D9CEC5" />
              </linearGradient>
            </defs>
            {/* Ceramic Bowl */}
            <path d="M18,45 C18,76 34,88 50,88 C66,88 82,76 82,45 Z" fill="url(#bowl-ceram)" />
            <ellipse cx="50" cy="45" rx="32" ry="12" fill="#203325" />
            {/* Thick Greek Yogurt Cream Swirl */}
            <ellipse cx="50" cy="44" rx="29" ry="10" fill="url(#yog-creme)" />
            {/* Blueberries on Top */}
            <circle cx="44" cy="40" r="5.5" fill="#3D407A" />
            <circle cx="42" cy="38" r="1.5" fill="#8E93E6" />
            <circle cx="56" cy="42" r="5" fill="#3D407A" />
            <circle cx="54" cy="40" r="1.5" fill="#8E93E6" />
            {/* Honey Drizzle */}
            <path d="M38,44 Q50,48 62,42" stroke="#E69500" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.85" />
          </svg>
        );

      // 🦐 SHRIMP / SHELLFISH
      case text.includes('shrimp') || text.includes('prawn'):
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="shrimp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFA385" />
                <stop offset="50%" stopColor="#F55A38" />
                <stop offset="100%" stopColor="#C42A0D" />
              </linearGradient>
            </defs>
            {/* Steamed Curved Shrimp Body */}
            <path
              d="M72,32 C78,48 70,72 50,80 C32,86 18,74 20,58 C22,44 34,36 48,38 C60,40 64,52 56,60 C48,66 38,62 36,54"
              stroke="url(#shrimp-grad)"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
            {/* Tail Fan */}
            <path d="M68,28 L82,16 M72,32 L88,24 M72,36 L86,34" stroke="#F55A38" strokeWidth="4" strokeLinecap="round" />
            {/* White Meat Highlights */}
            <circle cx="48" cy="74" r="3" fill="#FFFFFF" opacity="0.8" />
            <circle cx="30" cy="66" r="3" fill="#FFFFFF" opacity="0.8" />
          </svg>
        );

      // 🐟 WHITE FISH / TILAPIA / COD / TUNA
      case text.includes('tilapia') || text.includes('cod') || text.includes('tuna') || (text.includes('fish') && !text.includes('salmon')):
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="white-fish" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#F0E8DD" />
                <stop offset="100%" stopColor="#C9BEAF" />
              </linearGradient>
              <linearGradient id="herb-seasoning" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#558C23" />
                <stop offset="100%" stopColor="#2E5410" />
              </linearGradient>
            </defs>
            {/* Baked Fish Fillet 3D Depth */}
            <path
              d="M18,48 C24,28 72,28 84,48 C78,68 34,74 18,48 Z"
              fill="#8C7A65"
              transform="translate(0, 5)"
            />
            <path
              d="M18,48 C24,28 72,28 84,48 C78,68 34,74 18,48 Z"
              fill="url(#white-fish)"
            />
            {/* Sear Flakes & Lemon Herbs */}
            <ellipse cx="42" cy="44" rx="4" ry="2" fill="#D98A36" opacity="0.7" />
            <ellipse cx="58" cy="46" rx="5" ry="2.5" fill="#D98A36" opacity="0.7" />
            <circle cx="48" cy="40" r="1.5" fill="url(#herb-seasoning)" />
            <circle cx="54" cy="42" r="1.5" fill="url(#herb-seasoning)" />
            <circle cx="36" cy="46" r="1.5" fill="url(#herb-seasoning)" />
            <circle cx="64" cy="48" r="1.5" fill="url(#herb-seasoning)" />
          </svg>
        );

      // 🐟 ATLANTIC SALMON
      case text.includes('salmon'):
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="salmon-meat" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF8566" />
                <stop offset="50%" stopColor="#F55A38" />
                <stop offset="100%" stopColor="#C93516" />
              </linearGradient>
              <linearGradient id="salmon-skin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#788896" />
                <stop offset="100%" stopColor="#303A42" />
              </linearGradient>
            </defs>
            <path d="M16,65 C30,78 68,80 84,65 L84,72 C68,86 30,84 16,72 Z" fill="url(#salmon-skin)" />
            <path
              d="M16,42 C28,26 72,26 84,42 C86,58 78,68 66,72 C40,78 22,70 16,56 Z"
              fill="#9C220A"
              transform="translate(0, 4)"
            />
            <path
              d="M16,42 C28,26 72,26 84,42 C86,58 78,68 66,72 C40,78 22,70 16,56 Z"
              fill="url(#salmon-meat)"
            />
            <path d="M30,34 Q45,45 42,65" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" fill="none" />
            <path d="M48,32 Q62,44 58,66" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" fill="none" />
            <path d="M66,36 Q76,46 72,64" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" fill="none" />
          </svg>
        );

      // 🍳 EGG WHITES (Pure white albumen in skillet / plate)
      case text.includes('white') && text.includes('egg'):
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="eggwhite-pure" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor="#F5F2EC" />
                <stop offset="100%" stopColor="#D9D2C5" />
              </linearGradient>
            </defs>
            <path
              d="M22,48 C16,30 36,18 58,20 C80,22 88,40 82,62 C76,80 50,84 34,80 C18,76 16,58 22,48 Z"
              fill="#A89E90"
              transform="translate(0, 4)"
            />
            <path
              d="M22,48 C16,30 36,18 58,20 C80,22 88,40 82,62 C76,80 50,84 34,80 C18,76 16,58 22,48 Z"
              fill="url(#eggwhite-pure)"
              stroke="#D9D2C5"
              strokeWidth="2"
            />
            {/* Center Indentation with herb pinch */}
            <ellipse cx="50" cy="50" rx="14" ry="10" fill="#EAE3D5" opacity="0.6" />
            <circle cx="48" cy="48" r="1.5" fill="#3D5A45" />
            <circle cx="52" cy="52" r="1.5" fill="#3D5A45" />
          </svg>
        );

      // 🥚 WHOLE EGG / HARD-BOILED EGG
      case text.includes('egg'):
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="egg-white" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="80%" stopColor="#F5EFE6" />
                <stop offset="100%" stopColor="#D9CEBE" />
              </linearGradient>
              <radialGradient id="egg-yolk" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFD233" />
                <stop offset="60%" stopColor="#FA9D1B" />
                <stop offset="100%" stopColor="#D96604" />
              </radialGradient>
            </defs>
            <path
              d="M20,52 C15,35 35,20 56,22 C78,25 88,44 82,65 C76,82 52,86 35,82 C18,78 16,62 20,52 Z"
              fill="#BAAB95"
              transform="translate(0, 4)"
            />
            <path
              d="M20,52 C15,35 35,20 56,22 C78,25 88,44 82,65 C76,82 52,86 35,82 C18,78 16,62 20,52 Z"
              fill="url(#egg-white)"
            />
            <circle cx="52" cy="50" r="18" fill="url(#egg-yolk)" />
            <ellipse cx="46" cy="44" rx="6" ry="3.5" fill="#FFFFFF" opacity="0.75" transform="rotate(-30, 46, 44)" />
          </svg>
        );

      // 🍗 GRILLED CHICKEN BREAST / POULTRY
      case text.includes('chicken') || text.includes('breast') || text.includes('poultry') || text.includes('turkey'):
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="chk-breast" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FADC9B" />
                <stop offset="50%" stopColor="#DE9E52" />
                <stop offset="100%" stopColor="#A8571B" />
              </linearGradient>
            </defs>
            {/* Grilled Chicken Breast Cutlet */}
            <path
              d="M20,55 C18,34 35,20 62,22 C84,24 88,48 76,70 C66,86 36,88 24,78 C18,70 18,62 20,55 Z"
              fill="#6B3208"
              transform="translate(0, 5)"
            />
            <path
              d="M20,55 C18,34 35,20 62,22 C84,24 88,48 76,70 C66,86 36,88 24,78 C18,70 18,62 20,55 Z"
              fill="url(#chk-breast)"
            />
            {/* Diagonal Sear Grill Marks */}
            <line x1="32" y1="36" x2="52" y2="28" stroke="#6B3208" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
            <line x1="38" y1="52" x2="68" y2="40" stroke="#6B3208" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
            <line x1="44" y1="68" x2="74" y2="56" stroke="#6B3208" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
          </svg>
        );

      // 🥩 BEEF / STEAK / MEAT / RIBEYE
      case text.includes('beef') || text.includes('steak') || text.includes('ribeye') || text.includes('pork') || text.includes('meat'):
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="steak-base" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D94B3D" />
                <stop offset="60%" stopColor="#8F1F1A" />
                <stop offset="100%" stopColor="#5E0F0C" />
              </linearGradient>
              <linearGradient id="steak-fat" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF8F0" />
                <stop offset="100%" stopColor="#E2CDBA" />
              </linearGradient>
              <linearGradient id="bone-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5EFE6" />
                <stop offset="100%" stopColor="#D4C5B3" />
              </linearGradient>
            </defs>
            <path
              d="M20,40 C18,22 45,15 70,25 C88,32 94,55 85,75 C75,92 40,95 24,85 C14,75 16,55 20,40 Z"
              fill="#520C09"
              transform="translate(0, 5)"
            />
            <path
              d="M20,40 C18,22 45,15 70,25 C88,32 94,55 85,75 C75,92 40,95 24,85 C14,75 16,55 20,40 Z"
              fill="url(#steak-base)"
            />
            <path
              d="M32,35 Q45,30 55,42 Q68,48 78,38"
              stroke="url(#steak-fat)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
            <ellipse cx="52" cy="52" rx="12" ry="9" fill="url(#bone-grad)" />
            <ellipse cx="52" cy="52" rx="6" ry="4" fill="#A89480" opacity="0.6" />
          </svg>
        );

      // 🍌 BANANA
      case text.includes('banana'):
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="banana-skin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF275" />
                <stop offset="60%" stopColor="#FFDE17" />
                <stop offset="100%" stopColor="#D99B00" />
              </linearGradient>
            </defs>
            <path
              d="M18,32 C26,62 55,82 82,68 C74,68 44,58 34,34 C30,24 22,26 18,32 Z"
              fill="#A87503"
              transform="translate(0, 3)"
            />
            <path
              d="M18,32 C26,62 55,82 82,68 C74,68 44,58 34,34 C30,24 22,26 18,32 Z"
              fill="url(#banana-skin)"
            />
            <path d="M18,32 L15,28" stroke="#5E4007" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      // 🫐 BLUEBERRIES
      case text.includes('blueberry') || text.includes('blueberries'):
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <radialGradient id="berry-grad1" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#6C72D6" />
                <stop offset="60%" stopColor="#30358A" />
                <stop offset="100%" stopColor="#151747" />
              </radialGradient>
              <radialGradient id="berry-grad2" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#7E84EB" />
                <stop offset="60%" stopColor="#3E45A8" />
                <stop offset="100%" stopColor="#1B1E5C" />
              </radialGradient>
            </defs>
            {/* Cluster of 3 Blueberries */}
            <circle cx="34" cy="58" r="18" fill="url(#berry-grad1)" />
            <circle cx="66" cy="58" r="18" fill="url(#berry-grad1)" />
            <circle cx="50" cy="38" r="20" fill="url(#berry-grad2)" />
            {/* Star Calyx Crown */}
            <circle cx="50" cy="36" r="5" fill="#151747" />
            <ellipse cx="44" cy="30" rx="6" ry="2.5" fill="#FFFFFF" opacity="0.4" transform="rotate(-30, 44, 30)" />
          </svg>
        );

      // 🍓 STRAWBERRY
      case text.includes('strawberr'):
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <radialGradient id="straw-grad" cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FF4D4D" />
                <stop offset="60%" stopColor="#D61818" />
                <stop offset="100%" stopColor="#800606" />
              </radialGradient>
            </defs>
            {/* Heart-Shaped Berry */}
            <path
              d="M50,86 C32,70 18,52 20,36 C22,24 34,22 50,30 C66,22 78,24 80,36 C82,52 68,70 50,86 Z"
              fill="url(#straw-grad)"
            />
            {/* Green Crown Calyx */}
            <path d="M50,28 L40,14 L50,22 L60,14 L50,28 Z" fill="#4DA823" />
            <circle cx="50" cy="14" r="3" fill="#2E6B11" />
            {/* Seeds */}
            <ellipse cx="40" cy="42" rx="1.5" ry="2.5" fill="#FFDE59" />
            <ellipse cx="60" cy="42" rx="1.5" ry="2.5" fill="#FFDE59" />
            <ellipse cx="50" cy="54" rx="1.5" ry="2.5" fill="#FFDE59" />
            <ellipse cx="38" cy="62" rx="1.5" ry="2.5" fill="#FFDE59" />
            <ellipse cx="62" cy="62" rx="1.5" ry="2.5" fill="#FFDE59" />
          </svg>
        );

      // 🥑 AVOCADO
      case text.includes('avocado'):
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="avo-skin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2E4A28" />
                <stop offset="100%" stopColor="#152612" />
              </linearGradient>
              <linearGradient id="avo-flesh" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DCF29D" />
                <stop offset="50%" stopColor="#B3DC60" />
                <stop offset="100%" stopColor="#75A632" />
              </linearGradient>
              <radialGradient id="avo-pit" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#B87342" />
                <stop offset="60%" stopColor="#6E3816" />
                <stop offset="100%" stopColor="#3B1804" />
              </radialGradient>
            </defs>
            <path
              d="M50,12 C32,12 20,38 20,62 C20,82 33,94 50,94 C67,94 80,82 80,62 C80,38 68,12 50,12 Z"
              fill="url(#avo-skin)"
              transform="translate(0, 4)"
            />
            <path
              d="M50,12 C32,12 20,38 20,62 C20,82 33,94 50,94 C67,94 80,82 80,62 C80,38 68,12 50,12 Z"
              fill="url(#avo-flesh)"
              stroke="#2E4A28"
              strokeWidth="3"
            />
            <ellipse cx="50" cy="64" rx="22" ry="24" fill="#EDF7B7" opacity="0.6" />
            <circle cx="50" cy="64" r="16" fill="url(#avo-pit)" />
            <ellipse cx="45" cy="58" rx="5" ry="2.5" fill="#FFFFFF" opacity="0.5" transform="rotate(-30, 45, 58)" />
          </svg>
        );

      // 🍚 RICE / JASMINE / BROWN RICE
      case text.includes('rice'):
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="rice-bowl" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C44133" />
                <stop offset="100%" stopColor="#6E160E" />
              </linearGradient>
              <linearGradient id="rice-grains" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#EDE4D8" />
              </linearGradient>
            </defs>
            {/* Ceramic Red Asian Bowl */}
            <path d="M18,48 C18,78 34,88 50,88 C66,88 82,78 82,48 Z" fill="url(#rice-bowl)" />
            {/* Steaming Fluffy Grains Mound */}
            <ellipse cx="50" cy="46" rx="32" ry="16" fill="url(#rice-grains)" />
            <circle cx="44" cy="42" r="3" fill="#FFFFFF" />
            <circle cx="54" cy="40" r="3" fill="#FFFFFF" />
            <circle cx="36" cy="46" r="3" fill="#FFFFFF" />
            <circle cx="62" cy="44" r="3" fill="#FFFFFF" />
            {/* Steam */}
            <path d="M44,28 Q40,18 46,12" stroke="#FAF8F5" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
            <path d="M56,26 Q60,16 54,10" stroke="#FAF8F5" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
          </svg>
        );

      // 🌾 OATS / OATMEAL / PORRIDGE
      case text.includes('oat') || text.includes('porridge'):
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="oat-pot" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D98A36" />
                <stop offset="100%" stopColor="#7A3F0A" />
              </linearGradient>
              <linearGradient id="oat-porr" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2DC" />
                <stop offset="100%" stopColor="#D6BA96" />
              </linearGradient>
            </defs>
            <path d="M20,48 C20,76 34,86 50,86 C66,86 80,76 80,48 Z" fill="url(#oat-pot)" />
            <ellipse cx="50" cy="46" rx="30" ry="14" fill="url(#oat-porr)" />
            {/* Oat Flakes Pattern */}
            <ellipse cx="42" cy="44" rx="4" ry="2" fill="#BA966C" transform="rotate(25, 42, 44)" />
            <ellipse cx="56" cy="42" rx="4" ry="2" fill="#BA966C" transform="rotate(-15, 56, 42)" />
            <ellipse cx="50" cy="48" rx="4" ry="2" fill="#BA966C" transform="rotate(45, 50, 48)" />
          </svg>
        );

      // 🍞 BREAD / TOAST / SOURDOUGH
      case text.includes('bread') || text.includes('toast') || text.includes('sourdough'):
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="bread-crust" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D98A36" />
                <stop offset="60%" stopColor="#9E5011" />
                <stop offset="100%" stopColor="#632B03" />
              </linearGradient>
              <linearGradient id="bread-crumb" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2DC" />
                <stop offset="100%" stopColor="#E0C6A4" />
              </linearGradient>
            </defs>
            <path
              d="M18,52 C18,30 32,22 50,22 C68,22 82,30 82,52 C82,68 74,76 50,76 C26,76 18,68 18,52 Z"
              fill="#522202"
              transform="translate(0, 5)"
            />
            <path
              d="M18,52 C18,30 32,22 50,22 C68,22 82,30 82,52 C82,68 74,76 50,76 C26,76 18,68 18,52 Z"
              fill="url(#bread-crust)"
            />
            <path d="M30,42 Q40,36 50,42" stroke="url(#bread-crumb)" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M48,46 Q60,38 70,44" stroke="url(#bread-crumb)" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
        );

      // 🥜 PEANUT BUTTER / ALMONDS / NUTS
      case text.includes('peanut') || text.includes('almond') || text.includes('nut') || text.includes('seed') || text.includes('walnut') || text.includes('chia'):
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="peanut-shell" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E8B87D" />
                <stop offset="50%" stopColor="#C48843" />
                <stop offset="100%" stopColor="#7A4B13" />
              </linearGradient>
              <linearGradient id="almond-skin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B8652E" />
                <stop offset="100%" stopColor="#632B09" />
              </linearGradient>
            </defs>
            <path
              d="M32,25 C45,28 50,55 42,68 C34,80 20,72 18,58 C16,42 22,22 32,25 Z"
              fill="url(#almond-skin)"
              transform="rotate(-15, 32, 50)"
            />
            <path
              d="M58,26 C68,22 78,32 75,44 C72,50 64,52 64,56 C64,60 74,62 76,72 C78,82 66,90 56,86 C46,82 44,68 46,60 C48,54 56,52 54,44 C52,36 48,30 58,26 Z"
              fill="url(#peanut-shell)"
            />
          </svg>
        );

      // 🍫 CHOCOLATE / PROTEIN BAR / DESSERT
      case text.includes('chocolate') || text.includes('bar') || text.includes('cookie') || text.includes('dessert'):
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="choc-block" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5E3017" />
                <stop offset="60%" stopColor="#381A0B" />
                <stop offset="100%" stopColor="#1C0A03" />
              </linearGradient>
              <linearGradient id="gold-foil" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE885" />
                <stop offset="50%" stopColor="#D9A629" />
                <stop offset="100%" stopColor="#8C630D" />
              </linearGradient>
            </defs>
            <rect x="22" y="24" width="56" height="56" rx="6" fill="#1C0A03" transform="translate(0, 5) rotate(-6, 50, 50)" />
            <rect x="22" y="24" width="56" height="56" rx="6" fill="url(#choc-block)" transform="rotate(-6, 50, 50)" />
            <rect x="27" y="29" width="21" height="21" rx="3" fill="#6B371B" transform="rotate(-6, 50, 50)" />
            <rect x="52" y="29" width="21" height="21" rx="3" fill="#6B371B" transform="rotate(-6, 50, 50)" />
            <rect x="27" y="54" width="21" height="21" rx="3" fill="#6B371B" transform="rotate(-6, 50, 50)" />
            <rect x="52" y="54" width="21" height="21" rx="3" fill="#6B371B" transform="rotate(-6, 50, 50)" />
            <path d="M18,58 L82,50 L84,84 L16,88 Z" fill="url(#gold-foil)" transform="rotate(-6, 50, 50)" opacity="0.95" />
          </svg>
        );

      // ☕ COFFEE / LATTE / BEVERAGE / TEA
      case text.includes('coffee') || text.includes('latte') || text.includes('tea') || text.includes('beverage') || text.includes('drink'):
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="cup-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="80%" stopColor="#EDE2D3" />
                <stop offset="100%" stopColor="#C9B8A3" />
              </linearGradient>
              <radialGradient id="coffee-crema" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#BD8550" />
                <stop offset="60%" stopColor="#5E3516" />
                <stop offset="100%" stopColor="#2E1606" />
              </radialGradient>
            </defs>
            <ellipse cx="50" cy="80" rx="38" ry="10" fill="#BAAA95" />
            <ellipse cx="50" cy="78" rx="38" ry="10" fill="url(#cup-grad)" />
            <path d="M68,44 C82,44 84,66 68,68" stroke="url(#cup-grad)" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M26,38 L32,70 C33,76 67,76 68,70 L74,38 Z" fill="url(#cup-grad)" />
            <ellipse cx="50" cy="38" rx="24" ry="8" fill="#FFFFFF" />
            <ellipse cx="50" cy="39" rx="21" ry="6.5" fill="url(#coffee-crema)" />
            <path d="M42,26 Q40,16 46,10" stroke="#FAF8F5" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
            <path d="M54,24 Q58,14 52,8" stroke="#FAF8F5" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
          </svg>
        );

      // 🍎 FUJI APPLE / FRUITS (Default)
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <radialGradient id="apple-grad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FF6B6B" />
                <stop offset="45%" stopColor="#D92525" />
                <stop offset="100%" stopColor="#7A0808" />
              </radialGradient>
              <linearGradient id="leaf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7CD950" />
                <stop offset="100%" stopColor="#3A8219" />
              </linearGradient>
            </defs>
            <path d="M50,30 Q54,16 62,14" stroke="#5E3814" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M53,24 Q68,16 68,26 Q56,32 53,24 Z" fill="url(#leaf-grad)" />
            <path
              d="M50,36 C34,20 16,36 18,60 C20,82 40,88 50,86 C60,88 80,82 82,60 C84,36 66,20 50,36 Z"
              fill="#520505"
              transform="translate(0, 4)"
            />
            <path
              d="M50,36 C34,20 16,36 18,60 C20,82 40,88 50,86 C60,88 80,82 82,60 C84,36 66,20 50,36 Z"
              fill="url(#apple-grad)"
            />
            <ellipse cx="36" cy="42" rx="8" ry="4" fill="#FFFFFF" opacity="0.6" transform="rotate(-35, 36, 42)" />
          </svg>
        );
    }
  };

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${floatDelay}s`,
      }}
      className={`relative inline-flex items-center justify-center select-none transform-gpu transition-transform duration-300 hover:scale-110 hover:-rotate-3 ${
        animate ? 'animate-bounce-slow' : ''
      } ${className}`}
    >
      {render3DShape()}
    </div>
  );
};
