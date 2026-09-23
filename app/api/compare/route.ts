import { NextResponse } from 'next/server';
import { INITIAL_HOSPITALS_DATA } from '@/lib/data/hospitals';
import { HospitalRecord } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { hospitalIds = [] } = body;

    if (!Array.isArray(hospitalIds) || hospitalIds.length === 0) {
      return NextResponse.json({ success: false, error: 'hospitalIds array is required' }, { status: 400 });
    }

    if (hospitalIds.length > 4) {
      return NextResponse.json({ success: false, error: 'Maximum 4 hospitals can be compared simultaneously' }, { status: 400 });
    }

    const hospitals: HospitalRecord[] = INITIAL_HOSPITALS_DATA.filter((h) =>
      hospitalIds.includes(h.id) || hospitalIds.includes(h.slug)
    );

    return NextResponse.json({
      success: true,
      count: hospitals.length,
      data: hospitals,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch comparison data' },
      { status: 500 }
    );
  }
}
