'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Building2, ShieldCheck, ArrowRight, Activity, Sparkles, Bed } from 'lucide-react';
import { INDIAN_STATES } from '@/lib/data/locations';
import { INITIAL_HOSPITALS_DATA } from '@/lib/data/hospitals';

export function IndiaMapVisual() {
  const [selectedStateCode, setSelectedStateCode] = useState('PB');

  // Filter hospitals for selected state
  const stateHospitals = INITIAL_HOSPITALS_DATA.filter(h => 
    selectedStateCode === 'ALL' || h.stateCode === selectedStateCode
  );

  const keyHubs = [
    { code: 'PB', name: 'Punjab & Chandigarh', count: 21, coords: { x: 34, y: 22 }, description: 'Apex tertiary network across 12+ districts including Tagore, DMC, PGI, Fortis.' },
    { code: 'GJ', name: 'Gujarat', count: 5, coords: { x: 28, y: 48 }, description: 'Asia\'s largest cardiac & multi-specialty centers: U.N. Mehta, Civil Hospital Ahmedabad, Kiran Surat, Apollo.' },
    { code: 'WB', name: 'West Bengal', count: 5, coords: { x: 70, y: 48 }, description: 'Eastern India medical hubs: RTIICS Narayana Mukundapur, SSKM Kolkata, Apollo Multispeciality, Tata Medical.' },
    { code: 'DL', name: 'Delhi NCR', count: 5, coords: { x: 40, y: 32 }, description: 'National apex institutes: AIIMS New Delhi, Safdarjung, Medanta The Medicity, Max Saket, ILBS.' },
    { code: 'MH', name: 'Maharashtra', count: 5, coords: { x: 33, y: 58 }, description: 'Comprehensive oncology & super-specialty: Tata Memorial, KEM, Kokilaben, Ruby Hall Pune, AIIMS Nagpur.' },
    { code: 'KA', name: 'Karnataka', count: 4, coords: { x: 36, y: 74 }, description: 'Apex neurosciences and cardiac hubs: NIMHANS, Narayana Health City, Manipal Hospital.' },
    { code: 'TN', name: 'Tamil Nadu', count: 4, coords: { x: 42, y: 84 }, description: 'Global healthcare destination: Apollo Greams Road, Christian Medical College (CMC Vellore), SIMS.' },
    { code: 'UP', name: 'Uttar Pradesh', count: 3, coords: { x: 52, y: 38 }, description: 'Premier public teaching & research: SGPGI Lucknow, KGMU, Medanta Lucknow.' },
    { code: 'TG', name: 'Telangana', count: 3, coords: { x: 45, y: 62 }, description: 'Apollo Health City Jubilee Hills, NIMS, AIG Hospitals Gachibowli.' },
    { code: 'RJ', name: 'Rajasthan', count: 3, coords: { x: 30, y: 36 }, description: 'SMS Hospital Jaipur, AIIMS Jodhpur, Fortis Escorts Hospital.' },
    { code: 'KL', name: 'Kerala', count: 3, coords: { x: 38, y: 88 }, description: 'Amrita Institute of Medical Sciences (AIMS Kochi), Aster Medcity, GMC Trivandrum.' },
  ];

  const activeHub = keyHubs.find(h => h.code === selectedStateCode) || keyHubs[0];

  return (
    <div className="rounded-3xl glass-card border border-cyan-500/25 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Pan-India Healthcare Discovery Grid
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explore verified super-specialty institutions and public teaching hospitals across Indian states.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>Explore All States</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Grid of Interactive State Hubs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Interactive State Selector List */}
        <div className="lg:col-span-5 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Select Healthcare Zone:
          </span>

          <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
            {keyHubs.map((hub) => {
              const isSelected = selectedStateCode === hub.code;
              return (
                <button
                  key={hub.code}
                  onClick={() => setSelectedStateCode(hub.code)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                      : 'bg-navy-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                      isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {hub.code}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-white">{hub.name}</h5>
                      <span className="text-[10px] text-slate-400">Verified Healthcare Hub</span>
                    </div>
                  </div>

                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-900 text-slate-400'
                  }`}>
                    {hub.count} Hospitals
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Hub Detailed Showcase */}
        <div className="lg:col-span-7 rounded-2xl bg-navy-950/90 border border-slate-800 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <h4 className="text-base font-extrabold text-white">{activeHub.name}</h4>
              </div>
              <p className="text-xs text-slate-400">{activeHub.description}</p>
            </div>

            <Link
              href={`/search?q=Hospitals+in+${encodeURIComponent(activeHub.name)}`}
              className="text-xs font-bold text-cyan-300 hover:underline shrink-0"
            >
              View in Studio →
            </Link>
          </div>

          {/* Hospitals in this state list */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Featured Verified Institutions in {activeHub.name}:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {stateHospitals.slice(0, 4).map((h) => (
                <Link
                  key={h.id}
                  href={`/hospital/${h.slug}`}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all block group"
                >
                  <div className="flex items-start justify-between gap-1">
                    <h6 className="font-bold text-xs text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {h.name}
                    </h6>
                    <span className="text-[10px] font-mono text-cyan-400 font-semibold shrink-0">
                      {h.totalBeds} Beds
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span>{h.city}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{h.accreditation.replace('_', ' ')}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Trust strip */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Accreditation & PM-JAY Empanelment Verified</span>
            </div>
            <span className="font-mono text-cyan-300 font-bold">{stateHospitals.length} Total Facilities</span>
          </div>
        </div>

      </div>
    </div>
  );
}
