'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, FileText, AlertCircle, Info, Lock } from 'lucide-react';

export function TrustProvenanceSection() {
  const statuses = [
    {
      badge: '✓ VERIFIED AUDIT',
      color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
      title: 'Verified Hospital Audit',
      desc: 'Information cross-checked directly with NABH directories, Hospital Medical Superintendents, and published public charge schedules.',
    },
    {
      badge: '🔵 OFFICIAL SOURCE',
      color: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
      title: 'Official Government Portals',
      desc: 'Direct feeds from the National Health Authority (PM-JAY), ABDM Health Facility Registry, and state health boards.',
    },
    {
      badge: '🟡 ESTIMATED TARIFF',
      color: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
      title: 'Package Tariff Benchmarks',
      desc: 'Transparent standard rate ranges for major procedures (PTCA, TKR, RIRS) clearly labeled as package estimates.',
    },
    {
      badge: '⚪ NOT AVAILABLE',
      color: 'bg-slate-800 text-slate-400 border-slate-700',
      title: 'Data Not Fabricated',
      desc: 'When verified data is unavailable, we state "Cost information unavailable" instead of inventing fake prices or slots.',
    },
  ];

  return (
    <div className="rounded-3xl glass-card border border-emerald-500/25 p-6 sm:p-8 space-y-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Data Provenance & Trust Hierarchy
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Every clinical fact, tariff estimate, and accreditation is linked to verifiable sources.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <Lock className="w-3.5 h-3.5" />
          <span>Zero Medical Hallucination</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statuses.map((s, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-navy-950/80 border border-slate-800 space-y-3"
          >
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border inline-block ${s.color}`}>
              {s.badge}
            </span>
            <h4 className="font-extrabold text-sm text-white">{s.title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>CareMatch India NEVER displays unexplained "Best Hospital" awards or fake patient statistics.</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">ABDM / PM-JAY & NABH Standards</span>
      </div>
    </div>
  );
}
