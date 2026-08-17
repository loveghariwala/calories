import { NextResponse } from 'next/server';
import { CATEGORIES, getAllFoods } from '@/data/foodDatabase';

export async function GET() {
  try {
    const allFoods = getAllFoods();

    // Attach food count to each category
    const categoriesWithStats = CATEGORIES.map((cat) => {
      const categoryFoods = allFoods.filter((f) => f.category === cat.slug);
      return {
        ...cat,
        itemCount: categoryFoods.length,
      };
    });

    return NextResponse.json({
      success: true,
      total: categoriesWithStats.length,
      data: categoriesWithStats,
    });
  } catch (error) {
    console.error('Error in GET /api/categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve categories',
        message: error instanceof Error ? error.message : 'Unknown server error',
      },
      { status: 500 }
    );
  }
}
