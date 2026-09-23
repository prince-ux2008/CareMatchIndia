import { HospitalRecord, HealthcareRequirement, CareGapResult, CareGapItem } from '../types';
import { INITIAL_HOSPITALS_DATA } from '../data/hospitals';
import { calculateHaversineDistance } from '../utils';

export function analyzeCareGap(
  hospital: HospitalRecord,
  requirement: HealthcareRequirement,
  userCoords?: { latitude: number; longitude: number }
): CareGapResult {
  const gaps: CareGapItem[] = [];

  // 1. Check Condition & Specialty
  if (requirement.condition) {
    const condLower = requirement.condition.toLowerCase();
    const hasDept = hospital.departments.some(d => 
      condLower.includes(d.toLowerCase()) || d.toLowerCase().includes(condLower)
    );

    if (!hasDept) {
      // Check if any treatment matches
      const hasTreatment = hospital.treatments.some(t => 
        t.isAvailable && (t.treatmentName.toLowerCase().includes(condLower) || t.departmentName.toLowerCase().includes(condLower))
      );

      if (!hasTreatment) {
        gaps.push({
          id: `gap_spec_${hospital.id}`,
          capabilityName: requirement.condition,
          category: 'SPECIALTY',
          status: 'NOT_LISTED',
          reason: `Specialized ${requirement.condition} department is not listed or verified in official records for ${hospital.name}.`,
        });
      }
    }
  }

  // 2. Check Specific Treatment
  if (requirement.treatment) {
    const treatLower = requirement.treatment.toLowerCase();
    const matchedTreatment = hospital.treatments.find(t => 
      t.treatmentName.toLowerCase().includes(treatLower) || treatLower.includes(t.treatmentName.toLowerCase())
    );

    if (!matchedTreatment) {
      gaps.push({
        id: `gap_treat_${hospital.id}`,
        capabilityName: requirement.treatment,
        category: 'PROCEDURE',
        status: 'NOT_LISTED',
        reason: `Specific procedure "${requirement.treatment}" is not listed in this hospital's verified clinical service registry.`,
      });
    } else if (!matchedTreatment.isAvailable) {
      gaps.push({
        id: `gap_treat_unavail_${hospital.id}`,
        capabilityName: requirement.treatment,
        category: 'PROCEDURE',
        status: 'CURRENTLY_UNAVAILABLE',
        reason: `Procedure "${requirement.treatment}" is listed but currently unconfirmed or paused at this facility.`,
      });
    }
  }

  // 3. Check Required Facilities
  if (requirement.requiredFacilities && requirement.requiredFacilities.length > 0) {
    for (const fac of requirement.requiredFacilities) {
      const facLower = fac.toLowerCase();
      const hasFacility = hospital.facilities.some(f => 
        f.isAvailable && (f.name.toLowerCase().includes(facLower) || f.category.toLowerCase().includes(facLower))
      );

      if (!hasFacility) {
        gaps.push({
          id: `gap_fac_${fac}_${hospital.id}`,
          capabilityName: fac,
          category: 'FACILITY',
          status: 'NOT_VERIFIED',
          reason: `Required clinical facility "${fac}" is not verified at this hospital.`,
        });
      }
    }
  }

  // 4. Find Alternative Hospitals if gaps exist
  const alternativeHospitals: {
    hospital: HospitalRecord;
    verifiedCapabilities: string[];
    distanceKm: number;
    matchScore: number;
  }[] = [];

  if (gaps.length > 0) {
    const originLat = userCoords?.latitude || hospital.latitude;
    const originLon = userCoords?.longitude || hospital.longitude;

    const candidates = INITIAL_HOSPITALS_DATA.filter(h => h.id !== hospital.id);

    for (const cand of candidates) {
      const verifiedCaps: string[] = [];

      for (const gap of gaps) {
        if (gap.category === 'SPECIALTY' && cand.departments.some(d => d.toLowerCase().includes(gap.capabilityName.toLowerCase()))) {
          verifiedCaps.push(`Verified ${gap.capabilityName} Department`);
        } else if (gap.category === 'PROCEDURE' && cand.treatments.some(t => t.isAvailable && t.treatmentName.toLowerCase().includes(gap.capabilityName.toLowerCase()))) {
          verifiedCaps.push(`Verified ${gap.capabilityName}`);
        } else if (gap.category === 'FACILITY' && cand.facilities.some(f => f.isAvailable && f.name.toLowerCase().includes(gap.capabilityName.toLowerCase()))) {
          verifiedCaps.push(`Verified ${gap.capabilityName}`);
        }
      }

      if (verifiedCaps.length > 0) {
        const dist = Math.round(calculateHaversineDistance(originLat, originLon, cand.latitude, cand.longitude));
        const score = Math.min(98, 70 + verifiedCaps.length * 10 - Math.min(25, dist * 0.15));

        alternativeHospitals.push({
          hospital: cand,
          verifiedCapabilities: verifiedCaps,
          distanceKm: dist,
          matchScore: Math.round(score),
        });
      }
    }

    // Sort by verified capability count and proximity
    alternativeHospitals.sort((a, b) => b.verifiedCapabilities.length - a.verifiedCapabilities.length || a.distanceKm - b.distanceKm);
  }

  return {
    hospitalId: hospital.id,
    hospitalName: hospital.name,
    hasCareGap: gaps.length > 0,
    gaps,
    alternativeHospitals: alternativeHospitals.slice(0, 4),
  };
}
