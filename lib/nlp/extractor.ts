import { HealthcareRequirement, HealthcareRequirementSchema, ClarificationQuestion } from '../types';

export interface ExtractorResult {
  isEmergency: boolean;
  emergencyReason?: string;
  requirement: Partial<HealthcareRequirement>;
  missingFields: (keyof HealthcareRequirement)[];
  clarifications: ClarificationQuestion[];
  rawText: string;
}

// Emergency Keywords Detector
const EMERGENCY_PATTERNS = [
  /\b(severe chest pain|heart attack|crushing chest pain|sweating profusely|left arm pain)\b/i,
  /\b(cannot breathe|severe breathing difficulty|choking|gasping for air|suffocating)\b/i,
  /\b(unconscious|fainted|loss of consciousness|unresponsive|collapsed)\b/i,
  /\b(stroke|paralysis|facial drooping|slurred speech|sudden weakness)\b/i,
  /\b(uncontrolled bleeding|heavy blood loss|arterial bleed|gushing blood)\b/i,
  /\b(chati me tez dard|behosh|saans nahi aa rahi|khun nahi ruk raha)\b/i,
  /\b(ਛਾਤੀ ਵਿੱਚ ਤੇਜ਼ ਦਰਦ|ਬੇਹੋਸ਼|ਸਾਹ ਨਹੀਂ ਆ ਰਿਹਾ)\b/i,
];

