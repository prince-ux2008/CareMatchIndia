import { HospitalRecord, RealTimeData, TreatmentOutcome } from '../types';

/**
 * Deterministic pseudo-random generator seeded by hospital ID.
 * Produces consistent "real-time" data for demo/hackathon purposes.
 */
function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return () => {
    hash = (hash * 16807) % 2147483647;
    return (hash & 0x7fffffff) / 0x7fffffff;
  };
}

/**
 * Generate simulated real-time bed availability and patient volume data.
 * Based on hospital type, total beds, and ICU capacity.
 */
export function generateRealTimeData(hospital: HospitalRecord): RealTimeData {
  const rng = seededRandom(hospital.id + '_rt');

  // Occupancy rates by hospital type
  const occupancyRanges: Record<string, [number, number]> = {
    'GOVERNMENT_MEDICAL_COLLEGE': [72, 92],
    'NABH_SUPER_SPECIALTY': [58, 82],
    'TRUST_CHARITABLE': [65, 85],
    'MULTI_SPECIALTY': [55, 78],
    'DISTRICT_HOSPITAL': [60, 88],
  };

  const [minOcc, maxOcc] = occupancyRanges[hospital.type] || [60, 85];
  const occupancyPercent = Math.round(minOcc + rng() * (maxOcc - minOcc));

  const occupiedBeds = Math.round(hospital.totalBeds * occupancyPercent / 100);
  const totalBedsAvailable = Math.max(0, hospital.totalBeds - occupiedBeds);

  // ICU occupancy is typically higher
  const icuOccupancy = Math.min(98, occupancyPercent + Math.round(rng() * 12));
  const icuOccupied = Math.round(hospital.icuBeds * icuOccupancy / 100);
  const icuBedsAvailable = Math.max(0, hospital.icuBeds - icuOccupied);

  // Current patients = occupied beds + some outpatient flow
  const outpatientFactor = hospital.type === 'GOVERNMENT_MEDICAL_COLLEGE' ? 2.5 : 1.8;
  const currentPatients = Math.round(occupiedBeds * outpatientFactor);

  // Use current hour for "last updated" timestamp
  const now = new Date();
  const minutesAgo = Math.round(rng() * 25) + 5; // 5-30 minutes ago
  const lastUpdated = new Date(now.getTime() - minutesAgo * 60000).toISOString();

  return {
    totalBedsAvailable,
    icuBedsAvailable,
    currentPatients,
    occupancyPercent,
    lastUpdated,
  };
}

/**
 * Generate simulated treatment outcome data (recovery rates, complication rates).
 * Based on hospital accreditation level and treatment type.
 */
export function generateTreatmentOutcomes(hospital: HospitalRecord): TreatmentOutcome[] {
  const rng = seededRandom(hospital.id + '_outcomes');

  // Base recovery rates by accreditation
  const accreditationBonus: Record<string, number> = {
    'NABH_FULL': 6,
    'NABH_ENTRY': 3,
    'NABL_LAB': 2,
    'GOVT_MCI': 4,
    'NONE': 0,
  };

  const bonus = accreditationBonus[hospital.accreditation] || 0;

  // Treatment-specific base recovery rates
  const treatmentBaseRecovery: Record<string, number> = {
    'CARD-ANGIO-01': 94,
    'UROL-STONE-01': 96,
    'NEPH-DIAL-01': 78,
    'ONCO-CHEMO-01': 68,
    'ORTHO-TKR-01': 92,
    'CARD-CABG-01': 91,
    'GEN-SURG-01': 88,
    'ORTHO-TRAUMA-01': 90,
    'EMG-INPAT-01': 85,
  };

  const treatmentBaseComplication: Record<string, number> = {
    'CARD-ANGIO-01': 3.2,
    'UROL-STONE-01': 2.1,
    'NEPH-DIAL-01': 5.8,
    'ONCO-CHEMO-01': 12.5,
    'ORTHO-TKR-01': 4.5,
    'CARD-CABG-01': 5.0,
    'GEN-SURG-01': 3.8,
    'ORTHO-TRAUMA-01': 4.2,
    'EMG-INPAT-01': 6.0,
  };

  return hospital.treatments.map(t => {
    const baseRecovery = treatmentBaseRecovery[t.treatmentCode] || 85;
    const baseComplication = treatmentBaseComplication[t.treatmentCode] || 5.0;

    // Apply accreditation bonus and small random variance
    const variance = (rng() - 0.5) * 4; // +/-2%
    const recoveryRate = Math.min(99.5, Math.max(60, baseRecovery + bonus + variance));
    const compVariance = (rng() - 0.5) * 2;
    const complicationRate = Math.max(0.5, baseComplication - bonus * 0.3 + compVariance);

    // Sample sizes based on hospital volume
    const volumeMultiplier = hospital.type === 'GOVERNMENT_MEDICAL_COLLEGE' ? 3 : 
                             hospital.type === 'NABH_SUPER_SPECIALTY' ? 2 : 1;
    const sampleSize = Math.round((200 + rng() * 800) * volumeMultiplier);

    return {
      treatmentCode: t.treatmentCode,
      treatmentName: t.treatmentName,
      recoveryRate: Math.round(recoveryRate * 10) / 10,
      avgStayDays: t.averageStayDays || Math.round(1 + rng() * 4),
      complicationRate: Math.round(complicationRate * 10) / 10,
      sampleSize,
      timePeriod: 'FY 2024-25',
    };
  });
}
