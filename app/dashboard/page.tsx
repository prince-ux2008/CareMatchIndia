'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  LayoutDashboard, 
  Search, 
  Bookmark, 
  Scale, 
  History, 
  Settings, 
  Sparkles, 
  Heart, 
  Activity, 
  Bone, 
  Eye, 
  BrainCircuit, 
  ArrowRight,
  ShieldCheck,
  MapPin,
  Globe,
  Building2,
  PhoneCall,
  Stethoscope,
  BadgeAlert,
  Sliders,
  DollarSign,
  Zap,
  BedDouble
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { INITIAL_HOSPITALS_DATA } from '@/lib/data/hospitals';
import { INDIAN_STATES } from '@/lib/data/locations';
import { SupportedLanguage } from '@/lib/i18n/translations';

export default function DashboardPage() {
  const router = useRouter();
  const { 
    t, 
    memberId, 
    userProfile,
    language, 
    setLanguage, 
    selectedState, 
    setSelectedState, 
    selectedCity, 
    setSelectedCity,
    savedHospitalIds, 
    compareHospitalIds, 
    searchHistory 
  } = useApp();

  const [dashQuery, setDashQuery] = useState('');

  // Real data calculations
  const totalHospitals = INITIAL_HOSPITALS_DATA.length;
  const nearbyHospitals = INITIAL_HOSPITALS_DATA.filter(h => 
    h.city.toLowerCase() === selectedCity.toLowerCase() || h.state.toLowerCase() === selectedState.toLowerCase()
  ).length;
  const emergencyFacilities = INITIAL_HOSPITALS_DATA.filter(h => h.isEmergency24x7).length;
  const totalDepartments = Array.from(new Set(INITIAL_HOSPITALS_DATA.flatMap(h => h.departments))).length;
  const totalProcedures = INITIAL_HOSPITALS_DATA.reduce((acc, h) => acc + h.treatments.length, 0);

  // Time based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickActions = [
    {
      title: 'Find Nearby Hospitals',
      desc: 'Browse facilities around your active location',
      icon: MapPin,
      color: 'from-cyan-500/20 to-blue-500/10 text-cyan-300 border-cyan-500/30',
      action: () => router.push(`/search?q=Hospitals+near+${encodeURIComponent(selectedCity)}`),
    },
    {
      title: 'Emergency Care',
      desc: '24x7 trauma & ICU critical response units',
      icon: PhoneCall,
      color: 'from-rose-500/20 to-red-500/10 text-rose-300 border-rose-500/30',
      action: () => router.push('/search?q=24x7+emergency+trauma+ICU+critical+care'),
    },
    {
      title: 'Find Specialist',
      desc: 'Cardiology, Neurology, Oncology & Orthopedics',
      icon: Stethoscope,
      color: 'from-violet-500/20 to-purple-500/10 text-violet-300 border-violet-500/30',
      action: () => router.push('/search?q=Specialist+consultation+and+treatments'),
    },
    {
      title: 'Disease / Condition Search',
      desc: 'Natural language symptom & condition discovery',
      icon: Activity,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-300 border-emerald-500/30',
      action: () => router.push('/search'),
    },
    {
      title: 'Compare Hospitals',
      desc: 'Side-by-side clinical tariffs & suitability',
      icon: Scale,
      color: 'from-blue-500/20 to-indigo-500/10 text-blue-300 border-blue-500/30',
      action: () => router.push('/compare'),
    },
    {
      title: 'Affordable Care',
      desc: 'Ayushman PM-JAY & budget package filters',
      icon: DollarSign,
      color: 'from-amber-500/20 to-yellow-500/10 text-amber-300 border-amber-500/30',
      action: () => router.push('/search?q=Ayushman+Bharat+cashless+hospitals+under+2+lakh'),
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (dashQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(dashQuery.trim())}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header AI Healthcare Command Center Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Search & Greeting Area */}
        <div className="lg:col-span-8 rounded-3xl glass-card border border-cyan-500/30 p-6 sm:p-8 space-y-5 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider relative z-10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>AI Healthcare Command Center</span>
          </div>

          <div className="space-y-1 relative z-10">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {getGreeting()}, <span className="text-gradient-cyan">{userProfile.fullName || 'User'}</span>
            </h1>
            <p className="text-base sm:text-lg font-semibold text-slate-300">
              How can we help you today?
            </p>
          </div>

          {/* Main AI Search input */}
          <form onSubmit={handleSearch} className="pt-2 flex items-center gap-2 relative z-10">
            <div className="flex-1 flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-navy-950/95 border border-cyan-500/35 shadow-2xl shadow-cyan-950/40 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />
              <input
                type="text"
                value={dashQuery}
                onChange={(e) => setDashQuery(e.target.value)}
                placeholder="Describe healthcare need in your own words (e.g., Kidney treatment in Chandigarh under ₹2L)..."
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-6 sm:px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 text-slate-950 font-black text-xs sm:text-sm hover:opacity-95 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all shrink-0 hover:scale-[1.02]"
            >
              AI Discover
            </button>
          </form>

          {/* Master Hackathon & Quick Prompts */}
          <div className="space-y-2 pt-1 relative z-10">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Click to test live AI extraction scenarios:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: '🎯 Master Demo: Kidney Chandigarh < ₹2L', query: 'Find kidney treatment hospitals near Chandigarh under ₹2 lakh' },
                { label: '🚨 Emergency: Father Angioplasty (Jalandhar)', query: 'Emergency cardiology hospital within 10 km in Jalandhar for father angioplasty' },
                { label: '🩺 Knee Replacement (Mohali)', query: 'Orthopedic joint replacement hospitals in Mohali' },
                { label: '🛡️ PM-JAY Dialysis Support', query: 'Ayushman Bharat cashless dialysis centers' },
              ].map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setDashQuery(p.query);
                    router.push(`/search?q=${encodeURIComponent(p.query)}`);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-navy-900/90 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700/60 hover:border-cyan-500/40 text-[11px] font-medium transition-all hover:scale-[1.02]"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Member Digital Pass & Status */}
        <div className="lg:col-span-4 rounded-3xl bg-gradient-to-br from-navy-900 via-navy-950 to-slate-900 border border-cyan-500/30 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5" />
                NEURALCARE Digital Pass
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div>
              <div className="text-xs text-slate-400">Authenticated Member ID</div>
              <div className="text-xl font-mono font-black text-cyan-300 mt-0.5 tracking-wider">
                {memberId}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-slate-400 text-[10px]">Active Region</div>
                <div className="font-bold text-white truncate">{selectedCity}, {selectedState}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">Registry Tier</div>
                <div className="font-bold text-emerald-300">Level 1 (Verified)</div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2 relative z-10">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Zero private health data stored on public servers</span>
          </div>
        </div>

      </div>

      {/* 2. Animated Metrics Cards (Using actual data) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl glass-card border border-cyan-500/20 hover:border-cyan-500/40 space-y-1.5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hospitals Indexed</span>
            <Building2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {totalHospitals}
          </div>
          <div className="text-[10px] text-cyan-400 font-semibold">Verified Database Records</div>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-blue-500/20 hover:border-blue-500/40 space-y-1.5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nearby Facilities</span>
            <MapPin className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {nearbyHospitals}
          </div>
          <div className="text-[10px] text-blue-400 font-semibold">In {selectedCity} & Region</div>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-rose-500/20 hover:border-rose-500/40 space-y-1.5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Emergency Units</span>
            <PhoneCall className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono text-rose-300">
            {emergencyFacilities}
          </div>
          <div className="text-[10px] text-rose-400 font-semibold">24x7 Critical Care Active</div>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-violet-500/20 hover:border-violet-500/40 space-y-1.5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Specialist Services</span>
            <Stethoscope className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono text-violet-300">
            {totalProcedures}+
          </div>
          <div className="text-[10px] text-violet-400 font-semibold">{totalDepartments} Medical Departments</div>
        </div>

      </div>

      {/* 3. Quick Actions Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-lg text-white">AI Command Quick Actions</h3>
          <span className="text-xs text-slate-400">Select any action to begin</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((qa, idx) => {
            const Icon = qa.icon;
            return (
              <button
                key={idx}
                onClick={qa.action}
                className={`p-5 rounded-3xl bg-gradient-to-br ${qa.color} border glass-card text-left space-y-2.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-2xl bg-navy-950/80 border border-slate-700/60">
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white group-hover:text-cyan-300 transition-colors">
                    {qa.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    {qa.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Activity, Search History & Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Search History */}
        <div className="lg:col-span-2 rounded-3xl glass-card border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-base text-white">Recent Healthcare Inquiries</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Persisted</span>
          </div>

          <div className="space-y-2.5">
            {searchHistory.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No search sessions recorded yet. Start by asking an AI query above!
              </div>
            ) : (
              searchHistory.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="space-y-0.5 max-w-lg">
                    <div className="text-xs font-bold text-white truncate">{item.query}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>{item.timestamp}</span>
                      <span>•</span>
                      <span className="text-cyan-400 font-medium">{item.resultsCount} facilities matched</span>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/search?q=${encodeURIComponent(item.query)}`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 text-slate-200 hover:text-navy-950 text-xs font-bold transition-all shrink-0"
                  >
                    Re-run
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Settings & Shortlist counter */}
        <div className="rounded-3xl glass-card border border-slate-800 p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Settings className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-base text-white">User Controls</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold">Active Region</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-400 text-xs font-semibold"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st.code} value={st.name}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                href="/saved"
                className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1 hover:border-emerald-500/40 transition-colors"
              >
                <div className="text-lg font-black text-emerald-300">{savedHospitalIds.length}</div>
                <div className="text-[10px] text-slate-400 font-semibold">Saved Hospitals</div>
              </Link>

              <Link
                href="/compare"
                className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-center space-y-1 hover:border-cyan-500/40 transition-colors"
              >
                <div className="text-lg font-black text-cyan-300">{compareHospitalIds.length}</div>
                <div className="text-[10px] text-slate-400 font-semibold">In Comparison</div>
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
