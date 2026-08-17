import { NextRequest, NextResponse } from 'next/server';
import { searchUSDA } from '@/lib/usdaApi';
import { registerDynamicFood } from '@/data/foodDatabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query') || '*';
    const category = searchParams.get('category');
    const dataType = searchParams.get('dataType') || undefined;
    const page = Math.max(1, parseInt(searchParams.get('page') || searchParams.get('pageNumber') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || searchParams.get('pageSize') || '20', 10)));
    const sortBy = searchParams.get('sortBy') as any;
    const sortOrder = (searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc';

    const searchTerm = [query !== '*' ? query.trim() : '', category ? category.replace(/-/g, ' ') : ''].filter(Boolean).join(' ') || '*';

    const result = await searchUSDA({
      query: searchTerm,
      pageSize: limit,
      pageNumber: page,
      dataType,
      sortBy,
      sortOrder,
    });

    result.foods.forEach(registerDynamicFood);

    return NextResponse.json({
      success: true,
      source: 'USDA FoodData Central API',
      query: searchTerm,
      category: category || null,
      totalHits: result.totalHits,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      pageSize: limit,
      results: result.foods,
    });
  } catch (error) {
    console.error('Error in GET /api/foods/search:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search USDA FoodData Central',
        message: error instanceof Error ? error.message : 'Unknown server error',
      },
      { status: 500 }
    );
  }
}
