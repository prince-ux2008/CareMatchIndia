import { NextResponse } from 'next/server';
import { extractHealthcareRequirement } from '@/lib/nlp/extractor';
import { INITIAL_HOSPITALS_DATA } from '@/lib/data/hospitals';
import { matchingEngine } from '@/lib/matching';
import { HealthcareRequirement } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const state = searchParams.get('state') || 'Punjab';
  const city = searchParams.get('city') || 'Jalandhar';
  const radius = parseInt(searchParams.get('radius') || '30', 10);
  const budgetParam = searchParams.get('budget');
  const budget = budgetParam ? parseInt(budgetParam, 10) : null;

  const extracted = extractHealthcareRequirement(q || 'General Hospital Checkup in Jalandhar');

  const requirement: HealthcareRequirement = {
    patient: extracted.requirement.patient || 'Self',
    condition: extracted.requirement.condition || q || 'General Medical Consultation',
    treatment: extracted.requirement.treatment || undefined,
    state: state,
    district: extracted.requirement.district || 'Jalandhar',
    city: city,
    radiusKm: radius,
    budget: budget !== null ? budget : extracted.requirement.budget,
    priorities: extracted.requirement.priorities || ['TREATMENT', 'COST'],
    requiredFacilities: [],
    coveragePreference: 'ANY',
    urgency: 'ROUTINE',
    language: 'en',
  };

  const matches = matchingEngine.match(requirement, INITIAL_HOSPITALS_DATA);

  return NextResponse.json({
    success: true,
    query: q,
    requirement,
    total: matches.length,
    results: matches,
  });
}
