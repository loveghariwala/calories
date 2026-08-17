import { NextRequest, NextResponse } from 'next/server';
import { getFoodByFdcId } from '@/lib/usdaApi';
import { registerDynamicFood, getRelatedFoods } from '@/data/foodDatabase';

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteProps) {
  try {
    const { id } = await params;

    if (!id || id.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Food FDC ID or Slug is required' },
        { status: 400 }
      );
    }

    const decodedId = decodeURIComponent(id.trim());
    const food = await getFoodByFdcId(decodedId);

    if (!food) {
      return NextResponse.json(
        {
          success: false,
          error: 'Food item not found in USDA FoodData Central',
          fdcId: decodedId,
        },
        { status: 404 }
      );
    }

    registerDynamicFood(food);
    const related = getRelatedFoods(food, 4);

    return NextResponse.json({
      success: true,
      source: 'USDA FoodData Central API',
      data: food,
      related,
    });
  } catch (error) {
    console.error('Error in GET /api/foods/[id]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve food details from USDA API',
        message: error instanceof Error ? error.message : 'Unknown server error',
      },
      { status: 500 }
    );
  }
}
