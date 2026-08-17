import { NextRequest, NextResponse } from 'next/server';
import { getCategoryBySlug, registerDynamicFood } from '@/data/foodDatabase';
import { searchUSDA } from '@/lib/usdaApi';

interface RouteProps {
  params: Promise<{
    category: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteProps) {
  try {
    const { category } = await params;

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category slug is required' },
        { status: 400 }
      );
    }

    const catMeta = getCategoryBySlug(category);
    const searchTerm = catMeta.name.replace(/&/g, ' ');

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

    const result = await searchUSDA({
      query: searchTerm,
      pageSize: limit,
      pageNumber: page,
    });

    result.foods.forEach(registerDynamicFood);

    return NextResponse.json({
      success: true,
      source: 'USDA FoodData Central API',
      category: catMeta,
      totalHits: result.totalHits,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      data: result.foods,
    });
  } catch (error) {
    console.error('Error in GET /api/categories/[category]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve category foods from USDA API',
        message: error instanceof Error ? error.message : 'Unknown server error',
      },
      { status: 500 }
    );
  }
}
