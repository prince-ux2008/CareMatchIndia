'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';
import { HospitalMatchResult } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import { InAppRouteModal } from './InAppRouteModal';
import { PhoneCall, Navigation, Star } from 'lucide-react';

interface GoogleHospitalMapProps {
  apiKey: string;
  userCity: string;
  userCoords: { latitude: number; longitude: number };
  radiusKm: number;
  matches: HospitalMatchResult[];
  selectedMatchId?: string;
  onSelectHospital?: (match: HospitalMatchResult) => void;
  onUpdateRadius?: (newRadius: number) => void;
  onUseCurrentLocation?: () => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '480px',
};

// Sleek dark theme for Google Maps
const darkMapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#090d16' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#090d16' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#7488a6' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#00f0ff' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#4d6282' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#0d1927' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#2dd4bf' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#162235' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#0e1622' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#94a3b8' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#1e3250' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#101c2e' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#142033' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#07101e' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#3b82f6' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#07101e' }],
  },
];

export function GoogleHospitalMap({
  apiKey,
  userCity,
  userCoords,
  radiusKm,
  matches,
  selectedMatchId,
  onSelectHospital,
  onUpdateRadius,
  onUseCurrentLocation,
}: GoogleHospitalMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'carematch-google-map',
    googleMapsApiKey: apiKey,
  });

  const [activePin, setActivePin] = useState<HospitalMatchResult | null>(
    matches.find((m) => m.hospital.id === selectedMatchId) || matches[0] || null
  );
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [, setMapRef] = useState<google.maps.Map | null>(null);

  const center = useMemo(
    () => ({
      lat: userCoords.latitude,
      lng: userCoords.longitude,
    }),
    [userCoords.latitude, userCoords.longitude]
  );

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      setMapRef(map);
    },
    []
  );

  const onUnmount = useCallback(() => {
    setMapRef(null);
  }, []);

  if (loadError) {
    return (
      <div className="p-8 text-center bg-navy-950/80 rounded-3xl border border-rose-500/30 text-rose-300">
        <p className="font-bold">Google Maps failed to load.</p>
        <p className="text-xs text-slate-400 mt-1">Please check your API key in settings or use vector radar mode.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[480px] bg-navy-950/90 rounded-3xl border border-cyan-500/25 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
        <span className="text-xs text-cyan-300 font-semibold tracking-wider uppercase">
          Initializing Google Maps Live Healthcare Grid...
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-3xl glass-card border border-cyan-500/25 overflow-hidden shadow-2xl relative">
      {/* Top Map Toolbar */}
      <div className="p-4 bg-navy-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 z-10 relative">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
            <span className="text-sm font-black">🗺️</span>
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>CareMatch Google Maps Live Grid</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                Google Maps API Active
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Center: <span className="text-slate-200 font-semibold">{userCity}</span> • Radius:{' '}
              <span className="text-cyan-400 font-semibold">{radiusKm} km</span> • Showing{' '}
              <span className="text-emerald-400 font-semibold">{matches.length} Punjab Hospitals</span>
            </div>
          </div>
        </div>

        {/* Controls: Radius filter and Geolocation trigger */}
        <div className="flex items-center gap-2 text-xs">
          {onUseCurrentLocation && (
            <button
              onClick={onUseCurrentLocation}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-1 font-semibold transition-colors"
            >
              <span>📍 Use My GPS</span>
            </button>
          )}

          {onUpdateRadius && (
            <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-bold">
              {[10, 30, 50, 100].map((r) => (
                <button
                  key={r}
                  onClick={() => onUpdateRadius(r)}
                  className={`px-2 py-1 rounded-md transition-all ${
                    radiusKm === r ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r}km
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Google Map Canvas */}
      <div className="relative w-full h-[480px]">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={radiusKm <= 15 ? 12 : radiusKm <= 35 ? 10 : radiusKm <= 60 ? 9 : 8}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            styles: darkMapStyles,
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {/* User Location Marker */}
          <Marker
            position={center}
            title={`Your Location (${userCity})`}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#00f0ff',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
          />

          {/* Search Radius Circle */}
          <Circle
            center={center}
            radius={radiusKm * 1000}
            options={{
              strokeColor: '#00f0ff',
              strokeOpacity: 0.8,
              strokeWeight: 1.5,
              fillColor: '#00f0ff',
              fillOpacity: 0.04,
            }}
          />

          {/* Hospital Markers */}
          {matches.map((m) => {
            const isSelected = activePin?.hospital.id === m.hospital.id;
            const markerColor =
              m.matchCategory === 'Strong Match'
                ? '#10b981' // emerald
                : m.matchCategory === 'Good Match'
                ? '#38bdf8' // cyan
                : '#f59e0b'; // amber

            return (
              <Marker
                key={m.hospital.id}
                position={{
                  lat: m.hospital.latitude,
                  lng: m.hospital.longitude,
                }}
                title={`${m.hospital.name} (${m.distanceKm} km)`}
                icon={{
                  path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                  fillColor: markerColor,
                  fillOpacity: 1,
                  strokeColor: '#090d16',
                  strokeWeight: 1.5,
                  scale: isSelected ? 1.6 : 1.2,
                  anchor: new google.maps.Point(12, 22),
                }}
                onClick={() => {
                  setActivePin(m);
                  if (onSelectHospital) onSelectHospital(m);
                }}
              />
            );
          })}
        </GoogleMap>

        {/* Selected Hospital Floating Preview Card on Map */}
        {activePin && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md rounded-2xl bg-navy-950/95 border border-cyan-500/40 p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-3 z-20">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {activePin.overallScore}% Fit • {activePin.matchCategory}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {activePin.distanceKm} km away
                  </span>
                  {activePin.hospital.ratingAverage && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-400" />
                      {activePin.hospital.ratingAverage.toFixed(1)}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-sm text-white mt-1">{activePin.hospital.name}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{activePin.hospital.address}</p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setShowRouteModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors shadow-md shadow-cyan-500/20"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Route</span>
                </button>

                <a
                  href={`tel:${activePin.hospital.phone}`}
                  className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
                  title="Call Hospital"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Bed & Recovery Info in Map Popup */}
            {activePin.hospital.realTimeData && (
              <div className="mt-2.5 pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/80 p-1.5 rounded-lg">
                  <div className="text-slate-400 text-[10px]">Available Beds:</div>
                  <div className="font-bold text-emerald-400 font-mono">
                    {activePin.hospital.realTimeData.totalBedsAvailable} General / {activePin.hospital.realTimeData.icuBedsAvailable} ICU
                  </div>
                </div>
                {activePin.hospital.treatmentOutcomes && activePin.hospital.treatmentOutcomes.length > 0 && (
                  <div className="bg-slate-900/80 p-1.5 rounded-lg">
                    <div className="text-slate-400 text-[10px]">Avg Recovery:</div>
                    <div className="font-bold text-cyan-300 font-mono">
                      {Math.round(
                        activePin.hospital.treatmentOutcomes.reduce((acc, t) => acc + t.recoveryRate, 0) /
                          activePin.hospital.treatmentOutcomes.length
                      )}
                      % Success
                    </div>
                  </div>
                )}
              </div>
            )}

            {activePin.matchedTreatment && (
              <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300 truncate max-w-[200px]">
                  {activePin.matchedTreatment.treatmentName}
                </span>
                <span className="text-emerald-400 font-bold font-mono">
                  {formatINR(activePin.matchedTreatment.minCost)} – {formatINR(activePin.matchedTreatment.maxCost)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* In-App Route & Live Navigation Modal */}
      {showRouteModal && activePin && (
        <InAppRouteModal
          hospital={activePin.hospital}
          userCity={userCity}
          userCoords={userCoords}
          distanceKm={activePin.distanceKm}
          isOpen={showRouteModal}
          onClose={() => setShowRouteModal(false)}
        />
      )}
    </div>
  );
}