// Clinical synonym dictionary for semantic normalization
const CLINICAL_MAPPINGS: Record<string, { condition: string; treatment: string; department: string }> = {
  // Cardiology
  'angioplasty': { condition: 'Coronary Artery Disease / Heart Blockage', treatment: 'Coronary Angioplasty (PTCA with Stent)', department: 'Cardiology' },
  'heart attack': { condition: 'Acute Coronary Syndrome', treatment: 'Emergency Primary Angioplasty', department: 'Cardiology' },
  'heart problem': { condition: 'Cardiovascular Condition', treatment: 'Coronary Angioplasty (PTCA with Stent)', department: 'Cardiology' },
  'heart': { condition: 'Cardiac Condition', treatment: 'Coronary Angioplasty (PTCA with Stent)', department: 'Cardiology' },
  'dil ki bimari': { condition: 'Heart Disease', treatment: 'Coronary Angioplasty (PTCA with Stent)', department: 'Cardiology' },
  'dil da daura': { condition: 'Heart Attack', treatment: 'Emergency Primary Angioplasty', department: 'Cardiology' },
  'stent': { condition: 'Heart Artery Blockage', treatment: 'Coronary Angioplasty (PTCA with Stent)', department: 'Cardiology' },
  'bypass': { condition: 'Severe Multi-vessel CAD', treatment: 'Coronary Artery Bypass Graft (CABG / Open Heart Surgery)', department: 'Cardiac Surgery' },
  'cag': { condition: 'Heart Diagnostic Check', treatment: 'Coronary Angiography (CAG)', department: 'Cardiology' },
  'angiography': { condition: 'Suspected Artery Blockage', treatment: 'Coronary Angiography (CAG)', department: 'Cardiology' },
  
  // Nephrology / Urology / Kidney
  'kidney stone': { condition: 'Nephrolithiasis / Renal Calculi', treatment: 'Kidney Stone Laser Removal (RIRS / PCNL)', department: 'Urology' },
  'kidney': { condition: 'Kidney & Renal Condition', treatment: 'Kidney Stone Laser Removal (RIRS / PCNL)', department: 'Urology' },
  'gurda': { condition: 'Kidney Condition', treatment: 'Kidney Stone Laser Removal (RIRS / PCNL)', department: 'Urology' },
  'gurde': { condition: 'Kidney Condition', treatment: 'Kidney Stone Laser Removal (RIRS / PCNL)', department: 'Urology' },
  'gurdi ki pathri': { condition: 'Kidney Stone', treatment: 'Kidney Stone Laser Removal (RIRS / PCNL)', department: 'Urology' },
  'gurde di pathri': { condition: 'Kidney Stone', treatment: 'Kidney Stone Laser Removal (RIRS / PCNL)', department: 'Urology' },
  'pathri': { condition: 'Kidney / Urinary Stone', treatment: 'Kidney Stone Laser Removal (RIRS / PCNL)', department: 'Urology' },
  'dialysis': { condition: 'End Stage Renal Disease / Chronic Kidney Disease', treatment: 'Hemodialysis (PMNDP Free / Subsidized)', department: 'Nephrology' },
  
  // Orthopedics / Bone / Knee
  'knee replacement': { condition: 'Severe Osteoarthritis of Knee', treatment: 'Total Knee Replacement (TKR)', department: 'Orthopedics' },
  'knee': { condition: 'Knee Joint Degeneration', treatment: 'Total Knee Replacement (TKR)', department: 'Orthopedics' },
  'ghutna badalna': { condition: 'Knee Joint Degeneration', treatment: 'Total Knee Replacement (TKR)', department: 'Orthopedics' },
  'ghutne ka operation': { condition: 'Knee Joint Pain', treatment: 'Total Knee Replacement (TKR)', department: 'Orthopedics' },
  'ghutna': { condition: 'Knee Joint Pain', treatment: 'Total Knee Replacement (TKR)', department: 'Orthopedics' },
  'bone fracture': { condition: 'Trauma / Bone Fracture', treatment: 'Orthopedic Fracture Fixation Surgery (Trauma)', department: 'Orthopedics' },
  'fracture': { condition: 'Trauma / Bone Fracture', treatment: 'Orthopedic Fracture Fixation Surgery (Trauma)', department: 'Orthopedics' },
  'haddi tut gayi': { condition: 'Orthopedic Fracture', treatment: 'Orthopedic Fracture Fixation Surgery (Trauma)', department: 'Orthopedics' },
  'haddi': { condition: 'Orthopedic Condition', treatment: 'Orthopedic Fracture Fixation Surgery (Trauma)', department: 'Orthopedics' },
  
  // Oncology / Cancer
  'cancer': { condition: 'Oncological Malignancy', treatment: 'Chemotherapy Infusion Cycle', department: 'Oncology' },
  'chemo': { condition: 'Cancer Treatment', treatment: 'Chemotherapy Infusion Cycle', department: 'Oncology' },
  'chemotherapy': { condition: 'Cancer Treatment', treatment: 'Chemotherapy Infusion Cycle', department: 'Oncology' },
  
  // Ophthalmology / Eye
  'cataract': { condition: 'Lens Opacity / Cataract', treatment: 'Cataract Eye Surgery (Phacoemulsification with Foldable IOL)', department: 'Eye Care' },
  'motiyabind': { condition: 'Cataract', treatment: 'Cataract Eye Surgery (Phacoemulsification with Foldable IOL)', department: 'Eye Care' },
  'motia': { condition: 'Cataract Eye Condition', treatment: 'Cataract Eye Surgery (Phacoemulsification with Foldable IOL)', department: 'Eye Care' },
  'eye': { condition: 'Eye Vision Condition', treatment: 'Cataract Eye Surgery (Phacoemulsification with Foldable IOL)', department: 'Eye Care' },
  
  // Neurology
  'stroke': { condition: 'Acute Brain Stroke', treatment: 'Acute Ischemic Stroke Thrombolysis / Mechanical Thrombectomy', department: 'Neurosurgery' },
  'lakwa': { condition: 'Brain Stroke / Paralysis', treatment: 'Acute Ischemic Stroke Thrombolysis / Mechanical Thrombectomy', department: 'Neurosurgery' },
  'neuro': { condition: 'Neurological / Spine Disorder', treatment: 'Emergency Trauma & Inpatient Medical Care', department: 'Neurosurgery' },
  
  // General
  'emergency': { condition: 'Emergency Medical Trauma', treatment: 'Emergency Trauma & Inpatient Medical Care', department: 'Emergency' },
  'operation': { condition: 'General Surgical Need', treatment: 'General Surgery & Inpatient Care', department: 'General Surgery' },
  'surgery': { condition: 'General Surgical Need', treatment: 'General Surgery & Inpatient Care', department: 'General Surgery' },
  'treatment': { condition: 'General Healthcare Consultation', treatment: 'General Inpatient & ICU Consultation', department: 'General Medicine' },
};

