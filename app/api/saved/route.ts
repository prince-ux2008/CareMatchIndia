import { NextResponse } from 'next/server';
import { INITIAL_HOSPITALS_DATA } from '@/lib/data/hospitals';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ids = [] } = body;

    const savedList = INITIAL_HOSPITALS_DATA.filter((h) => ids.includes(h.id));
    return NextResponse.json({
      success: true,
      count: savedList.length,
      data: savedList,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to process saved request' }, { status: 500 });
  }
}
