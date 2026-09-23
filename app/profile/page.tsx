'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  ShieldCheck, 
  Bookmark, 
  Search, 
  LogOut, 
  Edit3, 
  Check, 
  Copy, 
  Building2, 
  AlertCircle, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { SupportedLanguage } from '@/lib/i18n/translations';

export default function ProfilePage() {
  const router = useRouter();
  const { 
    userProfile, 
    updateProfile, 
    memberId, 
    language, 
    setLanguage, 
    savedHospitalIds, 
    searchHistory 
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form State
  const [fullName, setFullName] = useState(userProfile.fullName);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone || '+91-98765-43210');
  const [state, setState] = useState(userProfile.state);
  const [district, setDistrict] = useState(userProfile.district);
  const [city, setCity] = useState(userProfile.city);
  const [pincode, setPincode] = useState(userProfile.pincode || '144001');

  const handleCopyMemberId = () => {
    navigator.clipboard.writeText(memberId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      email,
      phone,
      state,
      district,
      city,
      pincode,
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to sign out?')) {
      router.push('/login');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-cyan-400" />
            Citizen Healthcare Profile
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your location preferences, regional healthcare identifier, and saved consultations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Member Identifier Card */}
        <div className="space-y-6">
          
          {/* Member ID Digital Pass */}
          <div className="rounded-3xl p-6 glass-card border border-cyan-500/30 bg-gradient-to-b from-cyan-950/40 to-navy-900/90 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    CM
                  </div>
                  <span className="font-extrabold text-sm text-white tracking-wide">CAREMATCH INDIA</span>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Active
                </span>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Application Member ID</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xl font-black text-cyan-300 tracking-wider">
                    {memberId}
                  </span>
                  <button
                    onClick={handleCopyMemberId}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Copy Member ID"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Name:</span>
                  <strong className="text-slate-200">{userProfile.fullName}</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Region:</span>
                  <strong className="text-slate-200">{userProfile.city}, {userProfile.state}</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Language:</span>
                  <strong className="text-slate-200 uppercase">{language}</strong>
                </div>
              </div>

              {/* Responsible Disclaimer */}
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400 flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  This identifier is an application-specific account code for discovery & comparison preferences. It is <strong>NOT</strong> an Aadhaar number, government identity, or diagnostic record.
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Widget */}
          <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Activity Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-center">
              <Link href="/saved" className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 transition-colors">
                <div className="text-xl font-black text-cyan-400">{savedHospitalIds.length}</div>
                <div className="text-[11px] text-slate-400">Saved Facilities</div>
              </Link>
              <div className="p-3 rounded-xl bg-slate-900">
                <div className="text-xl font-black text-emerald-400">{searchHistory.length}</div>
                <div className="text-[11px] text-slate-400">Recent Searches</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right: Profile Details & Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-6">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              Personal & Healthcare Location Settings
            </h3>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Preferred Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="en">English</option>
                      <option value="hi">हिन्दी (Hindi)</option>
                      <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">State / UT</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">District</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">City / Town</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Pincode (Optional)</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-slate-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" /> Full Name
                  </div>
                  <div className="font-bold text-white text-sm">{userProfile.fullName}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email Address
                  </div>
                  <div className="font-bold text-white text-sm">{userProfile.email}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-slate-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-cyan-400" /> Contact Phone
                  </div>
                  <div className="font-bold text-white text-sm">{userProfile.phone || '+91-98765-43210'}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-slate-400 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" /> Preferred Interface Language
                  </div>
                  <div className="font-bold text-white text-sm">
                    {language === 'en' ? 'English' : language === 'hi' ? 'हिन्दी (Hindi)' : 'ਪੰਜਾਬੀ (Punjabi)'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 sm:col-span-2">
                  <div className="text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Default Search Location
                  </div>
                  <div className="font-bold text-white text-sm">
                    {userProfile.city}, {userProfile.district}, {userProfile.state} {userProfile.pincode && `— ${userProfile.pincode}`}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Navigate to Saved Shortlist */}
          <div className="p-6 rounded-3xl glass-card border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300">
                <Bookmark className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Ready for Family Consultation?</h4>
                <p className="text-xs text-slate-400">You have {savedHospitalIds.length} shortlisted hospitals ready for side-by-side comparison</p>
              </div>
            </div>

            <Link
              href="/saved"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>View Saved Shortlist</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
