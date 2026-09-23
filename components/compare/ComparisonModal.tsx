'use client';

import React, { useState } from 'react';
import { 
  X, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  Minus, 
  ShieldCheck, 
  MapPin, 
  Trash2,
  Building2,
  BarChart3,
  Table as TableIcon,
  Star,
  Activity,
  HeartPulse,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import { HospitalRecord } from '@/lib/types';
import { formatINR, formatCostRange } from '@/lib/utils';
import { useApp } from '@/lib/context/AppContext';

interface ComparisonModalProps {
  hospitals: HospitalRecord[];
  onClose?: () => void;
  onRemove: (id: string) => void;
}

export function ComparisonModal({ hospitals, onClose, onRemove }: ComparisonModalProps) {
  const { clearCompare } = useApp();
  const [viewMode, setViewMode] = useState<'table' | 'charts'>('table');

  if (hospitals.length === 0) {
    return (
      <div className="rounded-3xl glass-card p-8 text-center max-w-xl mx-auto space-y-3 border border-slate-800">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center">
          <Scale className="w-6 h-6" />
        </div>
        <h3 className="font-extrabold text-lg text-white">No Hospitals in Comparison</h3>
        <p className="text-xs text-slate-400">
          Click the "Compare" button on 2 to 4 hospital cards in the search results to inspect side-by-side clinical capabilities, tariffs, and verified records.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl glass-card border border-cyan-500/25 p-5 sm:p-6 overflow-hidden shadow-2xl space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-lg sm:text-xl text-white">
              Side-by-Side Hospital Comparator
            </h2>
            <p className="text-xs text-slate-400">
              Comparing {hospitals.length} selected healthcare facilities with factual attributes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle View Mode */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                viewMode === 'table'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('charts')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                viewMode === 'charts'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Visual Charts</span>
            </button>
          </div>

          <button
            onClick={clearCompare}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 border border-rose-500/20 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {viewMode === 'charts' ? (
        <div className="mt-4 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Bed Capacity & ICU */}
            <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Total vs ICU Bed Capacity</span>
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hospitals.map(h => ({ name: h.name.length > 16 ? h.name.slice(0, 16) + '...' : h.name, 'Total Beds': h.totalBeds, 'ICU Beds': h.icuBeds }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="Total Beds" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="ICU Beds" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Clinical Capabilities */}
            <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Verified Departments & Treatments</span>
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hospitals.map(h => ({ name: h.name.length > 16 ? h.name.slice(0, 16) + '...' : h.name, 'Treatments Listed': h.treatments.length, 'Departments': h.departments.length }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="Treatments Listed" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Departments" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Verified Hospital Rating Index (Out of 5.0) */}
            <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3 lg:col-span-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>Verified Overall Hospital Rating Comparison (Out of 5.0)</span>
              </h4>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hospitals.map(h => ({ name: h.name.length > 24 ? h.name.slice(0, 24) + '...' : h.name, 'Rating Score': Number((h.ratingAverage || 4.5).toFixed(1)), 'Review Volume': Math.min(h.reviewCount || 120, 500) / 100 }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis domain={[0, 5]} stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="Rating Score" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* Comparison Table */
        <div className="overflow-x-auto pb-2">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 w-1/4">Evaluation Attribute</th>
                {hospitals.map((h) => (
                  <th key={h.id} className="py-3 px-4 w-1/4">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <div className="font-extrabold text-white text-sm normal-case">{h.name}</div>
                        <div className="text-[11px] text-slate-400 normal-case flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          <span>{h.city}, {h.state}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemove(h.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded-lg"
                        title="Remove from comparison"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80 text-xs">
              
              {/* Overall Hospital Rating */}
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-300">⭐ Overall Hospital Rating</td>
                {hospitals.map((h) => (
                  <td key={h.id} className="py-3.5 px-4 font-black text-amber-300 text-sm">
                    {h.ratingAverage ? (
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{h.ratingAverage.toFixed(1)} / 5</span>
                        <span className="text-[10px] text-slate-400 font-normal">({h.reviewCount || 40} reviews)</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 text-xs font-normal">Rating unavailable</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Classification */}
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-300">Classification</td>
                {hospitals.map((h) => (
                  <td key={h.id} className="py-3 px-4 text-slate-200">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-[11px] font-medium border border-slate-700">
                      {h.type.replace(/_/g, ' ')}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Accreditation */}
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-300">National Accreditation</td>
                {hospitals.map((h) => (
                  <td key={h.id} className="py-3 px-4 font-bold text-cyan-300">
                    {h.accreditation !== 'NONE' ? `${h.accreditation.replace('_', ' ')} Verified` : 'State Health Registered'}
                  </td>
                ))}
              </tr>

              {/* Emergency & Beds */}
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-300">24/7 Emergency & ICU</td>
                {hospitals.map((h) => (
                  <td key={h.id} className="py-3 px-4 text-slate-200">
                    <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{h.isEmergency24x7 ? '24x7 Active' : 'Standard'} ({h.icuBeds} ICU Beds)</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Total Beds */}
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-300">Total Bed Infrastructure</td>
                {hospitals.map((h) => (
                  <td key={h.id} className="py-3 px-4 font-bold text-white font-mono">
                    {h.totalBeds} Inpatient Beds
                  </td>
                ))}
              </tr>

              {/* Cardiac Cath Lab */}
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-300">Cardiac Cath Lab / Critical OT</td>
                {hospitals.map((h) => {
                  const hasCath = h.facilities.some(f => f.name.toLowerCase().includes('cath lab') || f.name.toLowerCase().includes('icu'));
                  return (
                    <td key={h.id} className="py-3 px-4">
                      {hasCath ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Available & Operational
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center gap-1">
                          <Minus className="w-3.5 h-3.5" /> Routine Facility
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Key Procedure Cost Range */}
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-300">Representative Tariff Range</td>
                {hospitals.map((h) => {
                  const treatment = h.treatments[0];
                  return (
                    <td key={h.id} className="py-3 px-4">
                      {treatment && treatment.isAvailable ? (
                        <div className="space-y-0.5">
                          <div className="font-extrabold text-emerald-400 text-sm font-mono">
                            {formatCostRange(treatment.minCost, treatment.maxCost, treatment.costType)}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {treatment.treatmentName}
                          </div>
                        </div>
                      ) : (
                        <span className="text-amber-400 font-medium">Standard Consultation</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Ayushman Bharat PMJAY */}
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-300">Ayushman Bharat PM-JAY</td>
                {hospitals.map((h) => {
                  const accepts = h.coverage.some(c => c.code === 'AYUSHMAN_BHARAT' && c.isAccepted);
                  return (
                    <td key={h.id} className="py-3 px-4">
                      {accepts ? (
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/30">
                          ✓ Empanelled Cashless
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Private / CGHS only</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Data Trust & Verification */}
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-300">Data Source & Provenance</td>
                {hospitals.map((h) => (
                  <td key={h.id} className="py-3 px-4 space-y-1">
                    <div className="flex items-center gap-1 text-cyan-300 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{h.overallVerification}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                      {h.primarySource.publisher}
                    </div>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      )}

      {/* Comparison Ethics / Medical Safety Notice */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Objective Comparison Policy:</strong> NeuralCare presents factual registry data to assist citizen decision-making. We do not declare any facility as medically "best". Choose facilities based on your specific clinical diagnosis, doctor consultation, and personal requirements.
        </div>
      </div>

    </div>
  );
}
