import {
  HospitalRecord,
  HospitalTreatment,
  HealthcareRequirement,
  HospitalMatchResult,
  MatchCategory,
  UserPriority,
} from '../types';
import { calculateHaversineDistance } from '../utils';
import { getCoordinatesForCity } from '../data/locations';
import { generateMatchExplanation } from './explainability';

export interface MatchingWeights {
  treatment: number;
  distance: number;
  budget: number;
  facility: number;
  coverage: number;
  trust: number;
}

export interface IMatchingModel {
  name: string;
  version: string;
  match(
    requirement: HealthcareRequirement,
    candidates: HospitalRecord[]
  ): HospitalMatchResult[];
}

// 1. Base Weight Scaler according to user priorities
export function computePriorityWeights(priorities: UserPriority[]): MatchingWeights {
  const base: MatchingWeights = {
    treatment: 0.35,
    distance: 0.18,
    budget: 0.22,
    facility: 0.12,
    coverage: 0.05,
    trust: 0.08,
  };

  if (!priorities || priorities.length === 0) return base;

  // Boost selected priorities dynamically
  const boostFactor = 0.15 / priorities.length;
  for (const p of priorities) {
    if (p === 'TREATMENT') base.treatment += boostFactor;
    if (p === 'DISTANCE') base.distance += boostFactor;
    if (p === 'COST') base.budget += boostFactor;
    if (p === 'FACILITIES') base.facility += boostFactor;
    if (p === 'COVERAGE') base.coverage += boostFactor;
    if (p === 'VERIFICATION') base.trust += boostFactor;
  }

  // Normalize total weights to 1.0
  const sum =
    base.treatment +
    base.distance +
    base.budget +
    base.facility +
    base.coverage +
    base.trust;

  return {
    treatment: base.treatment / sum,
    distance: base.distance / sum,
    budget: base.budget / sum,
    facility: base.facility / sum,
    coverage: base.coverage / sum,
    trust: base.trust / sum,
  };
}

// Specialty keyword map for disease matching
const SPECIALTY_KEYWORDS: Record<string, string[]> = {
  cardiac: ['heart', 'cardio', 'angioplasty', 'stent', 'bypass', 'cabg', 'attack', 'cag', 'dil', 'chest pain', 'valve', 'pacemaker'],
  urology: ['kidney', 'stone', 'renal', 'nephro', 'dialysis', 'urinary', 'prostate', 'pcnl', 'rirs', 'gurda', 'pathri', 'lithotripsy'],
  ortho: ['bone', 'knee', 'joint', 'fracture', 'hip', 'spine', 'tkr', 'thr', 'haddi', 'ghutna', 'ligament', 'trauma', 'orthopedic'],
  onco: ['cancer', 'tumor', 'chemo', 'radiation', 'oncology', 'biopsy', 'carcinoma', 'malignancy'],
  eye: ['eye', 'cataract', 'phaco', 'retina', 'cornea', 'vision', 'lasik', 'glaucoma', 'motiyabind', 'motia', 'ophthalmology'],
  neuro: ['brain', 'stroke', 'spine', 'neuro', 'paralysis', 'seizure', 'epilepsy', 'head injury', 'craniotomy', 'lakwa'],
  gastro: ['liver', 'stomach', 'endoscopy', 'gastric', 'jaundice', 'colon', 'pancreas', 'hepatitis', 'gastroenterology'],
  gynae: ['pregnancy', 'delivery', 'maternity', 'cesarean', 'gynae', 'c-section', 'ivf', 'fertility', 'women'],
  emergency: ['emergency', 'icu', 'trauma', 'critical', 'ambulance', '24x7', 'ventilator', 'accidental'],
  ent: ['ent', 'ear', 'nose', 'throat', 'sinus', 'tonsil', 'cochlear'],
};

