'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Layers, 
  Navigation, 
  LocateFixed, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Globe, 
  Star, 
  Bed, 
  PhoneCall, 
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Activity,
  Maximize2
} from 'lucide-react';
import { HospitalMatchResult } from '@/lib/types';
import { formatINR } from '@/lib/utils';

interface IndiaGISMapProps {
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

export default function IndiaGISMap({
  userCity,
  userCoords,
  radiusKm,
  matches,
  selectedMatchId,
  onSelectHospital,
  onUpdateRadius,
  onUseCurrentLocation,
  onStateSelect,
  selectedState = 'All India',
}: IndiaGISMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersLayer = useRef<any>(null);

  const [activeHospital, setActiveHospital] = useState<HospitalMatchResult | null>(
    matches.find(m => m.hospital.id === selectedMatchId) || matches[0] || null
  );
  const [mapTheme, setMapTheme] = useState<'dark' | 'streets' | 'satellite'>('dark');
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize Map with 100% Free, High-Speed, Watermark-Free Esri & OSM Tile Layers
  useEffect(() => {
    let isCancelled = false;

    async function setupMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      try {
        const L = (await import('leaflet')).default;

        if (isCancelled) return;

        // Clean up previous instance safely
        if (mapInstance.current) {
          mapInstance.current.off();
          mapInstance.current.remove();
          mapInstance.current = null;
        }

        const centerLat = userCoords.latitude || 21.7679;
        const centerLng = userCoords.longitude || 78.8718;
        const initialZoom = selectedState === 'All India' ? 5 : 8;

        const map = L.map(mapContainerRef.current, {
          center: [centerLat, centerLng],
          zoom: initialZoom,
          minZoom: 4,
          maxZoom: 18,
          zoomControl: false,
          attributionControl: false,
        });

        // 100% Watermark-Free High Speed GIS Tile Layers
        if (mapTheme === 'dark') {
          // Esri Dark Gray Canvas Base + Labels (No API Key Required)
          L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 16,
          }).addTo(map);
          L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 16,
          }).addTo(map);
        } else if (mapTheme === 'streets') {
          // OpenStreetMap Standard (No API Key Required)
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
          }).addTo(map);
        } else if (mapTheme === 'satellite') {
          // Esri World Imagery (No API Key Required)
          L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19,
          }).addTo(map);
        }

        const group = L.featureGroup().addTo(map);
        markersLayer.current = group;
        mapInstance.current = map;

        setTimeout(() => map.invalidateSize(), 60);
        setTimeout(() => map.invalidateSize(), 200);
        setTimeout(() => map.invalidateSize(), 500);

        setMapLoaded(true);
      } catch (err) {
        console.error('Leaflet initialization error:', err);
      }
    }

    setupMap();

    return () => {
      isCancelled = true;
      if (mapInstance.current) {
        mapInstance.current.off();
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [mapTheme]);

  // Update Hospital Pins & Auto-Pan
  useEffect(() => {
    if (!mapLoaded || !mapInstance.current) return;

    async function drawMarkers() {
      try {
        const L = (await import('leaflet')).default;
        const map = mapInstance.current;
        const group = markersLayer.current;

        if (!map || !group) return;

        group.clearLayers();

        const centerLat = userCoords.latitude || 21.7679;
        const centerLng = userCoords.longitude || 78.8718;

        // User Search Hub Marker (when a specific state/city is chosen)
        if (selectedState !== 'All India' && userCity !== 'All India Hubs') {
          const userIcon = L.divIcon({
            className: 'custom-user-center',
            html: `
              <div style="position: relative; display: flex; align-items: center; justify-content: center;">
                <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(6, 182, 212, 0.35); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                <div style="width: 18px; height: 18px; border-radius: 50%; background: #06b6d4; border: 3px solid #ffffff; box-shadow: 0 0 16px #22d3ee;"></div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          L.marker([centerLat, centerLng], { icon: userIcon }).addTo(group);

          if (radiusKm && radiusKm <= 200) {
            L.circle([centerLat, centerLng], {
              radius: radiusKm * 1000,
              color: '#06b6d4',
              weight: 1.5,
              dashArray: '4, 4',
              fillColor: '#06b6d4',
              fillOpacity: 0.08,
            }).addTo(group);
          }
        }

        // Plot Clean, Sleek Hospital Pins
        matches.forEach((m, idx) => {
          const hosp = m.hospital;
          if (!hosp.latitude || !hosp.longitude) return;

          const isTopMatch = m.overallScore >= 85;
          const markerBg = isTopMatch ? '#10b981' : '#0284c7';
          const glowColor = isTopMatch ? 'rgba(16, 185, 129, 0.6)' : 'rgba(34, 211, 238, 0.5)';

          const hospIcon = L.divIcon({
            className: 'custom-hosp-pin',
            html: `
              <div style="cursor: pointer; transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center; position: relative;">
                <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: ${glowColor}; opacity: 0.4;"></div>
                <div style="width: 28px; height: 28px; border-radius: 50%; background: #0b1220; border: 2.5px solid ${markerBg}; box-shadow: 0 0 14px ${glowColor}; display: flex; align-items: center; justify-content: center; color: #ffffff; font-family: sans-serif; font-size: 10px; font-weight: 900;">
                  ${m.overallScore}
                </div>
              </div>
            `,
            iconSize: [34, 34],
            iconAnchor: [17, 17],
          });

          const marker = L.marker([hosp.latitude, hosp.longitude], { icon: hospIcon }).addTo(group);

          const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${hosp.latitude},${hosp.longitude}`;

          const popupHtml = `
            <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 230px; padding: 4px; color: #f8fafc;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 3px;">
                <span style="font-size: 10px; font-weight: bold; color: #38bdf8; background: rgba(6,182,212,0.15); padding: 2px 6px; border-radius: 6px;">
                  ${hosp.city}, ${hosp.state}
                </span>
                <span style="font-size: 11px; font-weight: 900; color: #34d399;">
                  ★ ${hosp.ratingAverage} (${hosp.reviewCount})
                </span>
              </div>
              <h4 style="font-size: 13px; font-weight: 800; color: #ffffff; margin: 3px 0; line-height: 1.2;">
                ${hosp.name}
              </h4>
              <div style="font-size: 11px; color: #94a3b8; margin: 3px 0;">
                🛏️ <strong style="color: #38bdf8;">${hosp.realTimeData?.totalBedsAvailable || 18} Beds Open</strong> • ${m.distanceKm} km away
              </div>
              <div style="margin-top: 8px;">
                <a href="${navUrl}" target="_blank" style="display: block; text-align: center; background: linear-gradient(to right, #0284c7, #2563eb); color: #ffffff; text-decoration: none; padding: 6px; border-radius: 8px; font-size: 11px; font-weight: bold; box-shadow: 0 2px 8px rgba(2, 132, 199, 0.3);">
                  Navigate in Google Maps ➔
                </a>
              </div>
            </div>
          `;

          marker.bindPopup(popupHtml);

          marker.on('click', () => {
            setActiveHospital(m);
            if (onSelectHospital) onSelectHospital(m);
          });
        });

        // Smooth Auto Pan and Bounds Fitting
        if (matches.length > 0 && selectedState !== 'All India') {
          const bounds = group.getBounds();
          if (bounds.isValid()) {
            map.flyToBounds(bounds.pad(0.18), { duration: 1 });
          }
        } else if (selectedState === 'All India') {
          map.flyTo([21.7679, 78.8718], 5, { duration: 1 });
        } else {
          map.flyTo([centerLat, centerLng], 8, { duration: 1 });
        }
      } catch (err) {
        console.error('Marker update error:', err);
      }
    }

    drawMarkers();
  }, [mapLoaded, matches, userCoords, radiusKm, selectedState]);

  const handleZoomIn = () => mapInstance.current?.zoomIn();
  const handleZoomOut = () => mapInstance.current?.zoomOut();
  const handleResetToIndia = () => mapInstance.current?.flyTo([21.7679, 78.8718], 5, { duration: 1 });

  return (
    <div className="rounded-3xl glass-card border border-cyan-500/30 overflow-hidden shadow-2xl flex flex-col h-[580px] relative">
      
      {/* Top Controls Header */}
      <div className="p-3.5 bg-navy-950/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-xs font-black text-white flex items-center gap-1.5">
              <span>Interactive GIS India Healthcare Map</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                {matches.length} Plotted
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              {selectedState === 'All India' ? 'Pan-India Overview' : `${selectedState}: ${userCity}`} • Real GIS Map
            </div>
          </div>
        </div>

        {/* Map Layers */}
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <div className="flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-700 text-[10px] font-bold">
            <button
              onClick={() => setMapTheme('dark')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${mapTheme === 'dark' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
            >
              Dark GIS
            </button>
            <button
              onClick={() => setMapTheme('streets')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${mapTheme === 'streets' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
            >
              Streets
            </button>
            <button
              onClick={() => setMapTheme('satellite')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${mapTheme === 'satellite' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
            >
              Satellite
            </button>
          </div>

          <button
            onClick={handleResetToIndia}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors"
            title="Pan to All India"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Map Body */}
      <div className="relative flex-1 w-full h-full bg-[#050a14] overflow-hidden">
        
        {/* Leaflet DOM container */}
        <div 
          ref={mapContainerRef} 
          className="w-full h-full min-h-[480px] z-10" 
          style={{ height: '100%', width: '100%', minHeight: '480px' }}
        />

        {/* Floating Zoom & GPS Controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 shadow-xl">
          <button
            onClick={handleZoomIn}
            className="p-2.5 rounded-xl bg-navy-900/95 hover:bg-slate-800 text-white border border-slate-700 shadow-md transition-all active:scale-95"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 text-cyan-400" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2.5 rounded-xl bg-navy-900/95 hover:bg-slate-800 text-white border border-slate-700 shadow-md transition-all active:scale-95"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-cyan-400" />
          </button>
          {onUseCurrentLocation && (
            <button
              onClick={onUseCurrentLocation}
              className="p-2.5 rounded-xl bg-navy-900/95 hover:bg-slate-800 text-emerald-400 border border-slate-700 shadow-md transition-all active:scale-95"
              title="GPS Location"
            >
              <LocateFixed className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bottom Floating Hospital Info Card */}
        {activeHospital && (
          <div className="absolute bottom-3 left-3 right-3 z-20 p-3.5 rounded-2xl bg-navy-950/95 border border-cyan-500/40 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between gap-2">
              <div className="space-y-0.5 max-w-[70%]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-cyan-500/15 text-cyan-300 font-mono">
                    {activeHospital.overallScore}% MATCH
                  </span>
                  <span className="text-[11px] text-slate-400 truncate">
                    {activeHospital.hospital.city}, {activeHospital.hospital.state} ({activeHospital.distanceKm} km)
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white truncate">
                  {activeHospital.hospital.name}
                </h4>
                <div className="text-[10px] text-emerald-400 font-medium">
                  🛏️ {activeHospital.hospital.realTimeData?.totalBedsAvailable || 18} Beds Open • {activeHospital.hospital.ratingAverage} ★
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${activeHospital.hospital.latitude},${activeHospital.hospital.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
