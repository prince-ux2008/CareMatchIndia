import { NextResponse } from 'next/server';
import { INITIAL_HOSPITALS_DATA } from '@/lib/data/hospitals';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const state = searchParams.get('state') || 'Punjab';
  const city = searchParams.get('city');

  if (id) {
    const hospital = INITIAL_HOSPITALS_DATA.find(h => h.id === id || h.slug === id);
    if (!hospital) {
      return NextResponse.json({ success: false, error: 'Hospital not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: hospital });
  }

  let filtered = INITIAL_HOSPITALS_DATA;
  if (state) {
    filtered = filtered.filter(h => h.state.toLowerCase() === state.toLowerCase());
  }
  if (city) {
    filtered = filtered.filter(h => h.city.toLowerCase().includes(city.toLowerCase()));
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    data: filtered,
  });
}
