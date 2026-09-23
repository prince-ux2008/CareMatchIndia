import { z } from 'zod';

export type VerificationStatus =
  | 'VERIFIED'
  | 'OFFICIAL_PUBLIC'
  | 'ESTIMATED'
  | 'NOT_AVAILABLE'
  | 'POSSIBLY_OUTDATED'
  | 'DEMO_DATA'
  | 'SYNTHETIC_DATA';

export type UserPriority =
  | 'TREATMENT'
  | 'COST'
  | 'DISTANCE'
  | 'FACILITIES'
  | 'COVERAGE'
  | 'VERIFICATION';

export type UrgencyLevel = 'ROUTINE' | 'URGENT' | 'CRITICAL_EMERGENCY';

export type MatchCategory = 'Strong Match' | 'Good Match' | 'Partial Match';

export const HealthcareRequirementSchema = z.object({
  patient: z.enum(['Self', 'Father', 'Mother', 'Spouse', 'Child', 'Relative', 'Unknown']).default('Self'),
  condition: z.string().min(1, 'Medical condition or symptom is required'),
  treatment: z.string().optional(),
  state: z.string().default('Punjab'),
  district: z.string().optional(),
  city: z.string().default('Jalandhar'),
  pincode: z.string().optional(),
  radiusKm: z.number().min(5).max(200).default(30),
  budget: z.number().nullable().optional(),
  priorities: z.array(z.enum(['TREATMENT', 'COST', 'DISTANCE', 'FACILITIES', 'COVERAGE', 'VERIFICATION'])).default(['TREATMENT', 'COST']),
  requiredFacilities: z.array(z.string()).default([]),
  coveragePreference: z.enum(['ANY', 'AYUSHMAN_BHARAT', 'CGHS', 'ESI', 'PRIVATE_INSURANCE', 'SELF_PAY']).default('ANY'),
  urgency: z.enum(['ROUTINE', 'URGENT', 'CRITICAL_EMERGENCY']).default('ROUTINE'),
  language: z.enum(['en', 'hi', 'pa']).default('en'),
});

export type HealthcareRequirement = z.infer<typeof HealthcareRequirementSchema>;

export interface DataSource {
  id: string;
  publisher: string;
  sourceType: 'GOVT_REGISTRY' | 'OFFICIAL_PORTAL' | 'NABH_DIRECTORY' | 'TELEPHONE_AUDIT' | 'PUBLIC_ESTIMATE' | 'SYNTHETIC_BENCHMARK';
  sourceUrl?: string;
  retrievedAt: string;
  lastAuditedAt: string;
  auditNotes?: string;
}

export interface HospitalFacility {
  id: string;
  name: string;
  category: 'ICU' | 'CARDIAC' | 'SURGICAL' | 'DIAGNOSTICS' | 'EMERGENCY' | 'BLOOD_BANK' | 'DIALYSIS' | 'NEO_NATAL' | 'AMBULANCE';
  isAvailable: boolean;
  operationalHours: string;
  verificationStatus: VerificationStatus;
}

export interface HospitalTreatment {
  id: string;
  treatmentName: string;
  treatmentCode: string;
  departmentName: string;
  isAvailable: boolean;
  minCost: number; // in INR
  maxCost: number; // in INR
  costType: 'PACKAGE_ESTIMATE' | 'FIXED_GOVT_RATE' | 'VARIABLE_RANGE' | 'NOT_AVAILABLE';
  packageIncludes?: string[];
  averageStayDays?: number;
  coveredByAyushman: boolean;
  coveredByCGHS: boolean;
  verificationStatus: VerificationStatus;
  dataSourceId: string;
  lastVerifiedAt: string;
}

export interface CoverageScheme {
  id: string;
  name: string;
  code: 'AYUSHMAN_BHARAT' | 'CGHS' | 'ESI' | 'PUNJAB_SARBAT_SEHAT' | 'TPA_CASHLESS';
  isAccepted: boolean;
  verificationStatus: VerificationStatus;
}

export interface HospitalStatistic {
  id: string;
  name: string;
  value: string | number;
  unit?: string;
  timePeriod: string; // e.g. "FY 2024-25"
  sampleSize?: string; // e.g. "N = 1,420 cases"
  source: string;
  sourceUrl?: string;
  verificationStatus: VerificationStatus;
  lastUpdated: string;
}

export interface OutcomeMetric {
  id: string;
  name: string;
  value: string;
  benchmark?: string;
  sampleSize?: string;
  timePeriod: string;
  source: string;
  verificationStatus: VerificationStatus;
  lastUpdated: string;
}

export interface RealTimeData {
  totalBedsAvailable: number;
  icuBedsAvailable: number;
  currentPatients: number;
  occupancyPercent: number;
  lastUpdated: string;
}

export interface TreatmentOutcome {
  treatmentCode: string;
  treatmentName: string;
  recoveryRate: number;       // 0-100 percentage
  avgStayDays: number;
  complicationRate: number;   // 0-100 percentage
  sampleSize: number;
  timePeriod: string;
}

