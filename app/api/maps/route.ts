import { NextResponse } from 'next/server';
import { getCoordinatesForCity } from '@/lib/data/locations';
import { INITIAL_HOSPITALS_DATA } from '@/lib/data/hospitals';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hospitalId = searchParams.get('hospitalId');
  const originLat = searchParams.get('originLat');
  const originLng = searchParams.get('originLng');
  const travelMode = searchParams.get('mode') || 'driving'; // driving, transit, walking

  if (!hospitalId) {
    return NextResponse.json({ success: false, error: 'hospitalId is required' }, { status: 400 });
  }

  const hospital = INITIAL_HOSPITALS_DATA.find((h) => h.id === hospitalId || h.slug === hospitalId);
  if (!hospital) {
    return NextResponse.json({ success: false, error: 'Hospital not found' }, { status: 404 });
  }

  let origin = '';
  if (originLat && originLng) {
    origin = `${originLat},${originLng}`;
  } else {
    origin = `${hospital.city}, ${hospital.state}`;
  }

  const destination = `${hospital.latitude},${hospital.longitude}`;
  const destinationAddress = encodeURIComponent(`${hospital.name}, ${hospital.address}`);
  
  // Real Google Maps navigation URL
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${destination}&destination_place_id=${encodeURIComponent(hospital.name)}&travelmode=${travelMode}`;

  return NextResponse.json({
    success: true,
    hospital: {
      id: hospital.id,
      name: hospital.name,
      address: hospital.address,
      latitude: hospital.latitude,
      longitude: hospital.longitude,
      phone: hospital.phone,
      emergencyPhone: hospital.emergencyPhone,
    },
    directionsUrl,
    travelMode,
  });
}