// 2. Individual dimension compatibility calculators
function calculateTreatmentScore(
  hospital: HospitalRecord,
  reqTreatmentName?: string,
  reqCondition?: string
): { score: number; matchedTreatment?: HospitalTreatment; isSpecialtyMatch: boolean } {
  if (!reqTreatmentName && !reqCondition) {
    return { score: 80, matchedTreatment: hospital.treatments[0], isSpecialtyMatch: true };
  }

  const query = `${reqTreatmentName || ''} ${reqCondition || ''}`.toLowerCase();
  
  // Find which specialty category the user query belongs to
  let targetCategory: string | null = null;
  for (const [cat, keywords] of Object.entries(SPECIALTY_KEYWORDS)) {
    if (keywords.some(kw => query.includes(kw))) {
      targetCategory = cat;
      break;
    }
  }

  // Exact or keyword match on treatments
  for (const t of hospital.treatments) {
    const tName = t.treatmentName.toLowerCase();
    const tDept = t.departmentName.toLowerCase();
    
    if (tName.includes(query) || query.includes(tName.split(' ')[0])) {
      return { score: t.isAvailable ? 100 : 35, matchedTreatment: t, isSpecialtyMatch: true };
    }

    if (targetCategory === 'cardiac' && (tDept.includes('cardio') || tName.includes('angio') || tName.includes('cabg') || tName.includes('cag') || tName.includes('stent'))) {
      return { score: t.isAvailable ? 98 : 30, matchedTreatment: t, isSpecialtyMatch: true };
    }
    if (targetCategory === 'urology' && (tDept.includes('uro') || tDept.includes('nephro') || tName.includes('stone') || tName.includes('dialysis') || tName.includes('rirs') || tName.includes('pcnl'))) {
      return { score: t.isAvailable ? 98 : 30, matchedTreatment: t, isSpecialtyMatch: true };
    }
    if (targetCategory === 'ortho' && (tDept.includes('ortho') || tName.includes('knee') || tName.includes('fracture') || tName.includes('replacement') || tName.includes('joint'))) {
      return { score: t.isAvailable ? 98 : 30, matchedTreatment: t, isSpecialtyMatch: true };
    }
    if (targetCategory === 'onco' && (tDept.includes('onco') || tName.includes('chemo') || tName.includes('cancer') || tName.includes('radiation'))) {
      return { score: t.isAvailable ? 98 : 30, matchedTreatment: t, isSpecialtyMatch: true };
    }
    if (targetCategory === 'eye' && (tDept.includes('eye') || tDept.includes('ophthal') || tName.includes('cataract') || tName.includes('phaco') || tName.includes('retina'))) {
      return { score: t.isAvailable ? 98 : 30, matchedTreatment: t, isSpecialtyMatch: true };
    }
    if (targetCategory === 'neuro' && (tDept.includes('neuro') || tName.includes('stroke') || tName.includes('brain') || tName.includes('spine'))) {
      return { score: t.isAvailable ? 98 : 30, matchedTreatment: t, isSpecialtyMatch: true };
    }
  }

  // Department level match
  for (const dept of hospital.departments) {
    const dLower = dept.toLowerCase();
    if (targetCategory === 'cardiac' && (dLower.includes('cardio') || dLower.includes('cardiac'))) {
      return { score: 90, matchedTreatment: hospital.treatments[0], isSpecialtyMatch: true };
    }
    if (targetCategory === 'urology' && (dLower.includes('nephro') || dLower.includes('uro') || dLower.includes('renal'))) {
      return { score: 90, matchedTreatment: hospital.treatments[0], isSpecialtyMatch: true };
    }
    if (targetCategory === 'ortho' && (dLower.includes('ortho') || dLower.includes('joint') || dLower.includes('bone'))) {
      return { score: 90, matchedTreatment: hospital.treatments[0], isSpecialtyMatch: true };
    }
    if (targetCategory === 'onco' && (dLower.includes('onco') || dLower.includes('cancer'))) {
      return { score: 90, matchedTreatment: hospital.treatments[0], isSpecialtyMatch: true };
    }
    if (targetCategory === 'eye' && (dLower.includes('eye') || dLower.includes('ophthal'))) {
      return { score: 90, matchedTreatment: hospital.treatments[0], isSpecialtyMatch: true };
    }
    if (targetCategory === 'neuro' && dLower.includes('neuro')) {
      return { score: 90, matchedTreatment: hospital.treatments[0], isSpecialtyMatch: true };
    }
  }

  // If multispecialty hospital with broad coverage
  if (hospital.departments.length >= 6 || hospital.type === 'GOVERNMENT_MEDICAL_COLLEGE') {
    return { score: 65, matchedTreatment: hospital.treatments[0], isSpecialtyMatch: true };
  }

  // If a specific specialty was searched but hospital doesn't have it
  if (targetCategory) {
    return { score: 20, matchedTreatment: undefined, isSpecialtyMatch: false };
  }

  return { score: 50, matchedTreatment: undefined, isSpecialtyMatch: true };
}

