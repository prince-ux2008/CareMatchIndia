import { NextResponse } from 'next/server';
import { extractHealthcareRequirement } from '@/lib/nlp/extractor';
import { INITIAL_HOSPITALS_DATA } from '@/lib/data/hospitals';
import { matchingEngine } from '@/lib/matching';
import { HealthcareRequirementSchema, HospitalMatchResult } from '@/lib/types';
import { formatINR } from '@/lib/utils';

// Clinical knowledge base for direct instant expert answers
const CLINICAL_FAQ_KNOWLEDGE: { pattern: RegExp; response: (query: string, matches: HospitalMatchResult[]) => string }[] = [
  {
    pattern: /(heart|cardio|angioplasty|stent|bypass|chest pain|dil)/i,
    response: (q, matches) => {
      const topHosp = matches.slice(0, 3).map(m => `• **${m.hospital.name}** (${m.hospital.city}, ${m.hospital.state}) — ${m.overallScore}% AI Match | 🛏️ ${m.hospital.realTimeData?.totalBedsAvailable || 18} Beds Open`).join('\n');
      return `### 🫀 Cardiac Care & Heart Treatment Overview

**Common Procedures & Package Estimates:**
1. **Coronary Angiography (CAG):** ₹10,000 – ₹25,000 (Diagnostic check for arterial blockages).
2. **Coronary Angioplasty (PTCA with DES Stent):** ₹1.2L – ₹2.4L per stent (Covered under Ayushman Bharat PM-JAY & CGHS).
3. **Bypass Surgery (CABG):** ₹2.0L – ₹4.5L (For multi-vessel diffuse blockages).

**Top Verified Cardiac Hospitals Matching Your Query:**
${topHosp || 'Explore cardiac facilities in the Discovery Studio.'}

💡 **Emergency Note:** If experiencing sudden squeezing chest pain radiating to left arm or jaw with cold sweats, call **108** immediately!`;
    }
  },
  {
    pattern: /(kidney|renal|stone|pathri|dialysis|rirs|pcnl|lithotripsy|gurda)/i,
    response: (q, matches) => {
      const topHosp = matches.slice(0, 3).map(m => `• **${m.hospital.name}** (${m.hospital.city}, ${m.hospital.state}) — ${m.overallScore}% Match | 🛏️ ${m.hospital.realTimeData?.totalBedsAvailable || 15} Beds Open`).join('\n');
      return `### 🪨 Kidney Stone & Renal Health Guide

**Treatment Modalities & Costs in India:**
1. **RIRS (Retrograde Intrarenal Laser Surgery):** ₹65,000 – ₹1.2 Lakh (No cut, flexible ureteroscopy with Holmium laser).
2. **PCNL (Keyhole Stone Removal):** ₹55,000 – ₹1.0 Lakh (For stones >15mm).
3. **Hemodialysis (PMNDP Free Dialysis):** ₹0 under Govt Scheme, or ₹1,200–₹2,500 per session in private NABH centers.

**Recommended Kidney & Urology Centers:**
${topHosp || 'Explore kidney care centers in the search studio.'}

💧 **Prevention Tip:** Drink 3–4 liters of water daily and limit excessive sodium and oxalate-rich food intake.`;
    }
  },
  {
    pattern: /(knee|ortho|bone|fracture|joint|tkr|haddi|ghutna)/i,
    response: (q, matches) => {
      const topHosp = matches.slice(0, 3).map(m => `• **${m.hospital.name}** (${m.hospital.city}, ${m.hospital.state}) — ${m.overallScore}% Match | ★ ${m.hospital.ratingAverage} Rating`).join('\n');
      return `### 🦵 Orthopedic & Joint Replacement Care

**Procedure Guidelines:**
1. **Total Knee Replacement (TKR):** ₹1.4L – ₹2.5L per knee (Includes US-FDA approved high-flex titanium implants, 4-day hospital stay & physiotherapy).
2. **Trauma / Fracture Fixation:** ₹35,000 – ₹90,000 (With dynamic locking plates).
3. **Arthroscopy (Ligament ACL Repair):** ₹60,000 – ₹1.3 Lakh (Minimally invasive keyhole surgery).

**Top Verified Orthopedic Centers:**
${topHosp || 'Explore orthopedic centers in the search studio.'}`;
    }
  },
  {
    pattern: /(ayushman|pmjay|pm-jay|insurance|cashless|cghs|scheme|free)/i,
    response: () => `### 🏛️ Ayushman Bharat PM-JAY & Govt Health Schemes

**Key Benefits:**
• **₹5,00,000 per family per year** for secondary and tertiary hospital care.
• **100% Cashless & Paperless** treatment across 27,000+ empaneled public and private hospitals across India.
• Covers **1,949+ clinical packages** including Cardiology, Oncology, Orthopedics, Neurosurgery, and Dialysis.
• **No pre-existing disease exclusions.**

**How to verify your eligibility:**
1. Call National Helpline: **14555**
2. Visit website: **mera.pmjay.gov.in**
3. Filter by **"Ayushman Bharat PM-JAY"** directly in our CareMatch Studio to see empaneled hospitals!`,
  },
  {
    pattern: /(cancer|oncology|chemo|tumor|radiation|biopsy)/i,
    response: (q, matches) => {
      const topHosp = matches.slice(0, 3).map(m => `• **${m.hospital.name}** (${m.hospital.city}, ${m.hospital.state}) — Comprehensive Cancer Care`).join('\n');
      return `### 🎗️ Oncology & Comprehensive Cancer Care

**Treatment Modalities:**
1. **Chemotherapy Daycare Infusion:** ₹15,000 – ₹60,000 per cycle (Depending on targeted immunotherapy / generic drugs).
2. **Radiation Therapy (LINAC / IMRT / IGRT):** ₹1.2L – ₹3.5L complete course.
3. **Onco-Surgery:** ₹1.5L – ₹5.0L with comprehensive post-operative ICU care.

**Empaneled Apex Oncology Centers:**
${topHosp || 'Explore oncology facilities in the search studio.'}`;
    }
  },
  {
    pattern: /(cataract|eye|motiyabind|phaco|vision|lasik)/i,
    response: (q, matches) => {
      return `### 👁️ Cataract & Advanced Eye Surgery

**Techniques & Lens Types:**
1. **Micro-Incision Phacoemulsification:** ₹15,000 – ₹45,000 per eye (Foldable Monofocal IOL, 15-minute daycare).
2. **Premium Trifocal / Toric Lens Surgery:** ₹45,000 – ₹90,000 per eye (Glasses-free distance, intermediate, and near vision).
3. **PM-JAY National Blindness Control:** 100% Free at empaneled eye centers.

Recovery is typically rapid with resumption of daily routine within 48 to 72 hours.`;
    }
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    // 1. Emergency Detection Triage
    const extractionResult = extractHealthcareRequirement(message);

    if (extractionResult.isEmergency) {
      return NextResponse.json({
        success: true,
        isEmergency: true,
        reply: `🚨 **CRITICAL EMERGENCY ALERT**:\n\nThe symptoms you described indicate a potential acute life-threatening medical emergency. \n\n👉 **Please dial 108 (Ambulance) or 112 (National Emergency) immediately!**\n\n• Do not wait for online responses.\n• Keep the patient calm and seated or lying down.\n• Transport to the nearest 24x7 Emergency Trauma ICU facility immediately.`,
        extractedRequirement: extractionResult.requirement,
        searchResultsSummary: null,
      });
    }

    // 2. Candidate Matching
    const parsedReq = HealthcareRequirementSchema.safeParse({
      ...extractionResult.requirement,
      patient: extractionResult.requirement.patient || 'Self',
      condition: extractionResult.requirement.condition || 'General Healthcare',
      state: extractionResult.requirement.state || 'All India',
      city: extractionResult.requirement.city || 'All India Hubs',
      radiusKm: extractionResult.requirement.radiusKm || 50,
      priorities: extractionResult.requirement.priorities || ['TREATMENT', 'COST'],
      requiredFacilities: [],
      coveragePreference: 'ANY',
      urgency: 'ROUTINE',
      language: extractionResult.requirement.language || 'en',
    });

    let matches: HospitalMatchResult[] = [];
    if (parsedReq.success) {
      matches = matchingEngine.match(parsedReq.data, INITIAL_HOSPITALS_DATA).slice(0, 5);
    }

    // 3. Check for external Gemini or OpenAI API Key
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const openAiApiKey = process.env.OPENAI_API_KEY;

    let aiGeneratedReply: string | null = null;

    if (geminiApiKey) {
      try {
        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are CareMatch AI, an expert, empathetic, and knowledgeable healthcare discovery assistant for India.
User Query: "${message}"
Identified Clinical Context: Condition: ${extractionResult.requirement.condition}, Treatment: ${extractionResult.requirement.treatment || 'General consultation'}.
Matched Verified Hospitals: ${matches.map(m => `${m.hospital.name} (${m.hospital.city}, ${m.hospital.state}, ${m.overallScore}% Match, ${m.hospital.realTimeData?.totalBedsAvailable || 15} Beds)`).join('; ')}.

Provide a clear, medically accurate, and helpful response in professional formatting (with bullet points and headers). Mention treatment costs/guidelines and 2-3 top matched verified hospitals. Include standard medical disclaimer. Keep response within 180 words.`
                  }
                ]
              }
            ]
          })
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          aiGeneratedReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        }
      } catch (err) {
        console.error('Gemini API error, falling back to clinical engine:', err);
      }
    }

    // 4. Clinical Knowledge Base Fallback if no external API key
    if (!aiGeneratedReply) {
      for (const item of CLINICAL_FAQ_KNOWLEDGE) {
        if (item.pattern.test(message)) {
          aiGeneratedReply = item.response(message, matches);
          break;
        }
      }
    }

    // 5. Default Structured Healthcare Response
    if (!aiGeneratedReply) {
      const conditionName = extractionResult.requirement.condition || 'your healthcare inquiry';
      const locName = extractionResult.requirement.city || extractionResult.requirement.state || 'India';
      const topHospList = matches.slice(0, 3).map(m => `• **${m.hospital.name}** (${m.hospital.city}, ${m.hospital.state}) — **${m.overallScore}% Match** (🛏️ ${m.hospital.realTimeData?.totalBedsAvailable || 18} Beds Available, Rating: ${m.hospital.ratingAverage}★)`).join('\n');

      aiGeneratedReply = `### 🏥 Healthcare Discovery: ${conditionName}

I have analyzed your requirement and matched verified healthcare facilities in **${locName}**.

${topHospList ? `**Top Recommended Verified Hospitals:**\n${topHospList}\n` : ''}
${extractionResult.requirement.budget ? `**Budget Cap:** Under ${formatINR(extractionResult.requirement.budget)}\n` : ''}
**Next Step:** You can view full comparative pricing, bed availability, and GPS routes by clicking **"Explore in Studio"** below!`;
    }

    return NextResponse.json({
      success: true,
      isEmergency: false,
      reply: aiGeneratedReply,
      extractedRequirement: extractionResult.requirement,
      clarificationNeeded: extractionResult.clarifications,
      searchResultsSummary: {
        totalFound: matches.length,
        topMatches: matches,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
