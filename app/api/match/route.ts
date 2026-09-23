import { NextResponse } from 'next/server';
import { HealthcareRequirementSchema } from '@/lib/types';
import { INITIAL_HOSPITALS_DATA } from '@/lib/data/hospitals';
import { matchingEngine } from '@/lib/matching';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = HealthcareRequirementSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid requirement payload',
          issues: parseResult.error.issues,
        },
        { status: 400 }
      );
    }

    const requirement = parseResult.data;
    const matches = matchingEngine.match(requirement, INITIAL_HOSPITALS_DATA);

    return NextResponse.json({
      success: true,
      totalMatched: matches.length,
      requirement,
      results: matches.slice(0, 8),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Matching calculation failed' },
      { status: 500 }
    );
  }
}