function calculateDistanceScore(distanceKm: number, radiusKm: number): number {
  if (distanceKm <= 5) return 100;
  if (distanceKm <= radiusKm) {
    // Smooth decay within radius
    return Math.max(75, 100 - (distanceKm / radiusKm) * 25);
  }
  // Decay beyond radius
  const excess = distanceKm - radiusKm;
  return Math.max(10, 70 - (excess / Math.max(radiusKm, 30)) * 35);
}

function calculateBudgetScore(
  userBudget: number | null | undefined,
  treatment?: HospitalTreatment
): number {
  if (!userBudget) return 90;
  if (!treatment || treatment.minCost === 0) return 92;
  
  // If treatment is fully covered under user budget
  if (treatment.maxCost <= userBudget) {
    return 100;
  }
  // If minCost is within budget and maxCost is slightly above
  if (treatment.minCost <= userBudget && treatment.maxCost > userBudget) {
    const range = treatment.maxCost - treatment.minCost;
    const overlap = userBudget - treatment.minCost;
    const fraction = range > 0 ? overlap / range : 0.5;
    return Math.round(75 + fraction * 20); // 75 to 95
  }
  // If minCost is above budget
  if (treatment.minCost > userBudget) {
    const deficitRatio = (treatment.minCost - userBudget) / userBudget;
    if (deficitRatio <= 0.25) return 65; // Within 25% stretch
    if (deficitRatio <= 0.50) return 45; // Within 50% stretch
    return Math.max(10, Math.round(40 - deficitRatio * 20));
  }
  return 85;
}

function calculateFacilityScore(
  hospital: HospitalRecord,
  requiredFacilities: string[]
): number {
  let score = 75;
  if (hospital.isEmergency24x7) score += 15;
  if (hospital.facilities.some(f => f.name.toLowerCase().includes('cath lab') || f.name.toLowerCase().includes('icu'))) score += 10;
  if (hospital.icuBeds > 30) score += 5;

  if (requiredFacilities.length > 0) {
    const matchedCount = requiredFacilities.filter(rf =>
      hospital.facilities.some(hf => hf.name.toLowerCase().includes(rf.toLowerCase()) && hf.isAvailable)
    ).length;
    score = Math.round((matchedCount / requiredFacilities.length) * 100);
  }
  return Math.min(100, score);
}

function calculateCoverageScore(
  hospital: HospitalRecord,
  preference: string
): number {
  if (preference === 'ANY' || !preference) return 90;
  if (preference === 'AYUSHMAN_BHARAT') {
    const ok = hospital.coverage.some(c => c.code === 'AYUSHMAN_BHARAT' && c.isAccepted);
    return ok ? 100 : 30;
  }
  if (preference === 'CGHS') {
    const ok = hospital.coverage.some(c => c.code === 'CGHS' && c.isAccepted);
    return ok ? 100 : 40;
  }
  return 80;
}

function calculateTrustScore(hospital: HospitalRecord): number {
  switch (hospital.overallVerification) {
    case 'VERIFIED':
      return 100;
    case 'OFFICIAL_PUBLIC':
      return 90;
    case 'ESTIMATED':
      return 70;
    case 'DEMO_DATA':
      return 55;
    default:
      return 45;
  }
}

