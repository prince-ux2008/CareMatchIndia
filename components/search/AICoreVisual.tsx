'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  BrainCircuit, 
  MapPin, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  Activity,
  Zap,
  Filter
} from 'lucide-react';

interface AICoreVisualProps {
  isProcessing: boolean;
  query: string;
  onComplete?: () => void;
}

export function AICoreVisual({ isProcessing, query }: AICoreVisualProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Query Intent Detection', detail: 'Parsing clinical urgency & patient target' },
    { label: 'Disease / Specialty Extraction', detail: 'Mapping clinical ontology & procedures' },
    { label: 'Geospatial Radius & Coordinates', detail: 'Calculating proximity & transport routes' },
    { label: 'Verified Database Hybrid Search', detail: 'Full-text & semantic vector scoring' },
    { label: 'Condition Suitability Engine', detail: 'Evaluating department, specialist & ICU capacity' },
    { label: 'Explainability & Factual Audit', detail: 'Generating transparent match rationale' },
  ];

  useEffect(() => {
    if (isProcessing) {
      setCurrentStep(0);
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 250);

      return () => clearInterval(interval);
    } else {
      setCurrentStep(steps.length);
    }
  }, [isProcessing]);

  if (!isProcessing) return null;

  return (
    <div className="p-5 rounded-3xl bg-gradient-to-br from-navy-950 via-slate-900 to-navy-900 border border-cyan-500/40 shadow-2xl space-y-4 animate-in fade-in duration-200 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-wide uppercase flex items-center gap-2">
              <span>CAREMATCH AI Neural Matching Core</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                Active Processing
              </span>
            </h3>
            <p className="text-xs text-slate-400 truncate max-w-md font-medium">
              Analyzing query: "{query || 'Healthcare requirements query'}"
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30">
          Step {Math.min(currentStep + 1, steps.length)} of {steps.length}
        </div>
      </div>

      {/* Steps Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {steps.map((step, idx) => {
          const isDone = currentStep > idx;
          const isCurrent = currentStep === idx;
          return (
            <div
              key={idx}
              className={`p-3 rounded-2xl border transition-all duration-300 space-y-1 ${
                isDone
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : isCurrent
                  ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/10 scale-[1.02]'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold">0{idx + 1}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-700" />
                )}
              </div>
              <div className="text-[11px] font-extrabold leading-snug line-clamp-2">
                {step.label}
              </div>
              <div className="text-[9px] text-slate-400 line-clamp-1 font-medium">
                {step.detail}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
