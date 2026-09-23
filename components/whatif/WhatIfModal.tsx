'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sliders, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { HospitalMatchResult, HealthcareRequirement, UserPriority } from '@/lib/types';
import { matchingEngine } from '@/lib/matching';
import { formatINR } from '@/lib/utils';
import { useApp } from '@/lib/context/AppContext';

interface WhatIfModalProps {
  initialMatch?: HospitalMatchResult;
  matchResult?: HospitalMatchResult;
  initialRequirement?: HealthcareRequirement;
  baseRequirement?: HealthcareRequirement;
  onClose: () => void;
  onApplyNewRequirement?: (newReq: HealthcareRequirement) => void;
  onApplyRequirement?: (newReq: HealthcareRequirement) => void;
}

export function WhatIfModal({
  initialMatch,
  matchResult,
  initialRequirement,
  baseRequirement,
  onClose,
  onApplyNewRequirement,
  onApplyRequirement,
}: WhatIfModalProps) {
  const effectiveMatch = matchResult || initialMatch!;
  const effectiveRequirement = baseRequirement || initialRequirement!;
  const { t } = useApp();

  const [simBudget, setSimBudget] = useState<number>(effectiveRequirement?.budget || 200000);
  const [simRadius, setSimRadius] = useState<number>(effectiveRequirement?.radiusKm || 30);
  const [simPriorities, setSimPriorities] = useState<UserPriority[]>(effectiveRequirement?.priorities || ['TREATMENT', 'COST']);
  const [simCoverage, setSimCoverage] = useState<'ANY' | 'AYUSHMAN_BHARAT' | 'CGHS' | 'PRIVATE_INSURANCE'>('ANY');

  const [simResult, setSimResult] = useState<HospitalMatchResult>(effectiveMatch);

  // Recalculate on any slider change
  useEffect(() => {
    if (!effectiveRequirement || !effectiveMatch) return;
    const updatedReq: HealthcareRequirement = {
      ...effectiveRequirement,
      budget: simBudget,
      radiusKm: simRadius,
      priorities: simPriorities,
      coveragePreference: simCoverage,
    };

    const reCalculated = matchingEngine.match(updatedReq, [effectiveMatch.hospital]);
    if (reCalculated.length > 0) {
      setSimResult(reCalculated[0]);
    }
  }, [simBudget, simRadius, simPriorities, simCoverage, effectiveMatch, effectiveRequirement]);

  const scoreDelta = simResult.overallScore - effectiveMatch.overallScore;

  const togglePriority = (p: UserPriority) => {
    setSimPriorities(prev =>
      prev.includes(p) ? (prev.length > 1 ? prev.filter(x => x !== p) : prev) : [...prev, p]
    );
  };

  const handleApply = () => {
    const updated = {
      ...effectiveRequirement,
      budget: simBudget,
      radiusKm: simRadius,
      priorities: simPriorities,
      coveragePreference: simCoverage,
    };
    if (onApplyRequirement) {
      onApplyRequirement(updated);
    } else if (onApplyNewRequirement) {
      onApplyNewRequirement(updated);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl rounded-3xl bg-navy-900 border border-cyan-500/30 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-navy-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                “WHAT IF?” Interactive Scenario Sandbox
              </h3>
              <p className="text-xs text-slate-400">
                Simulating trade-offs for <span className="text-cyan-300 font-semibold">{effectiveMatch.hospital.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Real-time Before vs After Delta Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-navy-950 to-slate-900 border border-cyan-500/25 flex items-center justify-between">
            <div className="text-center">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Original Fit</div>
              <div className="text-2xl font-black text-slate-300">{effectiveMatch.overallScore}%</div>
              <div className="text-[10px] text-slate-400">{effectiveMatch.matchCategory}</div>
            </div>

            <div className="flex flex-col items-center">
              <ArrowRight className="w-5 h-5 text-cyan-400" />
              <div className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 flex items-center gap-1 ${
                scoreDelta > 0 ? 'bg-emerald-500/20 text-emerald-300' : scoreDelta < 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-300'
              }`}>
                {scoreDelta > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : scoreDelta < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : null}
                <span>{scoreDelta > 0 ? `+${scoreDelta}%` : `${scoreDelta}%`} Delta</span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-[11px] font-semibold text-cyan-400 uppercase">Simulated Fit</div>
              <div className="text-2xl font-black text-cyan-300">{simResult.overallScore}%</div>
              <div className="text-[10px] text-cyan-400">{simResult.matchCategory}</div>
            </div>
          </div>

          {/* Controls: Budget Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-white">
              <span>What if your Budget changes?</span>
              <span className="text-emerald-400 font-bold">{formatINR(simBudget)}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="500000"
              step="10000"
              value={simBudget}
              onChange={(e) => setSimBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>₹50,000</span>
              <span>₹2,00,000</span>
              <span>₹3,50,000</span>
              <span>₹5,00,000+</span>
            </div>
          </div>

          {/* Controls: Radius Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-white">
              <span>What if Search Radius changes?</span>
              <span className="text-sky-400 font-bold">{simRadius} km</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[10, 30, 50, 100].map((rad) => (
                <button
                  key={rad}
                  onClick={() => setSimRadius(rad)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    simRadius === rad
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-md shadow-cyan-500/15'
                      : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {rad} km
                </button>
              ))}
            </div>
          </div>

          {/* Controls: User Priorities */}
          <div className="space-y-2">
            <div className="text-xs sm:text-sm font-semibold text-white">
              What if your Top Priorities change?
            </div>
            <div className="flex flex-wrap gap-2">
              {(['TREATMENT', 'COST', 'DISTANCE', 'FACILITIES', 'COVERAGE', 'VERIFICATION'] as UserPriority[]).map((p) => {
                const isSelected = simPriorities.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => togglePriority(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {isSelected ? `✓ ${p}` : p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-time Dynamic Reason Updates */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Simulated Compatibility Explanations:</span>
            </div>
            <div className="space-y-1">
              {simResult.explanation.whyMatch.slice(0, 2).map((why, i) => (
                <div key={i} className="text-emerald-300 flex items-center gap-1.5">
                  <span>✓</span>
                  <span>{why}</span>
                </div>
              ))}
              {simResult.explanation.whatDoesNotMatch.slice(0, 2).map((wn, i) => (
                <div key={i} className="text-amber-300 flex items-center gap-1.5">
                  <span>⚠</span>
                  <span>{wn}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-navy-950 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              setSimBudget(effectiveRequirement?.budget || 200000);
              setSimRadius(effectiveRequirement?.radiusKm || 30);
              setSimPriorities(effectiveRequirement?.priorities || ['TREATMENT', 'COST']);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Simulation</span>
          </button>

          <button
            onClick={handleApply}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-500 to-emerald-400 text-navy-950 hover:opacity-95 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
          >
            Apply Scenario to All Hospitals
          </button>
        </div>

      </div>
    </div>
  );
}
