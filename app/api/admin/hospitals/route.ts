import { NextResponse } from 'next/server';
import { INITIAL_HOSPITALS_DATA } from '@/lib/data/hospitals';
import { HospitalRecord } from '@/lib/types';

// In-memory / server state for demo persistence
let hospitalRecords: HospitalRecord[] = [...INITIAL_HOSPITALS_DATA];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  let results = [...hospitalRecords];

  if (state && state !== 'All') {
    results = results.filter((h) => h.state.toLowerCase() === state.toLowerCase());
  }

  if (status && status !== 'All') {
    results = results.filter((h) => h.overallVerification === status);
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.departments.some((d) => d.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({
    success: true,
    total: results.length,
    data: results,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newHospital: HospitalRecord = {
      ...body,
      id: body.id || 'hosp_custom_' + Date.now(),
      slug: body.slug || (body.name || 'hospital').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      updatedAt: new Date().toISOString().split('T')[0],
      overallVerification: body.overallVerification || 'DEMO_DATA',
    };

    hospitalRecords.unshift(newHospital);

    return NextResponse.json({
      success: true,
      message: 'Hospital record created successfully',
      data: newHospital,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to create hospital' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Hospital id is required' }, { status: 400 });
    }

    const index = hospitalRecords.findIndex((h) => h.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Hospital not found' }, { status: 404 });
    }

    hospitalRecords[index] = {
      ...hospitalRecords[index],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    return NextResponse.json({
      success: true,
      message: 'Hospital record updated successfully',
      data: hospitalRecords[index],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to update hospital' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'Hospital id is required' }, { status: 400 });
  }

  hospitalRecords = hospitalRecords.filter((h) => h.id !== id);
  return NextResponse.json({
    success: true,
    message: 'Hospital record removed from registry',
  });
}
