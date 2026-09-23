'use client';

import React from 'react';
import { 
  User, 
  BrainCircuit, 
  Search, 
  Scale, 
  ShieldCheck, 
  ArrowRight, 
  SlidersHorizontal,
  MapPin,
  Activity,
  Layers,
  HeartPulse
} from 'lucide-react';

export function PipelineVisualizer() {
  const steps = [
    {
      step: '01',
      title: 'Intent & Query Parsing',
      desc: 'Natural language input structured with Zod guardrails',
      icon: User,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/10',
    },
    {
      step: '02',
      title: 'Disease / Specialty Extraction',
      desc: 'Clinical condition to medical specialty mapping',
      icon: BrainCircuit,
      color: 'text-blue-400',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/10',
    },
    {
      step: '03',
      title: 'Geospatial Radar & Radius',
      desc: 'Haversine distance & travel time estimation',
      icon: MapPin,
      color: 'text-indigo-400',
      border: 'border-indigo-500/30',
      bg: 'bg-indigo-500/10',
    },
    {
      step: '04',
      title: 'Hybrid Semantic Search',
      desc: 'PostgreSQL full-text & vector similarity index',
      icon: Search,
      color: 'text-violet-400',
      border: 'border-violet-500/30',
      bg: 'bg-violet-500/10',
    },
    {
      step: '05',
      title: 'Condition Suitability Engine',
      desc: 'Department, specialist, ICU & facility scoring',
      icon: HeartPulse,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
    },
    {
      step: '06',
      title: 'Explainable Transparent Audit',
      desc: 'Factual Why-Match & What-Doesn’t-Match rationale',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="w-full py-6">
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Transparent 6-Stage AI Architecture</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white">
          How NEURALCARE Analyzes & Matches
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Strict layer separation between language comprehension, verified hospital facts, and explainable compatibility calculations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 relative">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className={`rounded-3xl p-4 sm:p-5 glass-panel border ${s.border} relative group hover:-translate-y-1 transition-all duration-300 shadow-lg`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  STAGE {s.step}
                </span>
                <div className={`p-2 rounded-xl ${s.bg} ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <h4 className="font-extrabold text-sm text-white group-hover:text-cyan-300 transition-colors">
                {s.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
