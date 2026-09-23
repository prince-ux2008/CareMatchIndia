import { VisualCaseAnalysis, HospitalRecord } from '../types';

export function analyzeVisualCase(
  description: string,
  imageFile?: { name: string; size?: number; type?: string } | null,
  targetHospital?: HospitalRecord
): VisualCaseAnalysis {
  const desc = (description || '').toLowerCase();
  const imgName = (imageFile?.name || '').toLowerCase();

  // Safety disclaimer
  const defaultDisclaimer = 
    "This is an intelligent healthcare decision-support interpretation to identify relevant hospital specialties and care categories. It is NOT a medical diagnosis and does not replace clinical consultation with a qualified doctor.";

  // Detect image quality or lack of information
  if (!desc.trim() && (!imageFile || imageFile.size === 0)) {
    return {
      id: `case_${Date.now()}`,
      caseCategory: "Insufficient Case Information",
      primaryConcern: "No description or visual evidence provided.",
      specialtySuggested: "General Medicine / OPD Screening",
      confidenceTier: "INSUFFICIENT_IMAGE_QUALITY",
      disclaimer: defaultDisclaimer,
      urgencyAdvice: "ROUTINE_OPD",
      suggestedQuestions: [
        "Please describe the primary symptom (e.g. skin rash, joint swelling, eye redness).",
        "How long have you noticed this condition?",
      ],
      extractedTags: ["Information Needed"],
    };
  }

  // 1. Dermatology / Skin Analysis
  if (
    desc.includes('skin') || desc.includes('rash') || desc.includes('itch') || 
    desc.includes('allergy') || desc.includes('eczema') || desc.includes('psoriasis') ||
    desc.includes('boil') || desc.includes('acne') || desc.includes('lesion') ||
    imgName.includes('skin') || imgName.includes('rash')
  ) {
    const analysis: VisualCaseAnalysis = {
      id: `case_${Date.now()}`,
      caseCategory: "Dermatology & Cutaneous Care Category",
      primaryConcern: description || "Visible skin rash / cutaneous manifestation",
      specialtySuggested: "Dermatology",
      confidenceTier: "RELEVANT_MATCH",
      disclaimer: defaultDisclaimer,
      urgencyAdvice: desc.includes('severe') || desc.includes('spreading rapidly') ? "TIMELY_EVALUATION" : "ROUTINE_OPD",
      suggestedQuestions: [
        "Has the rash spread across multiple body areas in the last 48 hours?",
        "Are you experiencing any associated fever, itching, or pain?",
        "Have you started any new medications or topical creams recently?",
      ],
      extractedTags: ["Dermatology", "Skin Care", "OPD Consultation", "Allergy Evaluation"],
    };

    if (targetHospital) {
      const hasDept = targetHospital.departments.some(d => d.toLowerCase().includes('dermatology') || d.toLowerCase().includes('skin'));
      analysis.hospitalCompatibility = {
        hospitalId: targetHospital.id,
        hasRelevantDepartment: hasDept,
        departmentName: hasDept ? "Dermatology & Skin OPD" : "General Medicine / Internal OPD",
        relevantServices: hasDept ? ["Clinical Dermatology Consultation", "Skin Patch & Allergy Testing"] : ["General OPD Screening"],
        verificationStatus: hasDept ? "VERIFIED" : "NOT_AVAILABLE",
        summary: hasDept 
          ? `${targetHospital.name} lists verified Dermatology capabilities relevant to your described skin concern.`
          : `Dermatology is not verified as a dedicated department at ${targetHospital.name}. General OPD may evaluate and refer.`,
      };
    }

    return analysis;
  }

  // 2. Orthopedic / Joint / Bone Analysis
  if (
    desc.includes('knee') || desc.includes('joint') || desc.includes('bone') ||
    desc.includes('fracture') || desc.includes('ortho') || desc.includes('spine') ||
    desc.includes('back pain') || desc.includes('swelling') || desc.includes('xray') ||
    imgName.includes('xray') || imgName.includes('knee') || imgName.includes('mri')
  ) {
    const analysis: VisualCaseAnalysis = {
      id: `case_${Date.now()}`,
      caseCategory: "Orthopedics & Musculoskeletal Care Category",
      primaryConcern: description || "Joint discomfort / bone structural concern",
      specialtySuggested: "Orthopedics & Joint Replacement",
      confidenceTier: "RELEVANT_MATCH",
      disclaimer: defaultDisclaimer,
      urgencyAdvice: desc.includes('fracture') || desc.includes('unable to walk') ? "TIMELY_EVALUATION" : "ROUTINE_OPD",
      suggestedQuestions: [
        "Did this follow a traumatic fall, sports injury, or gradual onset?",
        "Are you able to bear weight on the affected limb?",
        "Do you have existing X-Ray or MRI imaging reports available?",
      ],
      extractedTags: ["Orthopedics", "Joint Health", "X-Ray / Imaging", "Arthritis / TKR Care"],
    };

    if (targetHospital) {
      const hasDept = targetHospital.departments.some(d => d.toLowerCase().includes('orthopedics') || d.toLowerCase().includes('bone'));
      analysis.hospitalCompatibility = {
        hospitalId: targetHospital.id,
        hasRelevantDepartment: hasDept,
        departmentName: "Orthopedics & Joint Surgery",
        relevantServices: hasDept ? ["Joint Arthroscopy", "Robotic / Conventional TKR", "Digital X-Ray / CT"] : ["General Surgery"],
        verificationStatus: hasDept ? "VERIFIED" : "NOT_AVAILABLE",
        summary: hasDept 
          ? `${targetHospital.name} lists verified Orthopedic capabilities matching your musculoskeletal concern.`
          : `Orthopedic specialty is not verified at this hospital. Alternatives are recommended.`,
      };
    }

    return analysis;
  }

  // 3. Ophthalmology / Eye Care
  if (
    desc.includes('eye') || desc.includes('vision') || desc.includes('cataract') ||
    desc.includes('blur') || desc.includes('redness') || desc.includes('cornea') ||
    imgName.includes('eye')
  ) {
    const analysis: VisualCaseAnalysis = {
      id: `case_${Date.now()}`,
      caseCategory: "Ophthalmology & Vision Care Category",
      primaryConcern: description || "Ophthalmic / visual clarity concern",
      specialtySuggested: "Ophthalmology",
      confidenceTier: "RELEVANT_MATCH",
      disclaimer: defaultDisclaimer,
      urgencyAdvice: desc.includes('sudden loss') ? "CRITICAL_EMERGENCY" : "ROUTINE_OPD",
      suggestedQuestions: [
        "Was the change in vision gradual or sudden?",
        "Is there severe pain, halos around lights, or foreign body sensation?",
      ],
      extractedTags: ["Ophthalmology", "Eye Care", "Phaco Cataract", "Refractive Evaluation"],
    };

    if (targetHospital) {
      const hasDept = targetHospital.departments.some(d => d.toLowerCase().includes('eye') || d.toLowerCase().includes('ophthalmology'));
      analysis.hospitalCompatibility = {
        hospitalId: targetHospital.id,
        hasRelevantDepartment: hasDept,
        departmentName: "Ophthalmology Department",
        relevantServices: hasDept ? ["Slit Lamp Examination", "Phacoemulsification Surgery", "Retinal Screening"] : ["General OPD"],
        verificationStatus: hasDept ? "VERIFIED" : "NOT_AVAILABLE",
        summary: hasDept
          ? `${targetHospital.name} verified Ophthalmology capabilities are available.`
          : `Dedicated Eye Care unit is unverified at ${targetHospital.name}.`,
      };
    }

    return analysis;
  }

  // 4. Cardiology / Chest Concern
  if (
    desc.includes('chest') || desc.includes('heart') || desc.includes('breath') ||
    desc.includes('angio') || desc.includes('palpitation') || desc.includes('ecg') ||
    imgName.includes('ecg')
  ) {
    const isEmergency = desc.includes('crushing') || desc.includes('sweating') || desc.includes('left arm');
    const analysis: VisualCaseAnalysis = {
      id: `case_${Date.now()}`,
      caseCategory: "Cardiology & Vascular Care Category",
      primaryConcern: description || "Cardio-respiratory symptom evaluation",
      specialtySuggested: "Cardiology & Interventional Cardiac Care",
      confidenceTier: "RELEVANT_MATCH",
      disclaimer: isEmergency 
        ? "🚨 CRITICAL SYMPTOM ALERT: If you or the patient are experiencing severe chest pain, shortness of breath, or sweating, call 108/112 or visit the nearest emergency room immediately."
        : defaultDisclaimer,
      urgencyAdvice: isEmergency ? "CRITICAL_EMERGENCY" : "TIMELY_EVALUATION",
      suggestedQuestions: [
        "Does the chest discomfort radiate to the jaw, back, or left arm?",
        "Do you have a history of diabetes, hypertension, or previous cardiac stent?",
      ],
      extractedTags: ["Cardiology", "ECG / Echo", "Cath Lab", "Cardiac Emergency"],
    };

    if (targetHospital) {
      const hasDept = targetHospital.departments.some(d => d.toLowerCase().includes('cardiology') || d.toLowerCase().includes('heart'));
      analysis.hospitalCompatibility = {
        hospitalId: targetHospital.id,
        hasRelevantDepartment: hasDept,
        departmentName: "Cardiology & 24x7 Cath Lab",
        relevantServices: hasDept ? ["24x7 Primary Angioplasty", "Echo / TMT Diagnostics", "Cardiac ICU"] : ["Emergency Triage"],
        verificationStatus: hasDept ? "VERIFIED" : "NOT_AVAILABLE",
        summary: hasDept 
          ? `${targetHospital.name} features verified 24x7 Cath Lab & Interventional Cardiology capabilities.`
          : `Cardiac catheterization is unverified at ${targetHospital.name}. Alternative cardiac hubs should be prioritized.`,
      };
    }

    return analysis;
  }

  // 5. General Fallback
  return {
    id: `case_${Date.now()}`,
    caseCategory: "General Clinical Care Category",
    primaryConcern: description || "General clinical symptom evaluation",
    specialtySuggested: "Internal Medicine / Multi-Specialty OPD",
    confidenceTier: "GENERAL_SCREENING",
    disclaimer: defaultDisclaimer,
    urgencyAdvice: "ROUTINE_OPD",
    suggestedQuestions: [
      "What is the primary symptom you are seeking medical advice for?",
      "Which city or district would you like to explore hospital capabilities in?",
    ],
    extractedTags: ["Internal Medicine", "General OPD", "Clinical Evaluation"],
  };
}
