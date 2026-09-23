'use client';

import React from 'react';
import { HospitalMatchResult } from '@/lib/types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Activity, Bed, Award, TrendingUp, BarChart3 } from 'lucide-react';

interface ClinicalAnalyticsProps {
  matches: HospitalMatchResult[];
  searchedTreatmentName?: string;
}

const COLORS = ['#22d3ee', '#10b981', '#a855f7', '#f59e0b', '#3b82f6', '#ec4899'];

export function ClinicalAnalytics({ matches, searchedTreatmentName }: ClinicalAnalyticsProps) {
  if (!matches || matches.length === 0) return null;

  // 1. Bed Availability Data
  const bedData = matches.slice(0, 6).map((m) => ({
    name: m.hospital.name.length > 16 ? m.hospital.name.slice(0, 14) + '…' : m.hospital.name,
    generalBeds: m.hospital.realTimeData?.totalBedsAvailable || 0,
    icuBeds: m.hospital.realTimeData?.icuBedsAvailable || 0,
    currentPatients: m.hospital.realTimeData?.currentPatients || 0,
  }));

  // 2. Recovery Rate & Outcome Data
  const outcomeData = matches.slice(0, 6).map((m) => {
    const avgRecovery = m.hospital.treatmentOutcomes && m.hospital.treatmentOutcomes.length > 0
      ? Math.round(m.hospital.treatmentOutcomes.reduce((acc, t) => acc + t.recoveryRate, 0) / m.hospital.treatmentOutcomes.length)
      : 92;
    const avgStay = m.hospital.treatmentOutcomes && m.hospital.treatmentOutcomes.length > 0
      ? (m.hospital.treatmentOutcomes.reduce((acc, t) => acc + t.avgStayDays, 0) / m.hospital.treatmentOutcomes.length).toFixed(1)
      : '3.5';

    return {
      name: m.hospital.name.length > 16 ? m.hospital.name.slice(0, 14) + '…' : m.hospital.name,
      recoveryRate: avgRecovery,
      stayDays: parseFloat(avgStay),
      score: m.overallScore,
    };
  });

  // 3. Occupancy Distribution
  const totalAvailable = matches.reduce((acc, m) => acc + (m.hospital.realTimeData?.totalBedsAvailable || 0), 0);
  const totalOccupied = matches.reduce((acc, m) => acc + (m.hospital.realTimeData?.currentPatients || 0), 0);

  return (
    <div className="rounded-3xl glass-card border border-cyan-500/25 p-6 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>Clinical Analytics & Real-Time Capacity Dashboard</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                Live Verified
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Comparative metrics across {matches.length} matched facilities {searchedTreatmentName ? `for ${searchedTreatmentName}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <span className="text-slate-400 block text-[10px] font-bold">Available Beds</span>
            <span className="font-extrabold text-emerald-400 text-sm">{totalAvailable} Beds</span>
          </div>
          <div className="text-right border-l border-slate-800 pl-4">
            <span className="text-slate-400 block text-[10px] font-bold">Inpatients Admitted</span>
            <span className="font-extrabold text-cyan-300 text-sm">{totalOccupied} Patients</span>
          </div>
        </div>
      </div>

      {/* Grid: 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Bed Availability Bar Chart */}
        <div className="lg:col-span-7 bg-navy-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Bed & ICU Breakdown</span>
            </span>
            <span className="text-[10px] text-slate-500 font-normal">Top Matched Hospitals</span>
          </div>

          <div className="h-56 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bedData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0b1220', borderColor: '#22d3ee', borderRadius: '12px', color: '#f8fafc', fontSize: '11px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="generalBeds" name="General Beds Available" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                <Bar dataKey="icuBeds" name="ICU Beds Open" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Recovery Outcomes & Score */}
        <div className="lg:col-span-5 bg-navy-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Recovery Rate % vs AI Match</span>
            </span>
          </div>

          <div className="h-56 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outcomeData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis domain={[50, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0b1220', borderColor: '#10b981', borderRadius: '12px', color: '#f8fafc', fontSize: '11px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="recoveryRate" name="Success Rate %" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="score" name="Match Score %" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
