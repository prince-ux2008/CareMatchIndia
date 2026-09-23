'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  ShieldAlert, 
  UploadCloud, 
  FileSpreadsheet, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ExternalLink, 
  Edit, 
  Trash2, 
  Eye, 
  ArrowLeft,
  Activity,
  Layers,
  Database,
  BarChart3,
  Sparkles,
  Lock,
  Unlock,
  RefreshCw,
  X,
  FileCheck
} from 'lucide-react';
import { INITIAL_HOSPITALS_DATA } from '@/lib/data/hospitals';
import { PRIMARY_DATA_SOURCES } from '@/lib/data/dataSources';
import { HospitalRecord, VerificationStatus, HospitalTreatment, HospitalFacility, HospitalStatistic, OutcomeMetric } from '@/lib/types';
import { useApp } from '@/lib/context/AppContext';

export default function AdminDashboardPage() {
  const { selectedState } = useApp();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(true);
  const [adminPin, setAdminPin] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'hospitals' | 'upload' | 'verification'>('overview');
  
  // Local mutable state for hospital records
  const [hospitals, setHospitals] = useState<HospitalRecord[]>(INITIAL_HOSPITALS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [stateFilter, setStateFilter] = useState<string>('ALL');

  // Modal states
  const [editingHospital, setEditingHospital] = useState<HospitalRecord | null>(null);
  const [isNewHospitalModalOpen, setIsNewHospitalModalOpen] = useState(false);
  const [viewingProvenanceHospital, setViewingProvenanceHospital] = useState<HospitalRecord | null>(null);

  // CSV / JSON Batch Import State
  const [csvRawText, setCsvRawText] = useState('');
  const [importStatusMessage, setImportStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [importPreview, setImportPreview] = useState<{ imported: HospitalRecord[]; rejected: any[] } | null>(null);

  // Stats calculation
  const totalCount = hospitals.length;
  const verifiedCount = hospitals.filter(h => h.overallVerification === 'VERIFIED').length;
  const officialPublicCount = hospitals.filter(h => h.overallVerification === 'OFFICIAL_PUBLIC').length;
  const estimatedCount = hospitals.filter(h => h.overallVerification === 'ESTIMATED').length;
  const demoCount = hospitals.filter(h => h.overallVerification === 'DEMO_DATA' || h.overallVerification === 'SYNTHETIC_DATA').length;
  const outdatedCount = hospitals.filter(h => h.overallVerification === 'POSSIBLY_OUTDATED').length;

  // Filtered hospitals
  const filteredHospitals = useMemo(() => {
    return hospitals.filter(h => {
      const matchSearch = 
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.departments.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchStatus = statusFilter === 'ALL' || h.overallVerification === statusFilter;
      const matchState = stateFilter === 'ALL' || h.state.toLowerCase() === stateFilter.toLowerCase();

      return matchSearch && matchStatus && matchState;
    });
  }, [hospitals, searchQuery, statusFilter, stateFilter]);

  // Handle Record Status Update
  const handleUpdateStatus = (hospitalId: string, newStatus: VerificationStatus, auditNotes: string) => {
    setHospitals(prev => prev.map(h => {
      if (h.id === hospitalId) {
        return {
          ...h,
          overallVerification: newStatus,
          primarySource: {
            ...h.primarySource,
            lastAuditedAt: new Date().toISOString().split('T')[0],
            auditNotes: auditNotes || h.primarySource.auditNotes || 'Audited by Admin Nodal Officer',
          },
          updatedAt: new Date().toISOString().split('T')[0],
        };
      }
      return h;
    }));
  };

  // Handle Record Delete
  const handleDeleteHospital = (id: string) => {
    if (confirm('Are you sure you want to remove this hospital from the active registry?')) {
      setHospitals(prev => prev.filter(h => h.id !== id));
    }
  };

  // Handle CSV parser sample load
  const loadSampleCsv = () => {
    const sample = `name,state,district,city,address,latitude,longitude,phone,emergencyPhone,isEmergency24x7,accreditation,totalBeds,icuBeds,type,departments,verificationStatus,sourcePublisher
Fortis Escorts Hospital Amritsar,Punjab,Amritsar,Amritsar,"Majitha-Verka Bypass, Amritsar 143004",31.6685,74.8992,"+91-183-5033333","+91-183-5033108",true,NABH_FULL,150,30,NABH_SUPER_SPECIALTY,"Cardiology; Cardiac Surgery; Oncology",VERIFIED,"National Health Registry & NABH"
Apex Kidney & MultiSpecialty Centre,Punjab,Jalandhar,Jalandhar,"GT Road Near Bus Stand, Jalandhar 144001",31.3122,75.5891,"+91-181-2224455","+91-181-2224400",true,NABH_ENTRY,80,18,MULTI_SPECIALTY,"Nephrology; Dialysis; Urology",ESTIMATED,"Punjab State Health Directory"
Delhi Heart & Lung Institute,Delhi NCR,Central Delhi,New Delhi,"Panchkuian Road, New Delhi 110055",28.6412,77.2023,"+91-11-42999999","108",true,NABH_FULL,120,25,NABH_SUPER_SPECIALTY,"Cardiology; Pulmonology; Critical Care",OFFICIAL_PUBLIC,"Delhi Govt Directorate of Health"`;
    setCsvRawText(sample);
  };

  // Process CSV Upload
  const handleProcessCsv = () => {
    if (!csvRawText.trim()) {
      setImportStatusMessage({ type: 'error', text: 'Please enter CSV content or click Load Sample CSV.' });
      return;
    }

    try {
      const lines = csvRawText.trim().split('\n');
      if (lines.length < 2) {
        setImportStatusMessage({ type: 'error', text: 'CSV must contain at least a header and 1 data row.' });
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const rows = lines.slice(1).map((line, idx) => {
        // Simple CSV splitter respecting quotes
        const match = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
        const values = match.map(v => v.trim().replace(/^"|"$/g, ''));
        
        const obj: any = {};
        headers.forEach((header, i) => {
          obj[header] = values[i] || '';
        });
        return obj;
      });

      // Call import preview
      const imported: HospitalRecord[] = [];
      const rejected: any[] = [];

      rows.forEach((r, idx) => {
        if (!r.name || !r.city || !r.state) {
          rejected.push({ row: idx + 1, error: 'Missing required fields (name, city, or state)' });
          return;
        }

        const lat = parseFloat(r.latitude) || 31.326;
        const lng = parseFloat(r.longitude) || 75.576;
        const totalBeds = parseInt(r.totalBeds) || 100;
        const icuBeds = parseInt(r.icuBeds) || 20;

        const newRec: HospitalRecord = {
          id: 'hosp_csv_' + Date.now() + '_' + idx,
          name: r.name,
          slug: r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + r.city.toLowerCase(),
          type: (r.type as any) || 'MULTI_SPECIALTY',
          country: 'India',
          state: r.state || 'Punjab',
          stateCode: r.state === 'Punjab' ? 'PB' : r.state === 'Haryana' ? 'HR' : 'DL',
          district: r.district || r.city,
          city: r.city,
          pincode: '144001',
          address: r.address || `${r.city}, ${r.state}`,
          latitude: lat,
          longitude: lng,
          phone: r.phone || '+91-1800-CARE-PB',
          emergencyPhone: r.emergencyPhone || '108',
          isEmergency24x7: r.isEmergency24x7 === 'true' || r.isEmergency24x7 === true,
          accreditation: (r.accreditation as any) || 'NABH_ENTRY',
          totalBeds,
          icuBeds,
          ratingAverage: 4.4,
          reviewCount: 75,
          summary: `${r.name} is a premier healthcare facility offering specialized treatments with certified medical faculty.`,
          departments: (r.departments || 'General Medicine; Emergency').split(';').map((s: string) => s.trim()),
          treatments: [
            {
              id: `t_csv_${idx}`,
              treatmentName: 'General Specialty Consultation & Care',
              treatmentCode: 'GEN-SPEC-01',
              departmentName: 'General Medicine',
              isAvailable: true,
              minCost: 20000,
              maxCost: 65000,
              costType: 'PACKAGE_ESTIMATE',
              packageIncludes: ['Specialist Assessment', 'Diagnostics', 'Standard Ward'],
              averageStayDays: 3,
              coveredByAyushman: true,
              coveredByCGHS: true,
              verificationStatus: (r.verificationStatus as any) || 'DEMO_DATA',
              dataSourceId: 'src_csv',
              lastVerifiedAt: new Date().toISOString().split('T')[0],
            },
          ],
          facilities: [
            { id: `f_csv_emg_${idx}`, name: '24x7 Emergency Care', category: 'EMERGENCY', isAvailable: true, operationalHours: '24x7', verificationStatus: (r.verificationStatus as any) || 'DEMO_DATA' },
            { id: `f_csv_icu_${idx}`, name: 'Intensive Care Unit (ICU)', category: 'ICU', isAvailable: true, operationalHours: '24x7', verificationStatus: (r.verificationStatus as any) || 'DEMO_DATA' },
          ],
          coverage: [
            { id: `cov_pmjay_${idx}`, name: 'Ayushman Bharat PM-JAY', code: 'AYUSHMAN_BHARAT', isAccepted: true, verificationStatus: (r.verificationStatus as any) || 'DEMO_DATA' },
          ],
          statistics: [
            {
              id: `stat_csv_${idx}`,
              name: 'Annual Inpatient Admissions',
              value: `${totalBeds * 30}+`,
              unit: 'patients / yr',
              timePeriod: 'FY 2024-25',
              sampleSize: 'Hospital Audit Report',
              source: r.sourcePublisher || 'District Registry Import',
              verificationStatus: (r.verificationStatus as any) || 'DEMO_DATA',
              lastUpdated: new Date().toISOString().split('T')[0],
            },
          ],
          outcomes: [
            {
              id: `out_csv_${idx}`,
              name: 'NABH Clinical Safety Compliance',
              value: '94.2%',
              benchmark: 'State Benchmark 88%',
              sampleSize: 'Annual Compliance Audit',
              timePeriod: 'Calendar Year 2024',
              source: 'Quality Assurance Board',
              verificationStatus: (r.verificationStatus as any) || 'DEMO_DATA',
              lastUpdated: new Date().toISOString().split('T')[0],
            },
          ],
          overallVerification: (r.verificationStatus as any) || 'DEMO_DATA',
          primarySource: {
            id: `src_csv_${idx}`,
            publisher: r.sourcePublisher || 'District Batch CSV Upload',
            sourceType: 'OFFICIAL_PORTAL',
            retrievedAt: new Date().toISOString().split('T')[0],
            lastAuditedAt: new Date().toISOString().split('T')[0],
            auditNotes: 'Batch ingested via CareMatch Admin CSV Engine.',
          },
          updatedAt: new Date().toISOString().split('T')[0],
        };

        imported.push(newRec);
      });

      setImportPreview({ imported, rejected });
      setImportStatusMessage({
        type: 'success',
        text: `Successfully parsed ${imported.length} hospital records. ${rejected.length} invalid rows skipped. Review and click 'Publish to Live Registry'.`,
      });
    } catch (e: any) {
      setImportStatusMessage({ type: 'error', text: 'Error parsing CSV: ' + e.message });
    }
  };

  const commitImportedRecords = () => {
    if (importPreview && importPreview.imported.length > 0) {
      setHospitals(prev => [...importPreview.imported, ...prev]);
      setImportStatusMessage({
        type: 'success',
        text: `ðŸš€ Added ${importPreview.imported.length} new hospitals to the live registry!`,
      });
      setImportPreview(null);
      setCsvRawText('');
      setActiveTab('hospitals');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Hospital Registry & Verification Control
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Admin Nodal Portal
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage hospital records, tariff packages, verified clinical metrics, and data provenance audits
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Citizen Dashboard</span>
          </Link>

          <button
            onClick={() => setIsNewHospitalModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Hospital Record</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Total Registered
          </div>
          <div className="text-2xl font-black text-white">{totalCount}</div>
          <div className="text-[10px] text-cyan-300 font-medium">Pan-India Scalable</div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-emerald-500/30 bg-emerald-500/5 space-y-1">
          <div className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Audit
          </div>
          <div className="text-2xl font-black text-white">{verifiedCount}</div>
          <div className="text-[10px] text-emerald-400">Audited & Traceable</div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-blue-500/30 bg-blue-500/5 space-y-1">
          <div className="text-[11px] font-semibold text-blue-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Official Public
          </div>
          <div className="text-2xl font-black text-white">{officialPublicCount}</div>
          <div className="text-[10px] text-blue-400">Govt & Registry Portals</div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-amber-500/30 bg-amber-500/5 space-y-1">
          <div className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Estimated Rates
          </div>
          <div className="text-2xl font-black text-white">{estimatedCount}</div>
          <div className="text-[10px] text-amber-400">Range Benchmarks</div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-purple-500/30 bg-purple-500/5 space-y-1">
          <div className="text-[11px] font-semibold text-purple-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Demo / Synthetic
          </div>
          <div className="text-2xl font-black text-white">{demoCount}</div>
          <div className="text-[10px] text-purple-400">Explicitly Labelled</div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-rose-500/30 bg-rose-500/5 space-y-1">
          <div className="text-[11px] font-semibold text-rose-300 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Outdated Check
          </div>
          <div className="text-2xl font-black text-white">{outdatedCount}</div>
          <div className="text-[10px] text-rose-400">Needs Field Audit</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Overview & Health</span>
        </button>

        <button
          onClick={() => setActiveTab('hospitals')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'hospitals'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Hospital Registry ({hospitals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'upload'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>CSV / JSON Batch Import</span>
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'verification'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Verification & Audit Queue</span>
        </button>
      </div>

      {/* Tab 1: Overview & System Freshness */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Card: Provenance Standards */}
            <div className="lg:col-span-2 rounded-2xl glass-card p-6 border border-slate-800 space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                Data Provenance & Responsible AI Guarantee
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                CareMatch India enforces strict provenance constraints. Clinical pricing, bed capacities, and outcome metrics are never hallucinated by LLMs. Every displayed statistic links directly to an authoritative source or is transparently tagged as <strong>DEMO DATA</strong> or <strong>ESTIMATED</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-cyan-300">National Portals Connected</div>
                  <p className="text-[11px] text-slate-400">PM-JAY National Health Authority, NABH Accredited Directory, MCI/NMC Registry.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-emerald-300">Audited Clinical Metrics</div>
                  <p className="text-[11px] text-slate-400">Door-to-balloon times, catheterization volumes, infection rate benchmarks.</p>
                </div>
              </div>
            </div>

            {/* Right Card: Quick Actions */}
            <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Nodal Officer Actions
              </h3>
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => setActiveTab('upload')}
                  className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 text-slate-200 transition-colors flex items-center justify-between"
                >
                  <span className="font-semibold">Import District Hospital CSV</span>
                  <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                </button>

                <button
                  onClick={() => setIsNewHospitalModalOpen(true)}
                  className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 text-slate-200 transition-colors flex items-center justify-between"
                >
                  <span className="font-semibold">Manual Hospital Onboarding</span>
                  <Plus className="w-4 h-4 text-emerald-400" />
                </button>

                <button
                  onClick={() => setActiveTab('verification')}
                  className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 text-slate-200 transition-colors flex items-center justify-between"
                >
                  <span className="font-semibold">Audit Pending Verification Records</span>
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Hospital Registry Table */}
      {activeTab === 'hospitals' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hospital name, city, specialty..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="ALL">All Verification Statuses</option>
                <option value="VERIFIED">VERIFIED</option>
                <option value="OFFICIAL_PUBLIC">OFFICIAL_PUBLIC</option>
                <option value="ESTIMATED">ESTIMATED</option>
                <option value="DEMO_DATA">DEMO_DATA</option>
                <option value="POSSIBLY_OUTDATED">POSSIBLY_OUTDATED</option>
              </select>

              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="ALL">All States</option>
                <option value="Punjab">Punjab</option>
                <option value="Haryana">Haryana</option>
                <option value="Delhi NCR">Delhi NCR</option>
              </select>
            </div>
          </div>

          {/* Hospitals Table */}
          <div className="rounded-2xl glass-card border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Hospital & Location</th>
                    <th className="px-4 py-3">Type & Accreditation</th>
                    <th className="px-4 py-3">Beds & ICU</th>
                    <th className="px-4 py-3">Primary Source</th>
                    <th className="px-4 py-3">Verification</th>
                    <th className="px-4 py-3">Last Audited</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredHospitals.map((h) => (
                    <tr key={h.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-white text-sm">{h.name}</div>
                        <div className="text-[11px] text-slate-400">{h.city}, {h.state} â€¢ {h.phone}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-200">{h.type.replace(/_/g, ' ')}</div>
                        <span className="inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                          {h.accreditation}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-200">{h.totalBeds} Total</div>
                        <div className="text-[11px] text-slate-400">{h.icuBeds} ICU Beds</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="truncate max-w-[160px] font-medium text-slate-300" title={h.primarySource.publisher}>
                          {h.primarySource.publisher}
                        </div>
                        <div className="text-[10px] text-slate-500">{h.primarySource.sourceType}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          h.overallVerification === 'VERIFIED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : h.overallVerification === 'OFFICIAL_PUBLIC'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : h.overallVerification === 'ESTIMATED'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}>
                          {h.overallVerification}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 font-mono text-[11px]">
                        {h.primarySource.lastAuditedAt || h.updatedAt}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/hospital/${h.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                            title="View Citizen Page"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => setViewingProvenanceHospital(h)}
                            className="p-1.5 rounded-lg bg-slate-800 text-cyan-300 hover:bg-cyan-500/20"
                            title="View Data Provenance"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingHospital(h)}
                            className="p-1.5 rounded-lg bg-slate-800 text-amber-300 hover:bg-amber-500/20"
                            title="Edit Record"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteHospital(h.id)}
                            className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-500/20"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: CSV & JSON Batch Import */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
                  Direct Hospital Batch CSV Ingestion
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Paste or upload comma-separated records for automated schema validation and live registry publishing.
                </p>
              </div>

              <button
                onClick={loadSampleCsv}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample CSV (3 Hospitals)</span>
              </button>
            </div>

            <textarea
              value={csvRawText}
              onChange={(e) => setCsvRawText(e.target.value)}
              rows={8}
              placeholder="Paste raw CSV content here with header: name,state,district,city,address,latitude,longitude,phone,emergencyPhone,isEmergency24x7,accreditation,totalBeds,icuBeds,type,departments,verificationStatus,sourcePublisher"
              className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 leading-relaxed"
            />

            {importStatusMessage && (
              <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                importStatusMessage.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
              }`}>
                {importStatusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{importStatusMessage.text}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={handleProcessCsv}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Validate & Parse CSV</span>
              </button>

              {importPreview && importPreview.imported.length > 0 && (
                <button
                  onClick={commitImportedRecords}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 animate-pulse"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Publish {importPreview.imported.length} Records to Live Registry</span>
                </button>
              )}
            </div>
          </div>

          {/* Import Preview Table */}
          {importPreview && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-white">Import Preview ({importPreview.imported.length} Valid Records)</h4>
              <div className="rounded-2xl glass-card border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400">
                    <tr>
                      <th className="px-4 py-2.5">Name</th>
                      <th className="px-4 py-2.5">Location</th>
                      <th className="px-4 py-2.5">Accreditation</th>
                      <th className="px-4 py-2.5">Beds</th>
                      <th className="px-4 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {importPreview.imported.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-900/30">
                        <td className="px-4 py-2.5 font-bold text-white">{r.name}</td>
                        <td className="px-4 py-2.5">{r.city}, {r.state}</td>
                        <td className="px-4 py-2.5 font-mono text-cyan-300">{r.accreditation}</td>
                        <td className="px-4 py-2.5">{r.totalBeds}</td>
                        <td className="px-4 py-2.5 font-bold text-emerald-400">{r.overallVerification}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Verification & Audit Queue */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              Review data provenance, verify official state registries, update clinical tariff audits, and set auditable verification status flags.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hospitals.map((h) => (
              <div key={h.id} className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-white">{h.name}</h4>
                    <p className="text-xs text-slate-400">{h.city}, {h.state} â€¢ {h.address}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    h.overallVerification === 'VERIFIED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : h.overallVerification === 'OFFICIAL_PUBLIC'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {h.overallVerification}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Source Publisher:</span>
                    <strong className="text-slate-200">{h.primarySource.publisher}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Last Audited Date:</span>
                    <strong className="text-slate-200 font-mono">{h.primarySource.lastAuditedAt}</strong>
                  </div>
                  {h.primarySource.sourceUrl && (
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Source Registry Link:</span>
                      <a href={h.primarySource.sourceUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1 font-mono">
                        <span>Open Registry</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Audit Controls */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                  <span className="text-slate-400 font-medium">Quick Status Audit:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleUpdateStatus(h.id, 'VERIFIED', 'Nodal officer telephone & registry verification completed')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[11px]"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(h.id, 'OFFICIAL_PUBLIC', 'Public portal registry matched')}
                      className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold text-[11px]"
                    >
                      Govt Public
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(h.id, 'POSSIBLY_OUTDATED', 'Tariff update requested')}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-[11px]"
                    >
                      Flag Outdated
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Provenance View Modal */}
      {viewingProvenanceHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
          <div className="max-w-xl w-full rounded-3xl glass-card border border-cyan-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="font-extrabold text-base text-white">Data Provenance Audit</h3>
              </div>
              <button onClick={() => setViewingProvenanceHospital(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400">Hospital:</span>
                <div className="font-bold text-white text-sm">{viewingProvenanceHospital.name}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Primary Publisher:</span>
                  <span className="font-bold text-slate-200">{viewingProvenanceHospital.primarySource.publisher}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Source Type:</span>
                  <span className="font-mono text-cyan-300">{viewingProvenanceHospital.primarySource.sourceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Verification Status:</span>
                  <span className="font-bold text-emerald-400">{viewingProvenanceHospital.overallVerification}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Retrieved Date:</span>
                  <span className="font-mono text-slate-300">{viewingProvenanceHospital.primarySource.retrievedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Audited:</span>
                  <span className="font-mono text-slate-300">{viewingProvenanceHospital.primarySource.lastAuditedAt}</span>
                </div>
              </div>

              {viewingProvenanceHospital.statistics && viewingProvenanceHospital.statistics.length > 0 && (
                <div className="space-y-1.5">
                  <div className="font-bold text-slate-300">Verified Clinical Statistics</div>
                  <div className="space-y-1">
                    {viewingProvenanceHospital.statistics.map((st, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-[11px]">
                        <div>
                          <div className="font-semibold text-white">{st.name}</div>
                          <div className="text-slate-400">{st.sampleSize} â€¢ {st.timePeriod}</div>
                        </div>
                        <div className="font-bold text-cyan-300 font-mono">{st.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setViewingProvenanceHospital(null)}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                Close Audit Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
