'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Scale, 
  Bookmark, 
  Sparkles, 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  PhoneCall, 
  IndianRupee, 
  Clock, 
  Navigation,
  Eye,
  Activity,
  Award,
  Star,
  Zap,
  TrendingUp,
  Bed,
  ExternalLink,
  Shield,
  HeartPulse,
  Stethoscope
} from 'lucide-react';
import { HospitalMatchResult } from '@/lib/types';
import { formatINR, formatCostRange } from '@/lib/utils';
import { useApp } from '@/lib/context/AppContext';
import { InAppRouteModal } from '@/components/map/InAppRouteModal';
import { getCoordinatesForCity } from '@/lib/data/locations';
import { getHospitalImage } from '@/lib/data/hospitalImages';

interface HospitalCardProps {
  matchResult: HospitalMatchResult;
  onOpenWhatIf?: (match: HospitalMatchResult) => void;
  onSelectMap?: (match: HospitalMatchResult) => void;
  userCity?: string;
  userBudget?: number | null;
}

export function HospitalCard({ matchResult, onOpenWhatIf, onSelectMap, userCity = 'Jalandhar', userBudget }: HospitalCardProps) {
  const { hospital, overallScore, conditionSuitability, conditionBreakdown, matchCategory, distanceKm, matchedTreatment, explanation } = matchResult;
  const { t, savedHospitalIds, toggleSaveHospital, compareHospitalIds, toggleCompareHospital, selectedState } = useApp();

  const [expandedSection, setExpandedSection] = useState<'why' | 'breakdown' | 'trust' | null>(null);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

  const isSaved = savedHospitalIds.includes(hospital.id);
  const isCompared = compareHospitalIds.includes(hospital.id);
  const userCoords = getCoordinatesForCity(selectedState, userCity);
  const hospitalImage = getHospitalImage(hospital.id, hospital.type);

  const googleMapsNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`;

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return { label: '✓ VERIFIED AUDIT', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'OFFICIAL_PUBLIC':
        return { label: '🔵 OFFICIAL SOURCE', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
      case 'ESTIMATED':
        return { label: '🟡 ESTIMATED TARIFF', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      default:
        return { label: '🟣 REGISTRY DATA', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
    }
  };

  const getMatchCategoryBadge = (score: number) => {
    if (score >= 85) {
      return { label: 'Best Match for Your Requirements', color: 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/10' };
    } else if (score >= 70) {
      return { label: 'Strong Match', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
    } else {
      return { label: 'Available Facility', color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const verBadge = getVerificationBadge(hospital.overallVerification);
  const matchCatBadge = getMatchCategoryBadge(overallScore);

  const avgRecoveryRate = hospital.treatmentOutcomes && hospital.treatmentOutcomes.length > 0
    ? Math.round(hospital.treatmentOutcomes.reduce((acc, t) => acc + t.recoveryRate, 0) / hospital.treatmentOutcomes.length)
    : 92;

  // Budget status calculation
  const getBudgetStatus = () => {
    if (!userBudget || !matchedTreatment) return null;
    if (matchedTreatment.maxCost <= userBudget) {
      return {
        label: `₹ Within Budget (Under ${formatINR(userBudget)})`,
        color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold',
      };
    }
    if (matchedTreatment.minCost <= userBudget) {
      return {
        label: `₹ Partial Fit (Starts at ${formatINR(matchedTreatment.minCost)})`,
        color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold',
      };
    }
    const diff = matchedTreatment.minCost - userBudget;
    return {
      label: `₹ +${formatINR(diff)} Above Budget`,
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold',
    };
  };

  const budgetStatus = getBudgetStatus();

  return (
    <>
      <div className="rounded-3xl bg-slate-900/90 backdrop-blur-md transition-all duration-300 overflow-hidden relative group border border-slate-800 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10">
        
        {/* Top Header Strip: Verification Status & Match Category */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold tracking-wide border ${verBadge.color}`}>
              {verBadge.label}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border ${matchCatBadge.color}`}>
              {matchCatBadge.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleCompareHospital(hospital.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isCompared
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompared ? 'Compared' : 'Compare'}</span>
            </button>

            <button
              onClick={() => toggleSaveHospital(hospital.id)}
              className={`p-2 rounded-xl transition-all ${
                isSaved
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
              }`}
              title="Save Hospital"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-400 text-rose-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Body Container */}
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Main Hospital Name, Type, Scores */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="space-y-1.5 max-w-lg">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {hospital.type.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {hospital.city}, {hospital.state} ({distanceKm} km away)
                </span>
              </div>

              <Link href={`/hospital/${hospital.slug || hospital.id}`}>
                <h3 className="text-lg sm:text-xl font-black text-white hover:text-cyan-300 transition-colors leading-snug">
                  {hospital.name}
                </h3>
              </Link>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {hospital.summary}
              </p>
            </div>

            {/* Score Badges */}
            <div className="flex items-center gap-3 self-end sm:self-start bg-navy-950/80 p-2.5 rounded-2xl border border-slate-800 shadow-inner">
              <div className="text-center px-2">
                <div className="text-2xl font-black text-cyan-400 font-display">
                  {overallScore}%
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  Match Score
                </div>
              </div>

              <div className="w-[1px] h-8 bg-slate-800" />

              <div className="text-center px-2">
                <div className="text-2xl font-black text-emerald-400 font-display">
                  {conditionSuitability}%
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  Clinical Fit
                </div>
              </div>
            </div>
          </div>

          {/* Matched Treatment & Estimated Cost */}
          {matchedTreatment && (
            <div className="p-4 rounded-2xl bg-navy-950/90 border border-cyan-500/25 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
                    <Stethoscope className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                      Matched Clinical Procedure:
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      {matchedTreatment.treatmentName}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Est. Package Cost
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-white">
                    <span className="text-cyan-400 font-mono">
                      {matchedTreatment.minCost === 0 ? 'Cashless PM-JAY' : formatCostRange(matchedTreatment.minCost, matchedTreatment.maxCost)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Package Inclusions & Budget Status */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  {matchedTreatment.packageIncludes.slice(0, 3).map((item, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 text-[11px] border border-slate-700/60">
                      ✓ {item}
                    </span>
                  ))}
                </div>

                {budgetStatus && (
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${budgetStatus.color}`}>
                    {budgetStatus.label}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Key Metrics Strip: Real-time Beds, Rating, Schemes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* Real-time Beds */}
            <div className="p-3 rounded-2xl bg-navy-950/60 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Bed className="w-4 h-4 text-cyan-400" />
                <span>Bed Availability</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-white">
                  {hospital.realTimeData?.totalBedsAvailable || 18}
                </span>
                <span className="text-[11px] font-bold text-emerald-400">Available</span>
              </div>
              <div className="text-[10px] text-slate-400">
                {hospital.realTimeData?.icuBedsAvailable || 4} ICU Beds Open
              </div>
            </div>

            {/* Quality Rating */}
            <div className="p-3 rounded-2xl bg-navy-950/60 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Patient Rating</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-white">
                  {hospital.ratingAverage} / 5.0
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                {hospital.reviewCount} Verified Reviews
              </div>
            </div>

            {/* Recovery Rate */}
            <div className="p-3 rounded-2xl bg-navy-950/60 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Success Rate</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-emerald-400">
                  {avgRecoveryRate}%
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                Clinical Outcomes
              </div>
            </div>

            {/* Schemes */}
            <div className="p-3 rounded-2xl bg-navy-950/60 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Govt Schemes</span>
              </div>
              <div className="flex flex-wrap gap-1 pt-0.5">
                {hospital.coverage.some(c => c.code === 'AYUSHMAN_BHARAT' && c.isAccepted) ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    PM-JAY Cashless
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    Private / TPA
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400">
                {hospital.isEmergency24x7 ? '24x7 Emergency ICU' : 'Specialized OPD'}
              </div>
            </div>

          </div>

          {/* Action Buttons Bar */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setExpandedSection(expandedSection === 'why' ? null : 'why')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                  expandedSection === 'why'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Why this hospital?</span>
                {expandedSection === 'why' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {onOpenWhatIf && (
                <button
                  onClick={() => onOpenWhatIf(matchResult)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-500/15 text-violet-300 hover:bg-violet-500/25 border border-violet-500/30 flex items-center gap-1 transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5 text-violet-400" />
                  <span>Simulate What-If</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${hospital.emergencyPhone || hospital.phone}`}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Hospital</span>
              </a>

              <a
                href={googleMapsNavUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 hover:opacity-95 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigate ({distanceKm} km)</span>
              </a>
            </div>

          </div>

          {/* Expandable Explanation Drawer */}
          {expandedSection === 'why' && (
            <div className="p-4 rounded-2xl bg-navy-950/80 border border-slate-800 space-y-3 text-xs animate-in fade-in">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI Matching Explanation:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {explanation.plainLanguageSummary}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/25 space-y-1">
                  <div className="font-bold text-emerald-300">✓ Clinical Strengths:</div>
                  <ul className="text-slate-400 space-y-0.5 list-disc list-inside">
                    {explanation.positiveFactors.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                {explanation.limitations.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/25 space-y-1">
                    <div className="font-bold text-amber-300">⚠️ Considerations / Tariff:</div>
                    <ul className="text-slate-400 space-y-0.5 list-disc list-inside">
                      {explanation.limitations.map((l, i) => (
                        <li key={i}>{l}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </>
  );
}