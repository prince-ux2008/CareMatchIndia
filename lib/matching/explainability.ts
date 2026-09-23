import { HospitalRecord, HospitalTreatment, HealthcareRequirement, MatchExplanation } from '../types';
import { formatINR } from '../utils';

export function generateMatchExplanation(
  hospital: HospitalRecord,
  treatment: HospitalTreatment | undefined,
  requirement: HealthcareRequirement,
  distanceKm: number
): MatchExplanation {
  const whyMatch: string[] = [];
  const whatDoesNotMatch: string[] = [];
  const dataTrustPoints: string[] = [];

  // 1. Treatment Relevance
  if (treatment && treatment.isAvailable) {
    whyMatch.push(`Treatment available: "${treatment.treatmentName}" under ${treatment.departmentName} Department.`);
  } else if (hospital.departments.some(d => d.toLowerCase().includes('cardio') || d.toLowerCase().includes('surgery'))) {
    whyMatch.push(`Relevant clinical department "${hospital.departments[0]}" operational at this facility.`);
  } else {
    whatDoesNotMatch.push(`Exact procedure "${requirement.treatment || requirement.condition}" is not explicitly listed in current hospital tariff catalogue.`);
  }

  // 2. Distance Evaluation
  if (distanceKm <= requirement.radiusKm) {
    whyMatch.push(`Within preferred ${requirement.radiusKm} km radius (${distanceKm.toFixed(1)} km from ${requirement.city}).`);
  } else {
    whatDoesNotMatch.push(`Located ${distanceKm.toFixed(1)} km away, which is outside your initial ${requirement.radiusKm} km radius.`);
  }

  // 3. Budget Compatibility
  if (requirement.budget && treatment) {
    if (treatment.minCost <= requirement.budget && treatment.maxCost <= requirement.budget) {
      whyMatch.push(`Cost estimate (${formatINR(treatment.minCost)} – ${formatINR(treatment.maxCost)}) is fully within your ₹${formatINR(requirement.budget)} budget.`);
    } else if (treatment.minCost <= requirement.budget && treatment.maxCost > requirement.budget) {
      whyMatch.push(`Cost range starts at ${formatINR(treatment.minCost)}, overlapping your stated ${formatINR(requirement.budget)} budget.`);
      whatDoesNotMatch.push(`Upper cost ceiling (${formatINR(treatment.maxCost)}) may exceed your ₹${formatINR(requirement.budget)} budget depending on stent/implant type.`);
    } else if (treatment.minCost > requirement.budget) {
      whatDoesNotMatch.push(`Starting cost (${formatINR(treatment.minCost)}) exceeds your stated budget of ${formatINR(requirement.budget)}.`);
    }
  } else if (treatment && treatment.costType === 'FIXED_GOVT_RATE') {
    whyMatch.push(`Government fixed rates / Subsidized scheme pricing applied.`);
  }

  // 4. Facilities & Emergency
  if (hospital.isEmergency24x7) {
    whyMatch.push(`24/7 Emergency & Critical Care triage active.`);
  }
  const hasCathLab = hospital.facilities.some(f => f.name.toLowerCase().includes('cath lab'));
  if (hasCathLab) {
    whyMatch.push(`Equipped with dedicated Advanced Cardiac Cath Lab.`);
  }

  // 5. Insurance / Coverage
  if (requirement.coveragePreference === 'AYUSHMAN_BHARAT') {
    const acceptsAyushman = hospital.coverage.some(c => c.code === 'AYUSHMAN_BHARAT' && c.isAccepted);
    if (acceptsAyushman) {
      whyMatch.push(`Empanelled for 100% Cashless Ayushman Bharat PM-JAY treatment.`);
    } else {
      whatDoesNotMatch.push(`Ayushman Bharat PM-JAY cashless empanelment not confirmed for this facility.`);
    }
  }

  // 6. Data Trust Points
  if (hospital.overallVerification === 'VERIFIED') {
    dataTrustPoints.push(`✓ Verified Clinical Data — Sourced from ${hospital.primarySource.publisher} (Last Audited: ${hospital.primarySource.lastAuditedAt}).`);
  } else if (hospital.overallVerification === 'OFFICIAL_PUBLIC') {
    dataTrustPoints.push(`🔵 Official Public Source — Registry record retrieved from ${hospital.primarySource.publisher}.`);
  } else {
    dataTrustPoints.push(`🟡 Tariff estimated from regional benchmark audit.`);
  }

  if (treatment?.packageIncludes && treatment.packageIncludes.length > 0) {
    dataTrustPoints.push(`Transparent package breakdown: Includes ${treatment.packageIncludes.slice(0, 3).join(', ')}.`);
  }

  return {
    whyMatch,
    whatDoesNotMatch,
    dataTrustPoints,
  };
}
