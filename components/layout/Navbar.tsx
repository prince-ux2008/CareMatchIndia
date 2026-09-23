'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Scale, 
  Bookmark, 
  LayoutDashboard, 
  Globe, 
  ShieldCheck, 
  HeartHandshake,
  ChevronDown, 
  Shield,
  Sparkles
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { SupportedLanguage } from '@/lib/i18n/translations';

export function Navbar() {
  const pathname = usePathname();
  const { 
    language, 
    setLanguage, 
    t, 
    memberId, 
    savedHospitalIds, 
    compareHospitalIds 
  } = useApp();

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navLinks = [
    { href: '/search', label: t.navSearch, icon: Search },
    { 
      href: '/compare', 
      label: t.navCompare, 
      icon: Scale, 
      badge: compareHospitalIds.length > 0 ? compareHospitalIds.length : null 
    },
    { 
      href: '/saved', 
      label: t.navSaved, 
      icon: Bookmark, 
      badge: savedHospitalIds.length > 0 ? savedHospitalIds.length : null 
    },
    { href: '/dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { href: '/admin', label: 'Admin', icon: Shield },
  ];

  const languageLabels: Record<SupportedLanguage, string> = {
    en: 'English',
    hi: 'हिन्दी',
    pa: 'ਪੰਜਾਬੀ',
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/15 bg-navy-950/85 backdrop-blur-xl shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-violet-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                <HeartHandshake className="w-5 h-5 text-cyan-400 group-hover:rotate-6 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-white font-sans">
                  CAREMATCH <span className="text-cyan-400">INDIA</span>
                </span>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                  AI Studio
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Verified Multi-Specialty Hospital Matching
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 shadow-sm shadow-cyan-500/10 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
                {link.badge !== null && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-cyan-500 text-navy-950">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Tools: Language Switcher, Profile & Member Tag */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-navy-800/90 hover:bg-navy-700 border border-cyan-500/20 text-slate-200 transition-colors shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{languageLabels[language]}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-navy-900 border border-cyan-500/25 shadow-2xl p-1.5 z-50 animate-in fade-in">
                {(['en', 'hi', 'pa'] as SupportedLanguage[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      language === lang
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{languageLabels[lang]}</span>
                    {language === lang && <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile & Member ID chip */}
          <Link
            href="/profile"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:bg-cyan-500/20 transition-colors"
            title="View Profile & Member Pass"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{memberId}</span>
          </Link>
        </div>

      </div>

      {/* Mobile Submenu */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800 py-2 bg-navy-900/90 px-2 text-xs">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-md ${
                isActive ? 'text-cyan-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