// Relation extractors
const PATIENT_RELATIONS: Record<string, 'Self' | 'Father' | 'Mother' | 'Spouse' | 'Child' | 'Relative'> = {
  'father': 'Father',
  'pitaji': 'Father',
  'bauji': 'Father',
  'papa': 'Father',
  'mother': 'Mother',
  'mataji': 'Mother',
  'mom': 'Mother',
  'mummy': 'Mother',
  'wife': 'Spouse',
  'husband': 'Spouse',
  'patni': 'Spouse',
  'pati': 'Spouse',
  'son': 'Child',
  'daughter': 'Child',
  'beta': 'Child',
  'beti': 'Child',
  'bache': 'Child',
  'brother': 'Relative',
  'sister': 'Relative',
  'bhai': 'Relative',
  'behen': 'Relative',
  'myself': 'Self',
  'my': 'Self',
  'me': 'Self',
  'mujhe': 'Self',
  'mera': 'Self',
  'main': 'Self',
};

// Pan-India City & District Keywords
const CITY_KEYWORDS: Record<string, { city: string; state: string; district: string }> = {
  // Maharashtra
  'mumbai': { city: 'Mumbai', state: 'Maharashtra', district: 'Mumbai' },
  'nagpur': { city: 'Nagpur', state: 'Maharashtra', district: 'Nagpur' },
  'pune': { city: 'Pune', state: 'Maharashtra', district: 'Pune' },
  'nashik': { city: 'Nashik', state: 'Maharashtra', district: 'Nashik' },
  'thane': { city: 'Thane', state: 'Maharashtra', district: 'Thane' },
  'aurangabad': { city: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', district: 'Aurangabad' },

  // Delhi NCR
  'delhi': { city: 'Saket / Ansari Nagar', state: 'Delhi NCR', district: 'South Delhi' },
  'new delhi': { city: 'Ansari Nagar (AIIMS Delhi)', state: 'Delhi NCR', district: 'Central Delhi' },
  'noida': { city: 'Sector 62 (Noida)', state: 'Uttar Pradesh', district: 'Gautam Buddha Nagar' },
  'gurgaon': { city: 'Gurugram', state: 'Haryana', district: 'Gurugram' },
  'gurugram': { city: 'Gurugram', state: 'Haryana', district: 'Gurugram' },
  'faridabad': { city: 'Sector 88 (Faridabad)', state: 'Haryana', district: 'Faridabad' },

  // Karnataka
  'bengaluru': { city: 'Bengaluru', state: 'Karnataka', district: 'Bengaluru Urban' },
  'bangalore': { city: 'Bengaluru', state: 'Karnataka', district: 'Bengaluru Urban' },
  'mysore': { city: 'Mysuru', state: 'Karnataka', district: 'Mysuru' },
  'mangalore': { city: 'Mangaluru', state: 'Karnataka', district: 'Dakshina Kannada' },

  // Tamil Nadu
  'chennai': { city: 'Chennai', state: 'Tamil Nadu', district: 'Chennai' },
  'coimbatore': { city: 'Coimbatore', state: 'Tamil Nadu', district: 'Coimbatore' },
  'madurai': { city: 'Madurai', state: 'Tamil Nadu', district: 'Madurai' },

  // Gujarat
  'ahmedabad': { city: 'Ahmedabad', state: 'Gujarat', district: 'Ahmedabad' },
  'surat': { city: 'Surat', state: 'Gujarat', district: 'Surat' },
  'vadodara': { city: 'Vadodara', state: 'Gujarat', district: 'Vadodara' },
  'rajkot': { city: 'Rajkot', state: 'Gujarat', district: 'Rajkot' },

  // Rajasthan
  'jaipur': { city: 'Jaipur', state: 'Rajasthan', district: 'Jaipur' },
  'jodhpur': { city: 'Jodhpur', state: 'Rajasthan', district: 'Jodhpur' },
  'udaipur': { city: 'Udaipur', state: 'Rajasthan', district: 'Udaipur' },

  // Uttar Pradesh
  'lucknow': { city: 'Lucknow', state: 'Uttar Pradesh', district: 'Lucknow' },
  'kanpur': { city: 'Kanpur', state: 'Uttar Pradesh', district: 'Kanpur Nagar' },
  'varanasi': { city: 'Varanasi', state: 'Uttar Pradesh', district: 'Varanasi' },

  // Telangana
  'hyderabad': { city: 'Hyderabad', state: 'Telangana', district: 'Hyderabad' },
  'secunderabad': { city: 'Secunderabad', state: 'Telangana', district: 'Hyderabad' },

  // West Bengal
  'kolkata': { city: 'Kolkata', state: 'West Bengal', district: 'Kolkata' },
  'siliguri': { city: 'Siliguri', state: 'West Bengal', district: 'Darjeeling' },

  // Kerala
  'kochi': { city: 'Kochi', state: 'Kerala', district: 'Ernakulam' },
  'cochin': { city: 'Kochi', state: 'Kerala', district: 'Ernakulam' },
  'trivandrum': { city: 'Thiruvananthapuram', state: 'Kerala', district: 'Thiruvananthapuram' },

  // Punjab
  'jalandhar': { city: 'Jalandhar', state: 'Punjab', district: 'Jalandhar' },
  'ludhiana': { city: 'Ludhiana', state: 'Punjab', district: 'Ludhiana' },
  'amritsar': { city: 'Amritsar', state: 'Punjab', district: 'Amritsar' },
  'mohali': { city: 'Mohali', state: 'Punjab', district: 'SAS Nagar (Mohali) / Chandigarh' },
  'chandigarh': { city: 'Chandigarh', state: 'Punjab', district: 'SAS Nagar (Mohali) / Chandigarh' },
  'patiala': { city: 'Patiala', state: 'Punjab', district: 'Patiala' },
  'bathinda': { city: 'Bathinda', state: 'Punjab', district: 'Bathinda' },
  'hoshiarpur': { city: 'Hoshiarpur', state: 'Punjab', district: 'Hoshiarpur' },
  'kapurthala': { city: 'Kapurthala', state: 'Punjab', district: 'Kapurthala' },
  'pathankot': { city: 'Pathankot', state: 'Punjab', district: 'Pathankot' },
};

export function extractHealthcareRequirement(rawText: string): ExtractorResult {
  const lower = rawText.toLowerCase();

  // 1. Emergency Detection
  for (const pattern of EMERGENCY_PATTERNS) {
    if (pattern.test(rawText)) {
      return {
        isEmergency: true,
        emergencyReason: 'Potential life-threatening medical emergency detected from query symptoms.',
        requirement: { urgency: 'CRITICAL_EMERGENCY' },
        missingFields: [],
        clarifications: [],
        rawText,
      };
    }
  }

  // 2. Patient Relation Extraction
  let patient: 'Self' | 'Father' | 'Mother' | 'Spouse' | 'Child' | 'Relative' | 'Unknown' = 'Self';
  for (const [key, val] of Object.entries(PATIENT_RELATIONS)) {
    const wordBoundary = new RegExp(`\\b${key}\\b`, 'i');
    if (wordBoundary.test(lower)) {
      patient = val;
      break;
    }
  }

  // 3. Clinical Concept Extraction & Treatment Normalization
  let condition = 'Healthcare Requirement';
  let treatment: string | undefined = undefined;

  for (const [phrase, mapping] of Object.entries(CLINICAL_MAPPINGS)) {
    if (lower.includes(phrase)) {
      condition = mapping.condition;
      treatment = mapping.treatment;
      break;
    }
  }

  // If no clinical keyword matched, extract raw condition words
  if (condition === 'Healthcare Requirement') {
    const words = rawText.replace(/under|near|in|within|budget|lakh|rupees|rs|father|mother|self|find|hospital|hospitals/gi, '').trim();
    if (words.length > 2) {
      condition = words.split(' ').slice(0, 4).join(' ');
      treatment = `${condition} Treatment / Specialist Consultation`;
    }
  }

  // 4. Location Extraction (Only set if explicitly present in query text)
  let city: string | undefined = undefined;
  let state: string | undefined = undefined;
  let district: string | undefined = undefined;

  for (const [keyword, loc] of Object.entries(CITY_KEYWORDS)) {
    if (lower.includes(keyword)) {
      city = loc.city;
      state = loc.state;
      district = loc.district;
      break;
    }
  }

  // 5. Budget Extraction
  let budget: number | null = null;
  const lakhMatch = lower.match(/(?:under|within|below|budget|around|max)?\s*(?:₹|rs\.?|inr)?\s*([0-9.]+)\s*(?:lakh|lac|lakhs|lacs|l)/i);
  if (lakhMatch) {
    budget = Math.round(parseFloat(lakhMatch[1]) * 100000);
  } else {
    const thousandMatch = lower.match(/(?:under|within|below|budget|around|max)?\s*(?:₹|rs\.?|inr)?\s*([0-9,]+)\s*(?:k|thousand)?/i);
    if (thousandMatch) {
      const cleaned = thousandMatch[1].replace(/,/g, '');
      const val = parseInt(cleaned);
      if (val >= 500 && val <= 5000000) {
        budget = val;
      }
    }
  }

  // 6. Radius Extraction
  let radiusKm: number | undefined = undefined;
  const radiusMatch = lower.match(/([0-9]+)\s*(?:km|kms|kilometer|kilometres)/i);
  if (radiusMatch) {
    radiusKm = Math.min(200, Math.max(5, parseInt(radiusMatch[1])));
  }

  // 7. Priorities Extraction
  const priorities: ('TREATMENT' | 'COST' | 'DISTANCE' | 'FACILITIES' | 'COVERAGE' | 'VERIFICATION')[] = ['TREATMENT'];
  if (budget) priorities.push('COST');
  if (lower.includes('near') || lower.includes('closest') || lower.includes('radius')) priorities.push('DISTANCE');
  if (lower.includes('ayushman') || lower.includes('cghs') || lower.includes('insurance')) priorities.push('COVERAGE');
  if (lower.includes('verified') || lower.includes('nabh') || lower.includes('trust')) priorities.push('VERIFICATION');

  const requirement: Partial<HealthcareRequirement> = {
    patient,
    condition,
    treatment,
    ...(state ? { state } : {}),
    ...(district ? { district } : {}),
    ...(city ? { city } : {}),
    ...(radiusKm ? { radiusKm } : {}),
    budget,
    priorities,
    requiredFacilities: [],
    coveragePreference: lower.includes('ayushman') ? 'AYUSHMAN_BHARAT' : lower.includes('cghs') ? 'CGHS' : 'ANY',
    urgency: 'ROUTINE',
    language: 'en',
  };

  const missingFields: (keyof HealthcareRequirement)[] = [];
  const clarifications: ClarificationQuestion[] = [];

  return {
    isEmergency: false,
    requirement,
    missingFields,
    clarifications,
    rawText,
  };
}
