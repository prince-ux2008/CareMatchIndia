'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  Building2, 
  CheckCircle2, 
  HelpCircle,
  FileImage,
  RefreshCw,
  Stethoscope,
  Activity,
  Layers,
  BrainCircuit
} from 'lucide-react';
import { analyzeVisualCase } from '@/lib/nlp/visualCase';
import { VisualCaseAnalysis } from '@/lib/types';
import { useApp } from '@/lib/context/AppContext';

export default function CheckMyCasePage() {
  const router = useRouter();
  const { selectedCity, selectedState } = useApp();

  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<{ name: string; size: number; previewUrl?: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VisualCaseAnalysis | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile({
        name: file.name,
        size: file.size,
        previewUrl: URL.createObjectURL(file),
      });
    }
  };

  const handleRunAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() && !imageFile) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const res = analyzeVisualCase(description, imageFile);
      setAnalysisResult(res);
      setIsAnalyzing(false);
    }, 450);
  };

  const handleFindHospitals = () => {
    if (!analysisResult) return;
    const query = `${analysisResult.specialtySuggested} hospitals in ${selectedCity || 'Jalandhar'}`;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
          <Camera className="w-4 h-4 text-cyan-400" />
          <span>CareMatch Visual Care Assist</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Check My Case 📷
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto">
          Upload an image, prescription, or describe your healthcare concern to identify the relevant care category and verified hospital capabilities across India.
        </p>
      </div>

      {/* Medical Safety Disclaimer Alert Banner */}
      <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5 text-xs text-amber-200 shadow-xl">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold text-amber-300">Responsible AI Healthcare Notice: </span>
          CareMatch India helps you navigate hospital departments and care categories. It does <strong>not</strong> make medical diagnoses, disease claims, or drug prescriptions. For life-threatening emergencies, please call <strong>108</strong> immediately.
        </div>
      </div>

      {/* Main Studio Card */}
      <div className="rounded-3xl glass-card border border-cyan-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {!analysisResult ? (
          <form onSubmit={handleRunAnalysis} className="space-y-6">
            
            {/* Upload Box */}
            <div>
              <label className="block text-xs font-extrabold text-slate-200 mb-2">
                1. Upload Photo, Scan or Prescription (Optional):
              </label>
              
              <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-3xl p-8 text-center transition-colors bg-navy-950/60">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                
                {imageFile?.previewUrl ? (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <img
                      src={imageFile.previewUrl}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-2xl border-2 border-cyan-500/50 shadow-md"
                    />
                    <div className="text-center sm:text-left">
                      <div className="text-sm font-bold text-white truncate max-w-xs">{imageFile.name}</div>
                      <div className="text-xs text-slate-400">{(imageFile.size / 1024).toFixed(1)} KB • Image Attached</div>
                      <span className="text-xs text-cyan-400 font-bold hover:underline">Click or drop new file to replace</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 mx-auto flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-white">
                      Drop your photo, MRI/CT scan report, or prescription here
                    </div>
                    <div className="text-xs text-slate-400">
                      Supports JPG, PNG, WEBP, DICOM preview (Max 10MB)
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description Box */}
            <div>
              <label className="block text-xs font-extrabold text-slate-200 mb-2">
                2. Describe your symptoms or medical concern:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Red skin rash with itching for 4 days on arm, or mother has knee pain when walking and needs replacement evaluation..."
                rows={4}
                className="w-full rounded-2xl bg-navy-950 border border-slate-700 focus:border-cyan-500 px-4 py-3.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Quick Test Chips */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400">Sample Clinical Tests:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setDescription('Red itchy skin rash on forearm with mild irritation for 3 days')}
                  className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800"
                >
                  🔍 Skin Condition (Dermatology)
                </button>
                <button
                  type="button"
                  onClick={() => setDescription('Severe knee stiffness, pain when climbing stairs for 6 months')}
                  className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800"
                >
                  🦵 Knee Joint Issue (Orthopedics)
                </button>
                <button
                  type="button"
                  onClick={() => setDescription('Blurry vision, difficulty seeing in dim light for 4 months')}
                  className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800"
                >
                  👁️ Vision Clouding (Ophthalmology)
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAnalyzing || (!description.trim() && !imageFile)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 text-slate-950 font-black text-sm hover:opacity-95 shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Structuring Care Requirement & Checking Capabilities...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze Case & Match Hospital Capabilities</span>
                </>
              )}
            </button>

          </form>
        ) : (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Output Interpretation Box */}
            <div className="p-6 rounded-3xl bg-navy-950 border border-cyan-500/40 space-y-5">
              
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    Identified Care Category
                  </span>
                  <h3 className="text-xl font-black text-white">
                    {analysisResult.caseCategory}
                  </h3>
                </div>

                <span className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
                  Specialty: {analysisResult.specialtySuggested}
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  <span>Key Questions for Your Medical Consultation:</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-400 pl-4 list-disc">
                  {analysisResult.suggestedQuestions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-800">
                {analysisResult.extractedTags.map((t, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold">
                    #{t}
                  </span>
                ))}
              </div>

            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setAnalysisResult(null)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
              >
                ← Check Another Case
              </button>

              <button
                type="button"
                onClick={handleFindHospitals}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <span>Find Verified {analysisResult.specialtySuggested} Hospitals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
