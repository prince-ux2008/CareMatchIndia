'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Sparkles, 
  HeartHandshake, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Activity, 
  Layers,
  Heart,
  Eye,
  Bone,
  BrainCircuit,
  Stethoscope,
  Compass,
  Camera,
  MessageSquare,
  Building2
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';

export function HeroSection() {
  const router = useRouter();
  const { t, selectedCity } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const quickPrompts = [
    {
      label: 'Heart Angioplasty (₹2L Budget)',
      icon: Heart,
      query: 'Coronary angioplasty PTCA stent under 2 lakh budget',
    },
    {
      label: 'Kidney Stone Laser (RIRS)',
      icon: Activity,
      query: 'Kidney stone laser removal surgery RIRS PCNL PM-JAY',
    },
    {
      label: 'Knee Joint Replacement',
      icon: Bone,
      query: 'Total knee replacement surgery under 2 lakh',
    },
    {
      label: 'Oncology & Chemotherapy',
      icon: Sparkles,
      query: 'Cancer chemotherapy infusion daycare oncology',
    },
    {
      label: 'Cataract Phaco Eye Care',
      icon: Eye,
      query: 'Cataract phacoemulsification eye surgery',
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/search');
    }
  };

  const handleQuickClick = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <div className="relative pt-8 pb-14 overflow-hidden">
        
        {/* Background ambient glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-cyan-500/15 via-blue-500/10 to-violet-500/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10 px-4">
          
          {/* Brand Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-extrabold backdrop-blur-md">
            <BrainCircuit className="w-4 h-4 text-cyan-400" />
            <span>CAREMATCH INDIA • National Healthcare Discovery Platform</span>
          </div>

          {/* Hero Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
            CARE THAT MATCHES <br />
            <span className="text-gradient-cyan">YOUR NEED</span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Find, understand and compare healthcare options across India using intelligent requirement matching and verified hospital information.
          </p>

          {/* 3 Primary Hero Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            
            {/* Action 1: Find a Hospital */}
            <Link
              href="/search"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 text-slate-950 font-black text-xs sm:text-sm hover:opacity-95 shadow-xl shadow-cyan-500/25 flex items-center gap-2 active:scale-95 transition-all"
            >
              <Building2 className="w-4 h-4" />
              <span>Find a Hospital</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Action 2: Explore Pan-India Map */}
            <Link
              href="/search?view=map"
              className="px-6 py-3.5 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 border border-cyan-500/40 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/10 flex items-center gap-2 active:scale-95 transition-all"
            >
              <MapPin className="w-4 h-4 text-cyan-300" />
              <span>Explore Live Map 🗺️</span>
            </Link>

            {/* Action 3: Chat with CareMatch AI */}
            <Link
              href="/search"
              className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-extrabold text-xs sm:text-sm flex items-center gap-2 active:scale-95 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Chat with CareMatch AI</span>
            </Link>

          </div>

          {/* Natural Language Search Box */}
          <div className="pt-4 max-w-3xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="p-2 sm:p-2.5 rounded-2xl glass-panel-glow border border-cyan-500/40 shadow-2xl flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex-1 flex items-center gap-3 px-3.5 py-2 w-full">
                <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type any disease, condition, doctor specialty, or city (e.g. Angioplasty in Delhi under ₹2L)..."
                  className="w-full bg-transparent text-white text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all shrink-0"
              >
                <span>AI Search & Match</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Search Chips */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold mr-1">Sample Queries:</span>
              {quickPrompts.map((qp, i) => {
                const Icon = qp.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleQuickClick(qp.query)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/30 transition-all flex items-center gap-1.5"
                  >
                    <Icon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{qp.label}</span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Trust Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-300 border-t border-slate-800/80 mt-8">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>PM-JAY & NABH Verified Facilities</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Explainable Capability Match</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-violet-400" />
              <span>Zero Medical Hallucination</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

