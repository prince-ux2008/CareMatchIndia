'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, Search, ArrowRight, Trash2, Building2 } from 'lucide-react';
import { HospitalCard } from '@/components/search/HospitalCard';
import { INITIAL_HOSPITALS_DATA } from '@/lib/data/hospitals';
import { matchingEngine } from '@/lib/matching';
import { useApp } from '@/lib/context/AppContext';

export default function SavedPage() {
  const { savedHospitalIds, toggleSaveHospital, t } = useApp();

  const savedHospitals = INITIAL_HOSPITALS_DATA.filter(h =>
    savedHospitalIds.includes(h.id)
  );

  // Compute dummy match results for consistent card display
  const matchResults = matchingEngine.match(
    {
      patient: 'Self',
      condition: 'Saved Shortlist',
      state: 'Punjab',
      city: 'Jalandhar',
      radiusKm: 50,
      priorities: ['TREATMENT', 'COST'],
      requiredFacilities: [],
      coveragePreference: 'ANY',
      urgency: 'ROUTINE',
      language: 'en',
    },
    savedHospitals
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl sm:text-2xl text-white">
              Shortlisted & Saved Hospitals
            </h1>
            <p className="text-xs text-slate-400">
              Your saved healthcare facilities ready for family decision making and consultation
            </p>
          </div>
        </div>

        <Link
          href="/search"
          className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Discover More Hospitals</span>
        </Link>
      </div>

      {savedHospitals.length === 0 ? (
        <div className="rounded-2xl glass-card p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-white">No Hospitals Shortlisted Yet</h3>
          <p className="text-xs text-slate-400">
            Click the "Save" bookmark button on any hospital card in the AI Search Studio to save it here.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-navy-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
          >
            <span>Start Searching</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {matchResults.map((m) => (
            <HospitalCard key={m.hospital.id} matchResult={m} />
          ))}
        </div>
      )}

    </div>
  );
}
