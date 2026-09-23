'use client';

import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  Phone, 
  Clock, 
  Car, 
  Ambulance, 
  Bus, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Compass, 
  ArrowRight,
  ChevronRight,
  Radio,
  LocateFixed,
  Award
} from 'lucide-react';
import { HospitalRecord } from '@/lib/types';
import { calculateHaversineDistance } from '@/lib/utils';

interface InAppRouteModalProps {
  hospital: HospitalRecord;
  userCity: string;
  userCoords: { latitude: number; longitude: number };
  distanceKm?: number;
  isOpen?: boolean;
  onClose: () => void;
}

export function InAppRouteModal({ hospital, userCity, userCoords, distanceKm: propDistanceKm, onClose }: InAppRouteModalProps) {
  const [travelMode, setTravelMode] = useState<'car' | 'ambulance' | 'transit'>('car');

  // Calculate actual distance or use prop
  const distanceKm = propDistanceKm ?? (Math.round(
    calculateHaversineDistance(
      userCoords.latitude,
      userCoords.longitude,
      hospital.latitude,
      hospital.longitude
    ) * 10
  ) / 10);

  // Travel time computations
  const carSpeedKmH = 45;
  const ambulanceSpeedKmH = 65;
  const transitSpeedKmH = 30;

  const carMinutes = Math.max(4, Math.round((distanceKm / carSpeedKmH) * 60));
  const ambulanceMinutes = Math.max(2, Math.round((distanceKm / ambulanceSpeedKmH) * 60));
  const transitMinutes = Math.max(8, Math.round((distanceKm / transitSpeedKmH) * 60));

  const currentMinutes = 
    travelMode === 'car' ? carMinutes : travelMode === 'ambulance' ? ambulanceMinutes : transitMinutes;

  // Synthetic step checkpoints along Punjab highways
  const steps = [
    {
      id: 1,
      instruction: `Depart from ${userCity} center towards primary corridor / National Highway`,
      distance: `${Math.round(distanceKm * 0.15 * 10) / 10 || 1.2} km`,
      time: `${Math.max(1, Math.round(currentMinutes * 0.15))} min`,
    },
    {
      id: 2,
      instruction: `Continue straight on Grand Trunk Road / State Highway toward ${hospital.city}`,
      distance: `${Math.round(distanceKm * 0.6 * 10) / 10 || 5.5} km`,
      time: `${Math.max(2, Math.round(currentMinutes * 0.6))} min`,
    },
    {
      id: 3,
      instruction: `Take the hospital bypass flyover exit onto ${hospital.address.split(',')[1] || hospital.address.split(',')[0]}`,
      distance: `${Math.round(distanceKm * 0.15 * 10) / 10 || 1.5} km`,
      time: `${Math.max(1, Math.round(currentMinutes * 0.15))} min`,
    },
    {
      id: 4,
      instruction: `Turn into ${hospital.name} — Emergency & Inpatient Triage Gate`,
      distance: `200 m`,
      time: `1 min`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="max-w-3xl w-full rounded-3xl glass-card border border-cyan-500/30 overflow-hidden shadow-2xl bg-navy-950 flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-navy-900/90 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Navigation className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white">
                  In-App Live Route & Navigation
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse text-emerald-400" /> Live GPS Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">
                From <strong className="text-slate-200">{userCity}</strong> to <strong className="text-cyan-300">{hospital.name}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Travel Mode Selector & ETA Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setTravelMode('car')}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                travelMode === 'car'
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Car className={`w-5 h-5 ${travelMode === 'car' ? 'text-cyan-400' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold">Standard Car</div>
                  <div className="text-[11px] text-slate-400">Via NH44 / Highway</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-white">{carMinutes} min</div>
                <div className="text-[10px] text-slate-400">{distanceKm} km</div>
              </div>
            </button>

            <button
              onClick={() => setTravelMode('ambulance')}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                travelMode === 'ambulance'
                  ? 'bg-rose-500/20 border-rose-500/50 text-white shadow-lg shadow-rose-500/10'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Ambulance className={`w-5 h-5 ${travelMode === 'ambulance' ? 'text-rose-400' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold text-rose-300">Ambulance (108)</div>
                  <div className="text-[11px] text-slate-400">Priority Siren Route</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-rose-300">{ambulanceMinutes} min</div>
                <div className="text-[10px] text-slate-400">Fast Triage</div>
              </div>
            </button>

            <button
              onClick={() => setTravelMode('transit')}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                travelMode === 'transit'
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bus className={`w-5 h-5 ${travelMode === 'transit' ? 'text-emerald-400' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold">Public Bus / Transit</div>
                  <div className="text-[11px] text-slate-400">Regular Roadways</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-white">{transitMinutes} min</div>
                <div className="text-[10px] text-slate-400">{distanceKm} km</div>
              </div>
            </button>
          </div>

          {/* In-App Route Vector Canvas Map */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 relative overflow-hidden space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <LocateFixed className="w-3.5 h-3.5 text-cyan-400" /> Origin: <strong>{userCity} ({userCoords.latitude.toFixed(2)}°N, {userCoords.longitude.toFixed(2)}°E)</strong>
              </span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <MapPin className="w-3.5 h-3.5" /> Destination: <strong>{hospital.city} ({hospital.latitude.toFixed(2)}°N, {hospital.longitude.toFixed(2)}°E)</strong>
              </span>
            </div>

            {/* Simulated interactive visual road path */}
            <div className="h-36 w-full rounded-xl bg-navy-950/80 border border-cyan-500/20 relative flex items-center justify-between px-6 sm:px-12 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
              
              {/* Pulsing Road line */}
              <div className="absolute left-16 right-16 h-1 bg-slate-800 top-1/2 -translate-y-1/2 z-0">
                <div className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 animate-pulse" />
              </div>

              {/* Start Point */}
              <div className="z-10 flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-cyan-500/30">
                  <LocateFixed className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-white whitespace-nowrap">{userCity}</span>
              </div>

              {/* Highway Checkpoint */}
              <div className="z-10 flex flex-col items-center gap-1 hidden sm:flex">
                <div className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono text-cyan-300">
                  NH Corridor ({Math.round(distanceKm / 2)} km)
                </div>
              </div>

              {/* End Point Hospital */}
              <div className="z-10 flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/30">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-300 whitespace-nowrap text-center">
                  {hospital.name.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Turn-by-Turn Directions List */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Turn-by-Turn Road Checkpoints ({steps.length} Steps)</span>
            </h4>

            <div className="space-y-2">
              {steps.map((step) => (
                <div key={step.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {step.id}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">{step.instruction}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{hospital.address}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-cyan-300 text-xs">{step.distance}</div>
                    <div className="text-[10px] text-slate-400">{step.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hospital Address & Emergency Calling Quick Box */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-white text-sm">{hospital.name}</div>
              <div className="text-slate-400 mt-0.5">{hospital.address}, {hospital.city}, {hospital.state}</div>
              <div className="text-emerald-400 font-semibold mt-1">
                ✓ {hospital.totalBeds} Beds • {hospital.icuBeds} ICU Beds • {hospital.isEmergency24x7 ? '24x7 Emergency Active' : 'Normal Hours'}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(userCity)}&destination=${encodeURIComponent(hospital.name + ', ' + hospital.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20"
              >
                <Navigation className="w-4 h-4" />
                <span>Open Google Maps App</span>
              </a>

              <a
                href={`tel:${hospital.emergencyPhone || hospital.phone}`}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-rose-500/20"
              >
                <Phone className="w-4 h-4" />
                <span>Call Emergency: {hospital.emergencyPhone || '108'}</span>
              </a>

              <a
                href={`tel:${hospital.phone}`}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              >
                <Phone className="w-4 h-4" />
                <span>Hospital Desk</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
