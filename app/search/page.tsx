'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Sparkles, 
  Send, 
  MapPin, 
  Scale, 
  RotateCcw, 
  Filter, 
  Compass, 
  IndianRupee, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronDown, 
  Layers, 
  Map as MapIcon, 
  List, 
  Activity, 
  Building2, 
  LocateFixed,
  BrainCircuit,
  ArrowUpDown,
  X
} from 'lucide-react';
import { LiveExtractionCard } from '@/components/search/LiveExtractionCard';
import { HospitalCard } from '@/components/search/HospitalCard';
import { InteractiveHospitalMap } from '@/components/map/InteractiveHospitalMap';
import { WhatIfModal } from '@/components/whatif/WhatIfModal';
import { EmergencyBanner } from '@/components/emergency/EmergencyBanner';
import { AICoreVisual } from '@/components/search/AICoreVisual';
import { ClinicalAnalytics } from '@/components/search/ClinicalAnalytics';
import { HealthcareRequirement, HospitalMatchResult, ChatMessage, ClarificationQuestion } from '@/lib/types';
import { extractHealthcareRequirement } from '@/lib/nlp/extractor';
import { INITIAL_HOSPITALS_DATA } from '@/lib/data/hospitals';
import { matchingEngine } from '@/lib/matching';
import { analyzeCareGap } from '@/lib/matching/caregap';
import { 
  getCoordinatesForCity, 
  INDIAN_STATES, 
  LOCATION_DATA, 
  getDistrictsForState, 
  getDefaultCityForState 
} from '@/lib/data/locations';
import { useApp } from '@/lib/context/AppContext';
import { formatINR } from '@/lib/utils';

function SearchStudioContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const initialView = searchParams.get('view') === 'map' ? 'map' : 'both';
  const { selectedState, setSelectedState, selectedCity, setSelectedCity, addSearchHistory } = useApp();

  const [inputQuery, setInputQuery] = useState(initialQ);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [activeClarifications, setActiveClarifications] = useState<ClarificationQuestion[]>([]);
  const [sortBy, setSortBy] = useState<'match' | 'distance' | 'beds' | 'rating' | 'cost_low'>('match');
  
  // Default Pan-India requirement (no forced default state/city lock)
  const [currentReq, setCurrentReq] = useState<HealthcareRequirement>({
    patient: 'Self',
    condition: 'Multi-Specialty & Cardiac Care',
    treatment: undefined,
    state: selectedState || 'All India',
    district: 'All Districts',
    city: selectedCity || 'All India Hubs',
    radiusKm: 50,
    budget: null,
    priorities: ['TREATMENT', 'COST'],
    requiredFacilities: [],
    coveragePreference: 'ANY',
    urgency: 'ROUTINE',
    language: 'en',
  });

  const [matchResults, setMatchResults] = useState<HospitalMatchResult[]>([]);
  const [activeWhatIfMatch, setActiveWhatIfMatch] = useState<HospitalMatchResult | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'both'>(initialView);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeProcessingQuery, setActiveProcessingQuery] = useState('');

  // Quick Clinical Condition presets
  const clinicalPresets = [
    { label: '🫀 Heart Problem / Angioplasty', query: 'Heart attack coronary angioplasty stent' },
    { label: '🪨 Kidney Stone Laser (RIRS)', query: 'Kidney stone laser removal RIRS PCNL' },
    { label: '🩺 Dialysis PMNDP Cashless', query: 'Hemodialysis center PMNDP cashless' },
    { label: '🦵 Total Knee Replacement', query: 'Total knee replacement TKR orthopedic surgery' },
    { label: '🎗️ Oncology & Chemo', query: 'Cancer oncology chemotherapy infusion' },
    { label: '👁️ Cataract Phaco Eye Care', query: 'Cataract eye surgery phacoemulsification' },
    { label: '🚨 24x7 Emergency Trauma ICU', query: '24x7 emergency trauma ICU critical care' },
  ];

  // Budget preset options
  const budgetPresets = [
    { label: 'All Budgets', value: null },
    { label: '< ₹25,000', value: 25000 },
    { label: '< ₹50,000', value: 50000 },
    { label: '< ₹1 Lakh', value: 100000 },
    { label: '< ₹2 Lakh', value: 200000 },
    { label: '< ₹3 Lakh', value: 300000 },
    { label: '< ₹5 Lakh', value: 500000 },
    { label: '< ₹10 Lakh+', value: 1000000 },
  ];

  // Dynamic state districts for dropdown
  const activeDistricts = getDistrictsForState(currentReq.state);

  // Initial load
  useEffect(() => {
    const queryToRun = initialQ || (currentReq.state === 'All India' ? 'Verified multi-specialty hospitals in India' : `Multi-specialty hospitals in ${currentReq.city} ${currentReq.state}`);
    handleProcessUserQuery(queryToRun, true);
  }, [initialQ]);

  const recalculateMatches = (req: HealthcareRequirement, sortCriteria: 'match' | 'distance' | 'beds' | 'rating' | 'cost_low') => {
    const coords = getCoordinatesForCity(req.state, req.city);
    const calculatedMatches = matchingEngine.match(req, INITIAL_HOSPITALS_DATA);
    calculatedMatches.forEach((m) => {
      m.careGap = analyzeCareGap(m.hospital, req, coords);
    });
    setMatchResults(sortMatches(calculatedMatches, sortCriteria));
  };

  const handleProcessUserQuery = (text: string, isInitial: boolean = false) => {
    setActiveProcessingQuery(text);
    setIsProcessing(true);

    const nlpRes = extractHealthcareRequirement(text);

    // Emergency Check
    if (nlpRes.isEmergency) {
      setIsEmergencyActive(true);
      setIsProcessing(false);
      return;
    }

    setIsEmergencyActive(false);

    // Only override state/city if explicitly mentioned in search query
    const targetState = nlpRes.requirement.state || currentReq.state;
    const targetCity = nlpRes.requirement.city || currentReq.city;
    const targetDistrict = nlpRes.requirement.district || currentReq.district;

    const updatedReq: HealthcareRequirement = {
      ...currentReq,
      patient: nlpRes.requirement.patient || currentReq.patient,
      condition: nlpRes.requirement.condition || currentReq.condition,
      treatment: nlpRes.requirement.treatment || currentReq.treatment,
      state: targetState,
      district: targetDistrict,
      city: targetCity,
      radiusKm: nlpRes.requirement.radiusKm || currentReq.radiusKm,
      budget: nlpRes.requirement.budget !== undefined ? nlpRes.requirement.budget : currentReq.budget,
      priorities: nlpRes.requirement.priorities || currentReq.priorities,
    };

    setCurrentReq(updatedReq);
    setActiveClarifications(nlpRes.clarifications);

    if (nlpRes.requirement.state && nlpRes.requirement.state !== selectedState) {
      setSelectedState(nlpRes.requirement.state);
    }
    if (nlpRes.requirement.city && nlpRes.requirement.city !== selectedCity) {
      setSelectedCity(nlpRes.requirement.city);
    }

    recalculateMatches(updatedReq, sortBy);
    addSearchHistory(text, matchResults.length);
    setIsProcessing(false);
  };

  const sortMatches = (list: HospitalMatchResult[], criteria: 'match' | 'distance' | 'beds' | 'rating' | 'cost_low') => {
    const copy = [...list];
    switch (criteria) {
      case 'distance':
        return copy.sort((a, b) => a.distanceKm - b.distanceKm);
      case 'beds':
        return copy.sort((a, b) => (b.hospital.realTimeData?.totalBedsAvailable || 0) - (a.hospital.realTimeData?.totalBedsAvailable || 0));
      case 'rating':
        return copy.sort((a, b) => (b.hospital.ratingAverage || 0) - (a.hospital.ratingAverage || 0));
      case 'cost_low':
        return copy.sort((a, b) => (a.matchedTreatment?.minCost || 999999) - (b.matchedTreatment?.minCost || 999999));
      case 'match':
      default:
        return copy.sort((a, b) => b.overallScore - a.overallScore || b.conditionSuitability - a.conditionSuitability);
    }
  };

  const handleClarificationAnswer = (field: keyof HealthcareRequirement, val: any) => {
    const updated = { ...currentReq, [field]: val };
    setCurrentReq(updated);
    setActiveClarifications(prev => prev.filter(c => c.field !== field));
    recalculateMatches(updated, sortBy);
  };

  const handleDirectFilterChange = (updates: Partial<HealthcareRequirement>) => {
    const updated = { ...currentReq, ...updates };
    setCurrentReq(updated);
    recalculateMatches(updated, sortBy);
  };

  const handleStateSelection = (newState: string) => {
    if (newState === 'All India') {
      setSelectedState('All India');
      setSelectedCity('All India Hubs');
      const updated = {
        ...currentReq,
        state: 'All India',
        district: 'All Districts',
        city: 'All India Hubs',
      };
      setCurrentReq(updated);
      recalculateMatches(updated, sortBy);
      return;
    }

    const stateObj = LOCATION_DATA[newState] || LOCATION_DATA['Maharashtra'];
    const firstDist = stateObj?.districts[0]?.name || 'Central';
    const firstCity = stateObj?.districts[0]?.cities[0]?.name || firstDist;
    
    setSelectedState(newState);
    setSelectedCity(firstCity);
    
    const updated = {
      ...currentReq,
      state: newState,
      district: firstDist,
      city: firstCity,
    };
    setCurrentReq(updated);
    recalculateMatches(updated, sortBy);
  };

  const handleDistrictSelection = (newDist: string) => {
    if (newDist === 'All Districts') {
      const updated = {
        ...currentReq,
        district: 'All Districts',
        city: currentReq.state === 'All India' ? 'All India Hubs' : getDefaultCityForState(currentReq.state),
      };
      setCurrentReq(updated);
      recalculateMatches(updated, sortBy);
      return;
    }

    const stateObj = LOCATION_DATA[currentReq.state] || LOCATION_DATA['Maharashtra'];
    const distObj = stateObj?.districts.find(d => d.name.toLowerCase() === newDist.toLowerCase());
    const targetCity = distObj?.cities[0]?.name || newDist;

    setSelectedCity(targetCity);
    const updated = {
      ...currentReq,
      district: newDist,
      city: targetCity,
    };
    setCurrentReq(updated);
    recalculateMatches(updated, sortBy);
  };

  const handleBudgetSelection = (budgetVal: number | null) => {
    handleDirectFilterChange({ budget: budgetVal });
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleDirectFilterChange({ city: 'GPS Location' });
          alert(`GPS Location Acquired (${pos.coords.latitude.toFixed(2)}°N, ${pos.coords.longitude.toFixed(2)}°E).`);
        },
        () => {
          alert('Location permission denied. Using manual location selection.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const userCoords = getCoordinatesForCity(currentReq.state, currentReq.city);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Emergency Banner if triggered */}
      {isEmergencyActive && (
        <EmergencyBanner onDismiss={() => setIsEmergencyActive(false)} />
      )}

      {/* UNIFIED TOP AI SEARCH & FILTER COCKPIT (All Controls Together at Top) */}
      <div className="rounded-3xl glass-card border border-cyan-500/30 p-5 sm:p-7 shadow-2xl space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Title & View Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10">
              <BrainCircuit className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl sm:text-2xl text-white tracking-tight">
                CAREMATCH AI Search & Matching Studio
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Natural-language hospital matching with GIS India map, real-time bed availability & clinical capability scoring
              </p>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-2xl bg-navy-950 border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setViewMode('both')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
                viewMode === 'both' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Split Map + List</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
                viewMode === 'list' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
                viewMode === 'map' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>
        </div>

        {/* 1. Main Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (inputQuery.trim()) {
              handleProcessUserQuery(inputQuery.trim());
            }
          }}
          className="flex items-center gap-2 p-1.5 rounded-2xl bg-navy-950 border border-cyan-500/40 shadow-inner relative z-10"
        >
          <div className="pl-3 text-cyan-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Search medical problem (e.g. heart problem, kidney stone, fracture, knee replacement, cancer, cataract)...`}
            className="flex-1 bg-transparent px-2 py-3 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none font-medium"
          />
          {inputQuery && (
            <button
              type="button"
              onClick={() => {
                setInputQuery('');
                handleProcessUserQuery('Multi specialty hospitals');
              }}
              className="p-2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={isProcessing}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 hover:opacity-95 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50 active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>AI Match</span>
          </button>
        </form>

        {/* 2. Top Unified Filter Strip (State, District, GPS, Sort, Budget, Radius) */}
        <div className="p-4 rounded-2xl bg-navy-950/80 border border-slate-800 space-y-3.5 text-xs relative z-10">
          
          {/* Row A: State & District Selectors + Sort */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex flex-wrap items-center gap-2.5">
              {/* State Filter */}
              <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>State:</span>
              </div>
              <select
                value={currentReq.state || 'All India'}
                onChange={(e) => handleStateSelection(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/50 text-cyan-300 font-extrabold focus:outline-none shadow-sm cursor-pointer"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s.code} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>

              {/* District Filter */}
              <div className="flex items-center gap-1.5 text-slate-300 font-bold ml-1">
                <span>District / City:</span>
              </div>
              <select
                value={currentReq.district || currentReq.city}
                onChange={(e) => handleDistrictSelection(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-bold focus:outline-none shadow-sm cursor-pointer"
              >
                {activeDistricts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>

              <button
                onClick={handleUseCurrentLocation}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-1.5 font-bold transition-colors"
                title="Use GPS Geolocation"
              >
                <LocateFixed className="w-3.5 h-3.5 text-cyan-400" />
                <span>Use GPS</span>
              </button>
            </div>

            {/* Sort Control */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sort By:</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => {
                  const newSort = e.target.value as any;
                  setSortBy(newSort);
                  setMatchResults(sortMatches(matchResults, newSort));
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="match">AI Requirement Match</option>
                <option value="distance">Proximity / Distance</option>
                <option value="cost_low">Affordable Package Cost</option>
                <option value="beds">Available Bed Count</option>
                <option value="rating">Hospital Quality Rating</option>
              </select>
            </div>

          </div>

          {/* Row B: Budget Presets & Radius */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            
            {/* Budget Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-300 font-bold flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                <span>Budget Cap:</span>
              </span>
              <div className="flex flex-wrap items-center gap-1">
                {budgetPresets.map((bp, idx) => {
                  const isSelected = currentReq.budget === bp.value;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleBudgetSelection(bp.value)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 font-black'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {bp.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Radius & Scheme */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-300 font-bold">Radius:</span>
                <div className="flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-bold">
                  {[10, 30, 50, 100, 200].map((r) => (
                    <button
                      key={r}
                      onClick={() => handleDirectFilterChange({ radiusKm: r })}
                      className={`px-2 py-0.5 rounded-lg transition-all ${
                        currentReq.radiusKm === r ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {r}km
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-300 font-bold">Scheme:</span>
                <select
                  value={currentReq.coveragePreference}
                  onChange={(e) => handleDirectFilterChange({ coveragePreference: e.target.value as any })}
                  className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-medium focus:outline-none"
                >
                  <option value="ANY">Any Scheme</option>
                  <option value="AYUSHMAN_BHARAT">Ayushman Bharat PM-JAY</option>
                  <option value="CGHS">CGHS / ECHS Cashless</option>
                </select>
              </div>
            </div>

          </div>

        </div>

        {/* Quick Clinical Prompts */}
        <div className="space-y-1.5 pt-1 relative z-10">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sample Clinical Prompts:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {clinicalPresets.map((cp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const locPart = currentReq.state === 'All India' ? '' : ` in ${currentReq.city} ${currentReq.state}`;
                  const q = `${cp.query}${locPart}`;
                  setInputQuery(cp.label.replace(/^[^\w]+/, ''));
                  handleProcessUserQuery(q);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-cyan-300 border border-slate-700/80 hover:border-cyan-500/40 text-xs font-semibold transition-all shadow-sm active:scale-95"
              >
                {cp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Clarification Chips Bar */}
        {activeClarifications.length > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-navy-900 to-slate-900 border border-amber-500/30 space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>Clarification Needed for Precise Match:</span>
            </div>
            
            <div className="space-y-3">
              {activeClarifications.map((cq) => (
                <div key={cq.id} className="space-y-2">
                  <div className="text-xs text-slate-200 font-semibold">{cq.question}</div>
                  <div className="flex flex-wrap gap-2">
                    {cq.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleClarificationAnswer(cq.field, opt.value)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-xs font-medium transition-all"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Multi-Stage AI Core Visual Pipeline */}
      <AICoreVisual isProcessing={isProcessing} query={activeProcessingQuery} />

      {/* Live Structured Requirement Extraction Card */}
      <LiveExtractionCard requirement={currentReq} />

      {/* Main Results Area: Map + Hospital List */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between text-xs text-slate-300">
          <div>
            Showing <strong className="text-white font-extrabold">{matchResults.length} verified hospitals</strong> for <strong className="text-cyan-300">{currentReq.treatment || currentReq.condition}</strong> in <strong className="text-white">{currentReq.city}, {currentReq.state}</strong>
            {currentReq.budget ? <span> (Budget: <strong className="text-emerald-300 font-bold">Under {formatINR(currentReq.budget)}</strong>)</span> : null}.
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                showAnalytics 
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/10' 
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <span>📊 {showAnalytics ? 'Hide Analytics' : 'Show Capacity Analytics'}</span>
            </button>
            <div className="hidden sm:flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 font-medium">Verifiable Registry</span>
            </div>
          </div>
        </div>

        {/* Clinical Analytics & Bed Availability Graph Drawer */}
        {showAnalytics && matchResults.length > 0 && (
          <ClinicalAnalytics 
            matches={matchResults} 
            searchedTreatmentName={currentReq.treatment || currentReq.condition} 
          />
        )}

        {/* Split View (List + Interactive Real GIS Map) */}
        {viewMode === 'both' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Hospital Result Cards List (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {matchResults.length === 0 ? (
                <div className="p-12 text-center rounded-2xl glass-card text-slate-400 space-y-3">
                  <Building2 className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-sm font-bold text-white">No hospitals found within {currentReq.radiusKm} km radius in {currentReq.city}, {currentReq.state}.</p>
                  <p className="text-xs">Try selecting All India or increasing your budget limit.</p>
                  <button
                    onClick={() => {
                      handleStateSelection('All India');
                      handleDirectFilterChange({ budget: null, radiusKm: 200 });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20"
                  >
                    View All India Verified Hospitals
                  </button>
                </div>
              ) : (
                matchResults.map((m) => (
                  <HospitalCard
                    key={m.hospital.id}
                    matchResult={m}
                    userCity={currentReq.city}
                    userBudget={currentReq.budget}
                    onOpenWhatIf={(match) => setActiveWhatIfMatch(match)}
                  />
                ))
              )}
            </div>

            {/* Right: Real Interactive GIS Leaflet India Map (5 Cols sticky) */}
            <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4 self-start">
              <InteractiveHospitalMap
                userCity={currentReq.city}
                userCoords={userCoords}
                radiusKm={currentReq.radiusKm}
                matches={matchResults}
                selectedState={currentReq.state}
                onStateSelect={(st) => handleStateSelection(st)}
                onUpdateRadius={(r) => handleDirectFilterChange({ radiusKm: r })}
                onUseCurrentLocation={handleUseCurrentLocation}
              />
            </div>

          </div>
        )}

        {/* List Only View */}
        {viewMode === 'list' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {matchResults.map((m) => (
              <HospitalCard
                key={m.hospital.id}
                matchResult={m}
                userCity={currentReq.city}
                userBudget={currentReq.budget}
                onOpenWhatIf={(match) => setActiveWhatIfMatch(match)}
              />
            ))}
          </div>
        )}

        {/* Map Only View */}
        {viewMode === 'map' && (
          <div className="space-y-4">
            <InteractiveHospitalMap
              userCity={currentReq.city}
              userCoords={userCoords}
              radiusKm={currentReq.radiusKm}
              matches={matchResults}
              selectedState={currentReq.state}
              onStateSelect={(st) => handleStateSelection(st)}
              onUpdateRadius={(r) => handleDirectFilterChange({ radiusKm: r })}
              onUseCurrentLocation={handleUseCurrentLocation}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchResults.slice(0, 6).map((m) => (
                <HospitalCard
                  key={m.hospital.id}
                  matchResult={m}
                  userCity={currentReq.city}
                  userBudget={currentReq.budget}
                  onOpenWhatIf={(match) => setActiveWhatIfMatch(match)}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* What-If Simulation Modal */}
      {activeWhatIfMatch && (
        <WhatIfModal
          matchResult={activeWhatIfMatch}
          baseRequirement={currentReq}
          onClose={() => setActiveWhatIfMatch(null)}
          onApplyRequirement={(updated) => {
            setCurrentReq(updated);
            recalculateMatches(updated, sortBy);
            setActiveWhatIfMatch(null);
          }}
        />
      )}

    </div>
  );
}

export default function SearchStudioPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto mb-3" />
        <span>Initializing CAREMATCH AI Healthcare Discovery Studio...</span>
      </div>
    }>
      <SearchStudioContent />
    </Suspense>
  );
}
