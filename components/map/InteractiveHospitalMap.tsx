'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { HospitalMatchResult } from '@/lib/types';
import { Globe, Loader2 } from 'lucide-react';

interface InteractiveHospitalMapProps {
  userCity: string;
  userCoords: { latitude: number; longitude: number };
  radiusKm: number;
  matches: HospitalMatchResult[];
  selectedMatchId?: string;
  onSelectHospital?: (match: HospitalMatchResult) => void;
  onUpdateRadius?: (newRadius: number) => void;
  onUseCurrentLocation?: () => void;
  onStateSelect?: (stateName: string) => void;
  selectedState?: string;
}

// Dynamically import GIS map with ssr: false for 100% reliable client-side rendering
const DynamicGISMap = dynamic(() => import('./IndiaGISMap'), {
  ssr: false,
  loading: () => (
    <div className="rounded-3xl glass-card border border-cyan-500/30 overflow-hidden shadow-2xl flex flex-col items-center justify-center h-[580px] bg-[#050a14] text-slate-400 space-y-3">
      <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 animate-pulse border border-cyan-500/30">
        <Globe className="w-8 h-8 animate-spin" />
      </div>
      <div className="text-sm font-bold text-white">Loading GIS India Healthcare Map...</div>
      <div className="text-xs text-slate-500">Plotting verified hospital coordinates & GIS tiles</div>
    </div>
  ),
});

export function InteractiveHospitalMap(props: InteractiveHospitalMapProps) {
  return <DynamicGISMap {...props} />;
}
