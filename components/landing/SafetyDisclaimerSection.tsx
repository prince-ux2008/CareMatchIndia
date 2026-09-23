'use client';

import React from 'react';
import { ShieldCheck, AlertOctagon, HeartHandshake, PhoneCall, HeartPulse } from 'lucide-react';

export function SafetyDisclaimerSection() {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Responsible AI & Healthcare Decision Support Principles
            </h3>
            <p className="text-xs text-slate-400">
              Ethical boundaries, safety guardrails, and emergency protocols.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-semibold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700">
          <span>Non-Diagnostic Platform</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        
        <div className="p-4 rounded-2xl bg-navy-900/60 border border-slate-800 space-y-2">
          <div className="font-bold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>1. Decision Support Only</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            CareMatch India assists in discovering verified departments and comparing capabilities. It does not provide medical diagnoses or replace doctor consultations.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/60 border border-slate-800 space-y-2">
          <div className="font-bold text-white flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-amber-400" />
            <span>2. Zero Hallucination Separation</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Language parsing is strictly separated from factual medical tariffs. Prices, beds, and accreditations come exclusively from indexed registries.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/60 border border-slate-800 space-y-2">
          <div className="font-bold text-white flex items-center gap-1.5">
            <PhoneCall className="w-4 h-4 text-rose-400" />
            <span>3. Emergency Protocols</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            For critical medical symptoms (stroke, crushing chest pain, trauma), immediate 108/112 emergency routing overrides routine search.
          </p>
        </div>

      </div>
    </div>
  );
}
