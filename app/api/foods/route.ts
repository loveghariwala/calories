import { NextRequest, NextResponse } from 'next/server';
import { searchUSDA, listUSDAFoods } from '@/lib/usdaApi';
import { registerDynamicFood } from '@/data/foodDatabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('search') || '';
    const category = searchParams.get('category');
    const dataType = searchParams.get('dataType') || undefined;
    const page = Math.max(1, parseInt(searchParams.get('page') || searchParams.get('pageNumber') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || searchParams.get('pageSize') || '25', 10)));
    const sortBy = searchParams.get('sortBy') as any;
    const sortOrder = (searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc';

    // If a search query or category is provided, use USDA Search API
    if (query.trim() || category) {
      const searchTerm = [query.trim(), category ? category.replace(/-/g, ' ') : ''].filter(Boolean).join(' ');
      const searchResult = await searchUSDA({
        query: searchTerm,
        pageSize: limit,
        pageNumber: page,
        dataType,
        sortBy,
        sortOrder,
      });

      // Cache returned foods
      searchResult.foods.forEach(registerDynamicFood);

      return NextResponse.json({
        success: true,
        source: 'USDA FoodData Central API',
        totalHits: searchResult.totalHits,
        currentPage: searchResult.currentPage,
        totalPages: searchResult.totalPages,
        pageSize: limit,
        data: searchResult.foods,
      });
    }

    // Otherwise, use USDA paged list endpoint (/foods/list)
    const foods = await listUSDAFoods(page, limit, dataType);
    foods.forEach(registerDynamicFood);

    return NextResponse.json({
      success: true,
      source: 'USDA FoodData Central API',
      currentPage: page,
      pageSize: limit,
      total: foods.length,
      data: foods,
    });
  } catch (error) {
    console.error('Error in GET /api/foods:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve foods from USDA FoodData Central',
        message: error instanceof Error ? error.message : 'Unknown server error',
      },
      { status: 500 }
    );
  }
}
