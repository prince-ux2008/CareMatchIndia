'use client';

import React from 'react';
import Link from 'next/link';
import { HeartHandshake, ShieldCheck, PhoneCall, Info, MapPin } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';

export function Footer() {
  const { t } = useApp();

  return (
    <footer className="border-t border-slate-800/80 bg-navy-950/90 text-slate-400 text-xs py-12 mt-20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Platform Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 via-blue-500 to-violet-500 p-0.5">
                <div className="w-full h-full bg-navy-950 rounded-[6px] flex items-center justify-center">
                  <HeartHandshake className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-black text-base text-white tracking-tight">
                CAREMATCH <span className="text-cyan-400">INDIA</span>
              </span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed max-w-md">
              AI-Powered Healthcare Discovery, Hospital Matching & Comparison Platform. Powering natural-language search, disease-specific condition suitability, and verified public registries.
            </p>
            <div className="flex items-center gap-2 text-cyan-400 text-[11px] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verifiable Public Registry Data • Zero Hallucinated Medical Claims</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              AI Platform
            </h4>
            <ul className="space-y-1.5">
              <li><Link href="/search" className="hover:text-cyan-300 transition-colors">AI Search Studio</Link></li>
              <li><Link href="/case" className="hover:text-cyan-300 transition-colors">Check My Case 📷</Link></li>
              <li><Link href="/compare" className="hover:text-cyan-300 transition-colors">Hospital Comparator</Link></li>
              <li><Link href="/saved" className="hover:text-cyan-300 transition-colors">Shortlisted Facilities</Link></li>
              <li><Link href="/dashboard" className="hover:text-cyan-300 transition-colors">Command Center</Link></li>
              <li><Link href="/admin" className="hover:text-cyan-300 transition-colors">Admin Registry</Link></li>
            </ul>
          </div>

          {/* Emergency & Helplines */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Emergency Helplines (India)
            </h4>
            <ul className="space-y-1.5 font-mono text-[11px]">
              <li className="flex items-center gap-1.5 text-rose-400 font-bold">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Ambulance: 108</span>
              </li>
              <li className="flex items-center gap-1.5 text-amber-300">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>National Emergency: 112</span>
              </li>
              <li className="flex items-center gap-1.5 text-cyan-300">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Ayushman Bharat PM-JAY: 14555</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Medical Discovery Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-navy-900/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Medical & Safety Notice:</strong> CareMatch India is an AI-powered healthcare discovery and facility capability matching platform designed for informational reference and decision support. It does not provide medical diagnoses, clinical treatment prescriptions, or doctor consultations. Always consult qualified medical practitioners for healthcare decisions.
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} CAREMATCH INDIA. “Find hospitals that match your healthcare needs.”
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-medium">National Healthcare Discovery Grid</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
