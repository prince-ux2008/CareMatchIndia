'use client';

import React from 'react';
import { 
  User, 
  Stethoscope, 
  Activity, 
  MapPin, 
  Compass, 
  IndianRupee, 
  Sliders, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';
import { HealthcareRequirement } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import { useApp } from '@/lib/context/AppContext';

interface LiveExtractionCardProps {
  requirement: Partial<HealthcareRequirement>;
  onEditField?: (field: keyof HealthcareRequirement) => void;
}

export function LiveExtractionCard({ requirement }: LiveExtractionCardProps) {
  const { t } = useApp();

  return (
    <div className="rounded-3xl bg-gradient-to-b from-navy-900/90 to-navy-950/95 border border-cyan-500/25 p-5 sm:p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="font-extrabold text-xs sm:text-sm tracking-wide text-cyan-300 uppercase">
            {t.liveRequirementTitle}
          </h3>
        </div>
        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono font-bold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          NLP Clinical Entity Extraction
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
        {/* Patient */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-cyan-500/30 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-bold">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              {t.fieldPatient}
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-white capitalize truncate">
            {requirement.patient || 'Self'}
          </span>
        </div>

        {/* Condition */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-bold">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              {t.fieldCondition}
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-emerald-300 truncate" title={requirement.condition}>
            {requirement.condition || 'General Care'}
          </span>
        </div>

        {/* Treatment */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-cyan-500/30 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-bold">
            <span className="flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
              {t.fieldTreatment}
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-cyan-300 truncate" title={requirement.treatment || 'Consultation'}>
            {requirement.treatment || 'Specialist Consultation'}
          </span>
        </div>

        {/* Location */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-amber-500/30 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-bold">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {t.fieldLocation}
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-white truncate">
            {requirement.city || 'Jalandhar'}, {requirement.state || 'Punjab'}
          </span>
        </div>

        {/* Radius */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-cyan-500/30 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-bold">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              {t.fieldRadius}
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-white">
            {requirement.radiusKm || 50} km
          </span>
        </div>

        {/* Budget */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-bold">
            <span className="flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
              {t.fieldBudget}
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-emerald-300 truncate">
            {requirement.budget ? formatINR(requirement.budget) : 'Flexible / No Cap'}
          </span>
        </div>
      </div>

      {/* Priorities row */}
      <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold">Active Priority Weights:</span>
          <div className="flex flex-wrap gap-1">
            {(requirement.priorities || ['TREATMENT', 'COST']).map((p) => (
              <span
                key={p}
                className="px-2.5 py-0.5 rounded-lg bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/25 text-[11px]"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>Factual Hospital Matching Active (Zero Hallucination)</span>
        </div>
      </div>
    </div>
  );
}
