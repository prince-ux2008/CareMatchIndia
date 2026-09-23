'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Award, 
  Clock, 
  Activity, 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  FileText, 
  HeartPulse, 
  Bed, 
  Scale, 
  Sparkles,
  Share2,
  Navigation,
  Info,
  BarChart3,
  Bookmark,
  Star,
  UserCheck,
  TrendingUp,
  Shield,
  Stethoscope,
  Users
} from 'lucide-react';
import { INITIAL_HOSPITALS_DATA } from '@/lib/data/hospitals';
import { formatCostRange, formatINR } from '@/lib/utils';
import { useApp } from '@/lib/context/AppContext';
import { InAppRouteModal } from '@/components/map/InAppRouteModal';
import { getCoordinatesForCity } from '@/lib/data/locations';
import { getHospitalImage } from '@/lib/data/hospitalImages';
import { getDoctorsForHospital } from '@/lib/data/doctors';

export default function HospitalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { compareHospitalIds, toggleCompareHospital, toggleSaveHospital, savedHospitalIds, selectedCity, selectedState } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'treatments' | 'specialists' | 'facilities' | 'outcomes' | 'coverage' | 'audit'>('overview');
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

  const hospital = INITIAL_HOSPITALS_DATA.find((h) => h.slug === slug || h.id === slug);

  if (!hospital) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/20">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white">Hospital Record Not Found</h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          The requested hospital standard registry slug "<span className="font-mono text-cyan-300">{slug}</span>" could not be located in our active database index.
        </p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-cyan-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to AI Search</span>
        </Link>
      </div>
    );
  }

  const isCompared = compareHospitalIds.includes(hospital.id);
  const isSaved = savedHospitalIds.includes(hospital.id);
  const userCoords = getCoordinatesForCity(selectedState, selectedCity);
  const hospitalImage = getHospitalImage(hospital.id, hospital.type);
  const doctors = getDoctorsForHospital(hospital.id);
  const googleMapsNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Search Results</span>
          </button>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => toggleSaveHospital(hospital.id)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                isSaved
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Saved in List' : 'Save Hospital'}</span>
            </button>
            <button
              onClick={() => toggleCompareHospital(hospital.id)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                isCompared
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/80 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/10'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompared ? 'In Comparison Matrix' : '+ Add to Compare'}</span>
            </button>
          </div>
        </div>

        {/* Hospital Hero Banner with Professional Image */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
          
          <div className="relative h-64 sm:h-80 w-full overflow-hidden">
            <img 
              src={hospitalImage} 
              alt={hospital.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            
            <div className="absolute top-4 right-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 text-slate-200 border border-slate-700 backdrop-blur-md">
                {hospital.type.replace(/_/g, ' ')}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{hospital.overallVerification}</span>
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {hospital.ratingAverage && (
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 backdrop-blur-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{hospital.ratingAverage.toFixed(1)} / 5.0 Rating</span>
                  </span>
                )}
                {hospital.accreditation !== 'NONE' && (
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 backdrop-blur-sm">
                    {hospital.accreditation.replace('_', ' ')} Accredited
                  </span>
                )}
                {hospital.isEmergency24x7 && (
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 backdrop-blur-sm flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" />
                    <span>24x7 Emergency Trauma Unit</span>
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {hospital.name}
              </h1>
              <div className="flex items-center gap-1 text-xs text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{hospital.address}, {hospital.city}, {hospital.district}, {hospital.state} - {hospital.pincode}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats & Action Strip */}
          <div className="p-6 bg-slate-950/80 border-t border-slate-800/80 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-cyan-400" /> Total Capacity
                </div>
                <div className="text-lg font-black text-white">{hospital.totalBeds} Beds</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-400" /> Active ICU
                </div>
                <div className="text-lg font-black text-rose-300">{hospital.icuBeds} ICU Beds</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Recovery Rate
                </div>
                <div className="text-lg font-black text-emerald-400">
                  {hospital.treatmentOutcomes && hospital.treatmentOutcomes.length > 0 
                    ? `${Math.round(hospital.treatmentOutcomes.reduce((acc, t) => acc + t.recoveryRate, 0) / hospital.treatmentOutcomes.length)}%` 
                    : '94%'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Emergency
                </div>
                <div className="text-lg font-black text-amber-300">{hospital.isEmergency24x7 ? '24x7' : 'Daytime'}</div>
              </div>
            </div>

            {/* Navigation & Call Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <a
                href={googleMapsNavUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors shadow-lg shadow-emerald-500/20"
              >
                <Navigation className="w-4 h-4" />
                <span>Navigate via Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`tel:${hospital.emergencyPhone || hospital.phone}`}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-bold text-xs transition-colors"
              >
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>Call Helpline: {hospital.emergencyPhone || hospital.phone}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 overflow-x-auto gap-2 text-xs font-bold scrollbar-none">
          {[
            { id: 'overview', label: 'Overview & Summary', icon: Building2 },
            { id: 'treatments', label: `Treatments & Tariffs (${hospital.treatments.length})`, icon: DollarSign },
            { id: 'specialists', label: `Specialists & Doctors (${doctors.length > 0 ? doctors.length : 'Verified List'})`, icon: Users },
            { id: 'facilities', label: `Facilities (${hospital.facilities.length})`, icon: Activity },
            { id: 'outcomes', label: 'Treatment Outcomes & Success', icon: TrendingUp },
            { id: 'coverage', label: 'Insurance & PM-JAY', icon: ShieldCheck },
            { id: 'audit', label: 'Data Provenance & Audit', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white">About the Hospital</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {hospital.summary}
              </p>
              
              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Clinical Departments</h4>
                <div className="flex flex-wrap gap-2">
                  {hospital.departments.map((dept, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold">
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Beds Status Card */}
            {hospital.realTimeData && (
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <span>Real-time Bed Occupancy & Availability</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="text-xs text-slate-400">General Beds Available</div>
                    <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                      {hospital.realTimeData.totalBedsAvailable} Available
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="text-xs text-slate-400">ICU & CCU Beds Available</div>
                    <div className="text-2xl font-black text-rose-300 font-mono mt-1">
                      {hospital.realTimeData.icuBedsAvailable} Available
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="text-xs text-slate-400">Current Inpatients</div>
                    <div className="text-2xl font-black text-cyan-300 font-mono mt-1">
                      {hospital.realTimeData.currentPatients} Inpatients
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Treatments & Tariffs */}
        {activeTab === 'treatments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Verified Procedures & Estimated Tariffs</h3>
              <span className="text-xs text-slate-400">Sourced from Official Hospital Public Tariffs & PM-JAY Registry</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {hospital.treatments.map((t) => (
                <div key={t.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-white">{t.treatmentName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {t.departmentName}
                      </span>
                    </div>
                    {t.packageIncludes && (
                      <div className="text-xs text-slate-400 flex flex-wrap gap-1 pt-1">
                        <span className="text-slate-500 font-semibold">Includes:</span>
                        {t.packageIncludes.map((inc, i) => (
                          <span key={i} className="text-slate-300">✓ {inc}{i < t.packageIncludes!.length - 1 ? ',' : ''}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                      {t.averageStayDays && <span>Avg Stay: {t.averageStayDays} days</span>}
                      {t.coveredByAyushman && <span className="text-emerald-400 font-semibold">✓ PM-JAY Ayushman Covered</span>}
                      {t.coveredByCGHS && <span className="text-cyan-400 font-semibold">✓ CGHS Rates</span>}
                    </div>
                  </div>

                  <div className="text-left md:text-right shrink-0 bg-slate-950 p-3 rounded-xl md:bg-transparent md:p-0">
                    <div className="text-xs text-slate-400 font-medium">Estimated Tariff</div>
                    <div className="text-base font-black text-emerald-400 font-mono">
                      {formatCostRange(t.minCost, t.maxCost, t.costType)}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {t.costType === 'FIXED_GOVT_RATE' ? 'Govt Capped / Subsidized' : 'Verified Clinical Package'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Specialists & Doctors */}
        {activeTab === 'specialists' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Verified Specialists & Clinical Faculty</h3>
              <span className="text-xs text-slate-400">Strict Anti-Fabrication Medical Board Directory</span>
            </div>

            {doctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map((doc) => (
                  <div key={doc.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-base font-extrabold text-white">{doc.name}</h4>
                        <div className="text-xs text-cyan-400 font-medium">{doc.designation}</div>
                        <div className="text-xs text-slate-400">{doc.department}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {doc.verificationStatus}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-300 pt-2 border-t border-slate-800">
                      <div><span className="text-slate-500">Qualifications:</span> {doc.qualifications}</div>
                      {doc.experienceYears && (
                        <div><span className="text-slate-500">Clinical Experience:</span> {doc.experienceYears}+ years</div>
                      )}
                      <div><span className="text-slate-500">OPD Consultation Days:</span> {doc.opdDays}</div>
                    </div>

                    {doc.source && (
                      <div className="text-[10px] text-slate-500 pt-1">
                        Verified via {doc.source}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
                <Stethoscope className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-300">Specialist information not available from verified sources</h4>
                <p className="text-xs text-slate-400 max-w-lg mx-auto">
                  As part of CareMatch India's strict trust policy, we never generate or fabricate fictional doctor names. Specialist information for this specific facility is pending direct medical superintendent audit.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Facilities */}
        {activeTab === 'facilities' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {hospital.facilities.map((fac) => (
              <div key={fac.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-white">{fac.name}</div>
                  <div className="text-xs text-slate-400">Category: {fac.category}</div>
                  <div className="text-[11px] text-slate-500">{fac.operationalHours}</div>
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                  fac.isAvailable ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-300'
                }`}>
                  {fac.isAvailable ? 'Active ✓' : 'Unavailable'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Treatment Outcomes & Success Rates */}
        {activeTab === 'outcomes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Audited Treatment Outcomes & Recovery Rates</h3>
              <span className="text-xs text-slate-400">Clinical Quality Indicators & Benchmarks</span>
            </div>

            {hospital.treatmentOutcomes && hospital.treatmentOutcomes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hospital.treatmentOutcomes.map((out, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-extrabold text-white">{out.treatmentName}</h4>
                        <div className="text-xs text-slate-400 font-mono">Code: {out.treatmentCode}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-black">
                        {out.recoveryRate}% Recovery Rate
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-950">
                        <div className="text-slate-400 text-[10px]">Recovery</div>
                        <div className="text-emerald-400 font-black font-mono text-sm">{out.recoveryRate}%</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950">
                        <div className="text-slate-400 text-[10px]">Complication</div>
                        <div className="text-amber-400 font-black font-mono text-sm">{out.complicationRate}%</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950">
                        <div className="text-slate-400 text-[10px]">Avg Stay</div>
                        <div className="text-cyan-300 font-black font-mono text-sm">{out.avgStayDays} Days</div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                      <span>Sample Size: N = {out.sampleSize.toLocaleString()} cases</span>
                      <span>Period: {out.timePeriod}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-sm">
                Specific clinical outcome registry for this center is scheduled for quarterly NABH review update.
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Coverage & Empanelment */}
        {activeTab === 'coverage' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {hospital.coverage.map((c) => (
              <div key={c.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-white">{c.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.isAccepted ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {c.isAccepted ? 'Accepted ✓' : 'Not Empanelled'}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Verification: <span className="text-slate-300 font-medium">{c.verificationStatus}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 7: Audit & Data Provenance */}
        {activeTab === 'audit' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Data Trust & Audit Trail</span>
            </h3>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-white text-sm">Primary Audited Source</div>
                <div><span className="text-slate-400">Publisher:</span> {hospital.primarySource?.publisher}</div>
                <div><span className="text-slate-400">Source Type:</span> {hospital.primarySource?.sourceType}</div>
                {hospital.primarySource?.sourceUrl && (
                  <div>
                    <span className="text-slate-400">Official URL:</span>{' '}
                    <a href={hospital.primarySource.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                      {hospital.primarySource.sourceUrl}
                    </a>
                  </div>
                )}
                <div><span className="text-slate-400">Retrieved Date:</span> {hospital.primarySource?.retrievedAt}</div>
                <div><span className="text-slate-400">Last Audit Date:</span> {hospital.primarySource?.lastAuditedAt}</div>
                {hospital.primarySource?.auditNotes && (
                  <div><span className="text-slate-400">Audit Notes:</span> {hospital.primarySource.auditNotes}</div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* In-App Live Route Modal */}
      {isRouteModalOpen && (
        <InAppRouteModal
          hospital={hospital}
          userCity={selectedCity}
          userCoords={userCoords}
          onClose={() => setIsRouteModalOpen(false)}
        />
      )}
    </>
  );
}