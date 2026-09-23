import { NextResponse } from 'next/server';
import { INDIAN_STATES, LOCATION_DATA } from '@/lib/data/locations';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');

  if (state && LOCATION_DATA[state]) {
    return NextResponse.json({
      success: true,
      data: LOCATION_DATA[state],
    });
  }

  return NextResponse.json({
    success: true,
    states: INDIAN_STATES,
    hierarchy: LOCATION_DATA,
  });
}
