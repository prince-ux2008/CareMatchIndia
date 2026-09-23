import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, count } = body;

    const item = {
      id: 'search_' + Date.now(),
      query: query || 'Healthcare Search',
      timestamp: new Date().toISOString(),
      resultsCount: count || 0,
    };

    return NextResponse.json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to save history' }, { status: 500 });
  }
}
