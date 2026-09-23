'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  BrainCircuit, 
  ArrowRight,
  ShieldCheck,
  Activity,
  Compass
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const { userProfile, updateProfile } = useApp();
  
  // Only 3 core fields: Name, Email, Phone Number
  const [fullName, setFullName] = useState(userProfile?.fullName || 'Gurpreet Singh');
  const [email, setEmail] = useState(userProfile?.email || 'gurpreet.singh@example.com');
  const [phone, setPhone] = useState(userProfile?.phone || '+91-98765-43210');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Please fill in Name, Email and Phone Number.');
      return;
    }

    updateProfile({
      fullName,
      email,
      phone,
    });

    setIsSubmitted(true);

    setTimeout(() => {
      router.push('/search');
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[75vh]">
        
        {/* LEFT COLUMN: Brand Presentation */}
        <div className="lg:col-span-6 space-y-6 lg:pr-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>AI Healthcare Discovery Platform</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              CAREMATCH <span className="text-gradient-cyan">INDIA</span>
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-slate-200">
              “Intelligent Healthcare. Simplified.”
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Experience natural-language hospital discovery. Find verified multi-specialty hospitals, compare package costs, and discover the best medical facilities matching your requirements.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl glass-card border border-cyan-500/20 space-y-1">
              <div className="flex items-center gap-2 font-bold text-white text-xs">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                <span>AI Clinical Intent Engine</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Matches hospitals based on your exact disease, symptoms, and surgical requirements.
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-emerald-500/20 space-y-1">
              <div className="flex items-center gap-2 font-bold text-white text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Registries</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Hospital data locked to verified NABH and public health registries.
              </p>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Secure session • Instant access to hospital matching</span>
          </div>

        </div>

        {/* RIGHT COLUMN: Clean Login Form */}
        <div className="lg:col-span-6">
          <div className="rounded-3xl glass-card border border-cyan-500/30 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="text-center space-y-1.5 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-violet-500 p-0.5 mx-auto shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
                  <BrainCircuit className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Enter Healthcare AI
              </h2>
              <p className="text-xs text-slate-400">
                Enter your details to start hospital search & matching
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 relative z-10 animate-in fade-in">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base">Welcome, {fullName}!</h3>
                <p className="text-xs text-emerald-300">
                  Opening Healthcare Discovery Studio...
                </p>
              </div>
            ) : (
              <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs relative z-10">
                
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                    {errorMessage}
                  </div>
                )}

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" /> 
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 text-sm font-medium transition-colors"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" /> 
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 text-sm font-medium transition-colors"
                    placeholder="name@example.com"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-cyan-400" /> 
                    <span>Phone Number *</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 text-sm font-medium transition-colors"
                    placeholder="+91-98765-43210"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 hover:opacity-95 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Enter Healthcare AI</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
