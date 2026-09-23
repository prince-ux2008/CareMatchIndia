'use client';

import React from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  ShieldCheck, 
  Scale, 
  Navigation,
  ArrowRight,
  Activity,
  CheckCircle2
} from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'UNDERSTAND',
      subtitle: 'Natural Language & Visual Care Assist',
      icon: BrainCircuit,
      color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
      description: 'Describe your medical concern in plain English, Hindi, or Punjabi, or upload a photo via "Check My Case". Our AI extracts structured clinical requirements without medical hallucination.',
    },
    {
      step: '02',
      title: 'MATCH',
      subtitle: 'Multi-Factor Capability Engine',
      icon: Sparkles,
      color: 'from-blue-500/20 to-violet-500/20 text-blue-400 border-blue-500/30',
      description: 'Algorithms cross-reference required clinical departments, procedures, ICU beds, budget caps, and geographic radius against verified hospital capability indexes across India.',
    },
    {
      step: '03',
      title: 'VERIFY',
      subtitle: 'Data Provenance & Care Gaps',
      icon: ShieldCheck,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
      description: 'Every displayed hospital capability, tariff estimate, and accreditation is backed by official sources (PM-JAY, NABH). If a required capability is missing, the Care Gap Engine alerts you transparently.',
    },
    {
      step: '04',
      title: 'COMPARE',
      subtitle: 'Side-by-Side Objective Matrix',
      icon: Scale,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
      description: 'Compare 2 to 4 hospitals side-by-side on verified procedures, package tariffs, ICU beds, and accreditation—without biased or unexplained "Best Hospital" claims.',
    },
    {
      step: '05',
      title: 'NAVIGATE',
      subtitle: 'Live Maps & Turn-by-Turn Routes',
      icon: Navigation,
      color: 'from-violet-500/20 to-fuchsia-500/20 text-violet-400 border-violet-500/30',
      description: 'Inspect exact geocoded hospital coordinates, check live driving distances, view transit routes, and connect directly to 24x7 emergency helplines.',
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Core Healthcare Discovery Workflow</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          How CareMatch Works
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          A trustworthy 5-step journey that converts patient healthcare needs into explainable, verified hospital matches.
        </p>
      </div>

      {/* 5 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-3xl glass-card border border-slate-800/90 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 group hover:shadow-xl hover:shadow-cyan-500/10"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black font-mono text-slate-600 group-hover:text-cyan-400 transition-colors">
                    {item.step}
                  </span>
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${item.color} border`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h4>
                  <div className="text-[11px] font-semibold text-cyan-400">
                    {item.subtitle}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Step</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