// Normalizer to prevent duplicate hospital names
function normalizeHospitalName(name: string): string {
  return name
    .toLowerCase()
    .replace(/^(the|dr\.?|shri|sri)\s+/i, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

// 3. RuleBasedMatcher implementation with strict deduplication & disease ranking
export class RuleBasedMatcher implements IMatchingModel {
  name = 'RuleBasedMatcher';
  version = '2.1.0';

  match(requirement: HealthcareRequirement, candidates: HospitalRecord[]): HospitalMatchResult[] {
    const weights = computePriorityWeights(requirement.priorities);
    const userCoords = getCoordinatesForCity(requirement.state, requirement.city);

    // Track seen hospital names and IDs for strict deduplication
    const seenHospitalNames = new Set<string>();
    const seenHospitalIds = new Set<string>();

    const rawResults: HospitalMatchResult[] = [];

    for (const hospital of candidates) {
      if (!hospital || !hospital.name) continue;

      const normName = normalizeHospitalName(hospital.name);
      if (seenHospitalIds.has(hospital.id) || seenHospitalNames.has(normName)) {
        continue; // Skip duplicate hospital!
      }

      // Treatment / Disease match evaluation
      const treatmentRes = calculateTreatmentScore(hospital, requirement.treatment, requirement.condition);
      
      // If user searched a specific medical disease/specialty and this hospital has zero capability in that area, filter it out
      if (!treatmentRes.isSpecialtyMatch && treatmentRes.score < 30) {
        continue;
      }

      seenHospitalIds.add(hospital.id);
      seenHospitalNames.add(normName);

      const distanceKm = calculateHaversineDistance(
        userCoords.latitude,
        userCoords.longitude,
        hospital.latitude,
        hospital.longitude
      );

      const treatmentScore = treatmentRes.score;
      const distanceScore = calculateDistanceScore(distanceKm, requirement.radiusKm);
      const budgetScore = calculateBudgetScore(requirement.budget, treatmentRes.matchedTreatment);
      const facilityScore = calculateFacilityScore(hospital, requirement.requiredFacilities);
      const coverageScore = calculateCoverageScore(hospital, requirement.coveragePreference);
      const trustScore = calculateTrustScore(hospital);

      // Bed availability bonus/penalty
      const bedBonus = hospital.realTimeData
        ? (hospital.realTimeData.totalBedsAvailable > 20 ? 5 :
           hospital.realTimeData.totalBedsAvailable > 5 ? 2 :
           hospital.realTimeData.totalBedsAvailable > 0 ? 0 : -6)
        : 0;

      // Budget boost if within budget
      const budgetBonus = requirement.budget && treatmentRes.matchedTreatment && treatmentRes.matchedTreatment.maxCost <= requirement.budget ? 4 : 0;

      const rawOverall =
        treatmentScore * weights.treatment +
        distanceScore * weights.distance +
        budgetScore * weights.budget +
        facilityScore * weights.facility +
        coverageScore * weights.coverage +
        trustScore * weights.trust +
        bedBonus +
        budgetBonus;

      const overallScore = Math.min(99, Math.max(20, Math.round(rawOverall)));

      // Calculate condition / specialty suitability breakdown
      const departmentMatch = treatmentRes.score >= 80 ? Math.min(98, treatmentRes.score + 2) : Math.max(40, treatmentRes.score);
      const specialistMatch = treatmentRes.matchedTreatment ? (treatmentRes.matchedTreatment.isAvailable ? 95 : 45) : 60;
      const facilityMatch = Math.min(96, Math.max(45, facilityScore));
      const locationMatch = Math.min(98, Math.max(30, Math.round(distanceScore)));
      const emergencySupport = hospital.isEmergency24x7 ? (hospital.icuBeds >= 25 ? 96 : 88) : 55;

      // Condition Suitability score (Clinical capability match)
      const conditionSuitability = Math.min(
        98,
        Math.max(
          25,
          Math.round(
            departmentMatch * 0.40 +
            specialistMatch * 0.25 +
            facilityMatch * 0.15 +
            emergencySupport * 0.10 +
            locationMatch * 0.10
          )
        )
      );

      let matchCategory: MatchCategory = 'Partial Match';
      if (overallScore >= 80) matchCategory = 'Strong Match';
      else if (overallScore >= 60) matchCategory = 'Good Match';

      const explanation = generateMatchExplanation(
        hospital,
        treatmentRes.matchedTreatment,
        requirement,
        distanceKm
      );

      rawResults.push({
        hospital,
        overallScore,
        conditionSuitability,
        conditionBreakdown: {
          departmentMatch,
          specialistMatch,
          facilityMatch,
          locationMatch,
          emergencySupport,
        },
        matchCategory,
        distanceKm,
        matchedTreatment: treatmentRes.matchedTreatment,
        scoreBreakdown: {
          treatmentScore,
          distanceScore,
          budgetScore,
          facilityScore,
          coverageScore,
          trustScore,
        },
        explanation,
      });
    }

    // Sort descending by overallScore, then by conditionSuitability, then by distance
    return rawResults.sort((a, b) => 
      b.overallScore - a.overallScore || 
      b.conditionSuitability - a.conditionSuitability || 
      a.distanceKm - b.distanceKm
    );
  }
}

export class SemanticMatcher extends RuleBasedMatcher {
  override name = 'SemanticMatcher';
  override version = '2.1.0';
}

export class FutureMLRanker implements IMatchingModel {
  name = 'FutureMLRanker (Learning-to-Rank LTR Framework)';
  version = '3.0.0';

  match(requirement: HealthcareRequirement, candidates: HospitalRecord[]): HospitalMatchResult[] {
    const fallback = new SemanticMatcher();
    return fallback.match(requirement, candidates);
  }
}

// Export default singleton
export const matchingEngine = new SemanticMatcher();
