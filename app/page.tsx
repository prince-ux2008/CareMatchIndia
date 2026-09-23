'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Scale, 
  Sliders, 
  MapPin, 
  ArrowRight, 
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Layers,
  Activity,
  Heart,
  BrainCircuit,
  Compass,
  Stethoscope,
  Camera
} from 'lucide-react';
import { HeroSection } from '@/components/landing/HeroSection';
import { IndiaMapVisual } from '@/components/landing/IndiaMapVisual';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { TrustProvenanceSection } from '@/components/landing/TrustProvenanceSection';
import { CareGapShowcase } from '@/components/landing/CareGapShowcase';
import { SafetyDisclaimerSection } from '@/components/landing/SafetyDisclaimerSection';
import { PipelineVisualizer } from '@/components/landing/PipelineVisualizer';
import { HospitalCard } from '@/components/search/HospitalCard';
import { INITIAL_HOSPITALS_DATA } from '@/lib/data/hospitals';
import { matchingEngine } from '@/lib/matching';
import { HealthcareRequirement } from '@/lib/types';
import { WhatIfModal } from '@/components/whatif/WhatIfModal';
import { useApp } from '@/lib/context/AppContext';

export default function LandingPage() {
  const { t, selectedCity, selectedState } = useApp();
  const [selectedWhatIfMatch, setSelectedWhatIfMatch] = useState<any | null>(null);

  // Default sample requirement for landing preview
  const demoRequirement: HealthcareRequirement = {
    patient: 'Father',
    condition: 'Cardiology / Heart Condition',
    treatment: 'Coronary Angioplasty (PTCA with Stent)',
    state: 'Punjab',
    district: 'Jalandhar',
    city: 'Jalandhar',
    radiusKm: 30,
    budget: 200000,
    priorities: ['TREATMENT', 'COST'],
    requiredFacilities: ['Cath Lab', 'ICU'],
    coveragePreference: 'ANY',
    urgency: 'ROUTINE',
    language: 'en',
  };

  const previewMatches = matchingEngine.match(demoRequirement, INITIAL_HOSPITALS_DATA).slice(0, 3);

  return (
    <div className="space-y-16 pb-12">
      
      {/* 1. Hero Section */}
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* 2. India-Wide Map & State Clusters Visual */}
        <IndiaMapVisual />

        {/* 3. How CareMatch Works (UNDERSTAND -> MATCH -> VERIFY -> COMPARE -> NAVIGATE) */}
        <HowItWorksSection />

        {/* 4. Live Multi-Factor AI Pipeline Visualizer */}
        <PipelineVisualizer />

        {/* 5. Live Match Results Preview (Interactive Demo Showcase) */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Live Match Demo: Angioplasty & Cardiac Care (₹2L Budget)
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Factual records evaluated across Hospital Rating, AI Requirement Match, and Condition Fit.
              </p>
            </div>

            <Link
              href="/search?q=Father+needs+angioplasty+in+Jalandhar+under+2+lakh+budget"
              className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <span>Explore in AI Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {previewMatches.map((m) => (
              <HospitalCard
                key={m.hospital.id}
                matchResult={m}
                onOpenWhatIf={(match) => setSelectedWhatIfMatch(match)}
              />
            ))}
          </div>
        </div>

        {/* 6. Care Gap Engine & Smart Alternatives */}
        <CareGapShowcase />

        {/* 7. Data Provenance & Trust Hierarchy */}
        <TrustProvenanceSection />

        {/* 8. Responsible AI & Safety Disclaimers */}
        <SafetyDisclaimerSection />

        {/* 9. Final Call to Action Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-navy-900 via-slate-900 to-navy-950 border border-cyan-500/30 p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <h3 className="text-2xl sm:text-4xl font-black text-white relative z-10">
            Care that matches your need across India.
          </h3>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto relative z-10">
            Describe your condition, procedure, preferred location, and budget for explainable AI hospital matching.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 relative z-10">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 text-slate-950 font-black text-sm sm:text-base hover:opacity-95 shadow-xl shadow-cyan-500/25 active:scale-95 transition-all"
            >
              <span>Launch AI Search Studio</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/search?view=map"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 border border-cyan-500/40 font-bold text-sm sm:text-base active:scale-95 transition-all"
            >
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Explore Pan-India Map 🗺️</span>
            </Link>
          </div>
        </div>

      </div>

      {/* What-If Modal if open */}
      {selectedWhatIfMatch && (
        <WhatIfModal
          initialMatch={selectedWhatIfMatch}
          initialRequirement={demoRequirement}
          onClose={() => setSelectedWhatIfMatch(null)}
        />
      )}

    </div>
  );
}

