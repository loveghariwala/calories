import { NextRequest, NextResponse } from 'next/server';
import { getAllFoods } from '@/data/foodDatabase';
import { searchLiveUSDA } from '@/lib/usdaApi';
import Fuse from 'fuse.js';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const includeLive = searchParams.get('live') !== 'false';

  const localFoods = getAllFoods();
  let localResults = localFoods;

  if (category) {
    localResults = localResults.filter((f) => f.category === category);
  }

  if (tag) {
    localResults = localResults.filter((f) => f.tags.includes(tag));
  }

  if (query.trim()) {
    const fuse = new Fuse(localFoods, {
      keys: [
        { name: 'name', weight: 0.5 },
        { name: 'tags', weight: 0.2 },
        { name: 'categoryName', weight: 0.15 },
        { name: 'brand', weight: 0.15 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
    });
    const fuseResults = fuse.search(query.trim());
    localResults = fuseResults.map((res) => res.item);

    if (category) {
      localResults = localResults.filter((f) => f.category === category);
    }
    if (tag) {
      localResults = localResults.filter((f) => f.tags.includes(tag));
    }
  }

  // Fetch live USDA results dynamically
  let liveUSDAResults: typeof localFoods = [];
  if (includeLive) {
    try {
      const searchTerm = query.trim() || (category ? category.replace(/-/g, ' ') : 'chicken salmon avocado eggs ribeye oats blueberries');
      liveUSDAResults = await searchLiveUSDA(searchTerm, limit);
    } catch (e) {
      console.warn('Live USDA API query skipped or timed out:', e);
    }
  }

  // Merge and deduplicate
  const existingIds = new Set(localResults.map((r) => r.id));
  const combined = [...localResults];

  for (const item of liveUSDAResults) {
    if (!existingIds.has(item.id) && !existingIds.has(item.slug)) {
      combined.push(item);
      existingIds.add(item.id);
    }
  }

  const results = combined.slice(0, limit);

  return NextResponse.json({
    results,
    total: results.length,
    query,
    category,
    tag,
  });
}
