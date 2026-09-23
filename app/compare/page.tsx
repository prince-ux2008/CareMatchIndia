'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, ArrowLeft, Search } from 'lucide-react';
import { ComparisonModal } from '@/components/compare/ComparisonModal';
import { INITIAL_HOSPITALS_DATA } from '@/lib/data/hospitals';
import { useApp } from '@/lib/context/AppContext';

export default function ComparePage() {
  const { compareHospitalIds, toggleCompareHospital } = useApp();

  const comparedHospitals = INITIAL_HOSPITALS_DATA.filter(h =>
    compareHospitalIds.includes(h.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to AI Search Studio</span>
        </Link>

        <div className="text-xs text-slate-400 font-mono">
          Comparing {comparedHospitals.length} of max 4 facilities
        </div>
      </div>

      {/* Main Comparator Component */}
      <ComparisonModal
        hospitals={comparedHospitals}
        onRemove={(id) => toggleCompareHospital(id)}
      />

      {/* Add more prompt */}
      {comparedHospitals.length < 2 && (
        <div className="text-center py-6">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Find & Select More Hospitals to Compare</span>
          </Link>
        </div>
      )}

    </div>
  );
}
