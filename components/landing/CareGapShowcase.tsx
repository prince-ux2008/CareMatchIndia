'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle2, ArrowRight, ShieldCheck, Building2, Activity } from 'lucide-react';

export function CareGapShowcase() {
  return (
    <div className="rounded-3xl glass-card border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Care Gap Engine & Smart Alternatives
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Never be misled by incomplete hospital profiles. If a critical procedure or ICU facility is unverified, CareMatch detects the gap and routes you to verified alternatives.
          </p>
        </div>

        <Link
          href="/search"
          className="px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
        >
          <span>Try in Search Studio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Comparison Demo Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Scenario 1: Hospital with Care Gap */}
        <div className="p-5 rounded-2xl bg-navy-950/90 border border-rose-500/30 space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
              ⚠️ CARE GAP DETECTED
            </span>
            <span className="text-xs text-slate-400">Example General Facility</span>
          </div>

          <h4 className="font-extrabold text-sm text-white">
            Apex Community Hospital (General Ward)
          </h4>

          <div className="space-y-2 text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-2 text-slate-400">
              <span>Patient Need:</span>
              <strong className="text-white">Coronary Angioplasty (Emergency Stent)</strong>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/20 text-rose-200 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1">
                <span>✕ Missing Capability:</span>
                <span>24x7 Digital Flat-Panel Cath Lab</span>
              </div>
              <p className="text-[11px] text-slate-400">
                This facility does not list an active interventional catheterization laboratory.
              </p>
            </div>
          </div>
        </div>

        {/* Scenario 2: Smart Verified Alternative Provided */}
        <div className="p-5 rounded-2xl bg-navy-950/90 border border-emerald-500/40 space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              ✓ VERIFIED ALTERNATIVE FOUND
            </span>
            <span className="text-xs text-slate-400 font-mono">12 km away</span>
          </div>

          <h4 className="font-extrabold text-sm text-white">
            Tagore Hospital & Heart Care Centre
          </h4>

          <div className="space-y-2 text-xs text-slate-300 pt-1">
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-200 text-xs space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Match: 24x7 Cath Lab + 45-Bed CCU</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>Verified Angioplasty Tariff:</span>
                <span className="font-bold text-emerald-400 font-mono">₹1.60L – ₹2.40L (PM-JAY)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
