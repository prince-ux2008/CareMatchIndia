import { NextResponse } from 'next/server';
import { INITIAL_HOSPITALS_DATA } from '@/lib/data/hospitals';
import { PRIMARY_DATA_SOURCES } from '@/lib/data/dataSources';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hospitalId = searchParams.get('hospitalId');

  if (hospitalId) {
    const hospital = INITIAL_HOSPITALS_DATA.find((h) => h.id === hospitalId || h.slug === hospitalId);
    if (!hospital) {
      return NextResponse.json({ success: false, error: 'Hospital not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      overallVerification: hospital.overallVerification,
      primarySource: hospital.primarySource,
      updatedAt: hospital.updatedAt,
      treatmentsAudit: hospital.treatments.map((t) => ({
        treatmentName: t.treatmentName,
        code: t.treatmentCode,
        minCost: t.minCost,
        maxCost: t.maxCost,
        costType: t.costType,
        verificationStatus: t.verificationStatus,
        lastVerifiedAt: t.lastVerifiedAt,
      })),
      statisticsAudit: hospital.statistics || [],
      outcomesAudit: hospital.outcomes || [],
    });
  }

  // Summary of all sources
  return NextResponse.json({
    success: true,
    dataSources: PRIMARY_DATA_SOURCES,
    totalHospitals: INITIAL_HOSPITALS_DATA.length,
    verifiedCount: INITIAL_HOSPITALS_DATA.filter((h) => h.overallVerification === 'VERIFIED').length,
    officialPublicCount: INITIAL_HOSPITALS_DATA.filter((h) => h.overallVerification === 'OFFICIAL_PUBLIC').length,
    estimatedCount: INITIAL_HOSPITALS_DATA.filter((h) => h.overallVerification === 'ESTIMATED').length,
    demoDataCount: INITIAL_HOSPITALS_DATA.filter((h) => h.overallVerification === 'DEMO_DATA' || h.overallVerification === 'SYNTHETIC_DATA').length,
  });
}
