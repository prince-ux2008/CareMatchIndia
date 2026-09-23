import { NextResponse } from 'next/server';
import { extractHealthcareRequirement } from '@/lib/nlp/extractor';
import { HealthcareRequirementSchema } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, language = 'en' } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ success: false, error: 'Query string is required' }, { status: 400 });
    }

    const extraction = extractHealthcareRequirement(query);

    if (extraction.isEmergency) {
      return NextResponse.json({
        success: true,
        isEmergency: true,
        message: 'Possible Emergency Detected. Immediate medical attention advised.',
        requirement: extraction.requirement,
      });
    }

    const parseResult = HealthcareRequirementSchema.safeParse({
      patient: extraction.requirement.patient || 'Self',
      condition: extraction.requirement.condition || 'General Healthcare',
      treatment: extraction.requirement.treatment,
      state: extraction.requirement.state || 'Punjab',
      district: extraction.requirement.district,
      city: extraction.requirement.city || 'Jalandhar',
      pincode: extraction.requirement.pincode,
      radiusKm: extraction.requirement.radiusKm || 30,
      budget: extraction.requirement.budget || null,
      priorities: extraction.requirement.priorities || ['TREATMENT', 'COST'],
      requiredFacilities: extraction.requirement.requiredFacilities || [],
      coveragePreference: extraction.requirement.coveragePreference || 'ANY',
      urgency: extraction.requirement.urgency || 'ROUTINE',
      language: language,
    });

    return NextResponse.json({
      success: true,
      isEmergency: false,
      isValid: parseResult.success,
      requirement: parseResult.success ? parseResult.data : extraction.requirement,
      errors: parseResult.success ? null : parseResult.error.format(),
      clarifications: extraction.clarifications,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to extract requirements' },
      { status: 500 }
    );
  }
}