export interface HospitalRecord {
  id: string;
  name: string;
  slug: string;
  type: 'GOVERNMENT_MEDICAL_COLLEGE' | 'NABH_SUPER_SPECIALTY' | 'TRUST_CHARITABLE' | 'MULTI_SPECIALTY' | 'DISTRICT_HOSPITAL';
  country: string;
  state: string;
  stateCode: string;
  district: string;
  city: string;
  pincode: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  emergencyPhone: string;
  isEmergency24x7: boolean;
  departments: string[];
  treatments: HospitalTreatment[];
  facilities: HospitalFacility[];
  coverage: CoverageScheme[];
  statistics?: HospitalStatistic[];
  outcomes?: OutcomeMetric[];
  overallVerification: VerificationStatus;
  dataStatus?: VerificationStatus;
  primarySource: DataSource;
  accreditation: 'NABH_FULL' | 'NABH_ENTRY' | 'NABL_LAB' | 'GOVT_MCI' | 'NONE';
  totalBeds: number;
  icuBeds: number;
  ratingAverage?: number;
  reviewCount?: number;
  summary: string;
  updatedAt: string;
  realTimeData?: RealTimeData;
  treatmentOutcomes?: TreatmentOutcome[];
}

export interface MatchExplanation {
  whyMatch: string[];
  whatDoesNotMatch: string[];
  dataTrustPoints: string[];
}

export interface CareGapItem {
  id: string;
  capabilityName: string;
  category: 'PROCEDURE' | 'SPECIALTY' | 'FACILITY' | 'ICU' | 'EQUIPMENT' | 'EMERGENCY';
  status: 'NOT_LISTED' | 'NOT_VERIFIED' | 'CURRENTLY_UNAVAILABLE';
  reason: string;
}

export interface CareGapResult {
  hospitalId: string;
  hospitalName: string;
  hasCareGap: boolean;
  gaps: CareGapItem[];
  alternativeHospitals: {
    hospital: HospitalRecord;
    verifiedCapabilities: string[];
    distanceKm: number;
    matchScore: number;
  }[];
}

export interface VisualCaseAnalysis {
  id: string;
  caseCategory: string; // e.g. "Dermatology-related care category"
  primaryConcern: string;
  specialtySuggested: string;
  confidenceTier: 'RELEVANT_MATCH' | 'GENERAL_SCREENING' | 'INSUFFICIENT_IMAGE_QUALITY' | 'UNCERTAIN';
  disclaimer: string;
  urgencyAdvice: 'ROUTINE_OPD' | 'TIMELY_EVALUATION' | 'CRITICAL_EMERGENCY';
  suggestedQuestions: string[];
  extractedTags: string[];
  hospitalCompatibility?: {
    hospitalId: string;
    hasRelevantDepartment: boolean;
    departmentName: string;
    relevantServices: string[];
    verificationStatus: VerificationStatus;
    summary: string;
  };
}

export interface HospitalMatchResult {
  hospital: HospitalRecord;
  overallScore: number; // 0 - 100: AI Requirement Match
  conditionSuitability: number; // 0 - 100: Condition / Specialty Suitability Match
  conditionBreakdown: {
    departmentMatch: number; // 0 - 100
    specialistMatch: number; // 0 - 100
    facilityMatch: number;   // 0 - 100
    locationMatch: number;   // 0 - 100
    emergencySupport: number;// 0 - 100
  };
  matchCategory: MatchCategory;
  distanceKm: number;
  matchedTreatment?: HospitalTreatment;
  scoreBreakdown: {
    treatmentScore: number; // 0 - 100
    distanceScore: number;  // 0 - 100
    budgetScore: number;    // 0 - 100
    facilityScore: number;  // 0 - 100
    coverageScore: number;  // 0 - 100
    trustScore: number;     // 0 - 100
  };
  explanation: MatchExplanation;
  careGap?: CareGapResult;
}

export interface ClarificationQuestion {
  id: string;
  field: keyof HealthcareRequirement;
  question: string;
  options: { label: string; value: any }[];
  placeholder?: string;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isEmergency?: boolean;
  extractedRequirement?: Partial<HealthcareRequirement>;
  clarificationNeeded?: ClarificationQuestion[];
  searchResultsSummary?: {
    totalFound: number;
    topMatches: HospitalMatchResult[];
  };
  visualCaseResult?: VisualCaseAnalysis;
}

export interface LocationHierarchy {
  state: string;
  stateCode: string;
  districts: {
    name: string;
    cities: {
      name: string;
      latitude: number;
      longitude: number;
      pincode: string;
    }[];
  }[];
}

export interface UserProfile {
  id: string;
  memberId: string; // e.g. "CM-PB-104582"
  fullName: string;
  email: string;
  phone?: string;
  pincode?: string;
  preferredLanguage: 'en' | 'hi' | 'pa';
  state: string;
  district: string;
  city: string;
  role?: 'citizen' | 'admin' | 'nodal_officer';
  createdAt: string;
}
