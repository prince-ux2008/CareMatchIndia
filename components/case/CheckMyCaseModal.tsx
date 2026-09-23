'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Building2, 
  Activity, 
  HelpCircle,
  FileImage,
  RefreshCw,
  Stethoscope
} from 'lucide-react';
import { HospitalRecord, VisualCaseAnalysis } from '@/lib/types';
import { analyzeVisualCase } from '@/lib/nlp/visualCase';
import { useApp } from '@/lib/context/AppContext';

interface CheckMyCaseModalProps {
  hospital?: HospitalRecord;
  isOpen: boolean;
  onClose: () => void;
  onApplyCategory?: (specialty: string, careCategory: string) => void;
}

export function CheckMyCaseModal({ hospital, isOpen, onClose, onApplyCategory }: CheckMyCaseModalProps) {
  const router = useRouter();
  const { selectedCity, selectedState } = useApp();
  
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<{ name: string; size: number; previewUrl?: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VisualCaseAnalysis | null>(null);

  if (!isOpen) return null;

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
      const res = analyzeVisualCase(description, imageFile, hospital);
      setAnalysisResult(res);
      setIsAnalyzing(false);
    }, 450);
  };

  const handleFindHospitals = () => {
    if (!analysisResult) return;
    const query = `${analysisResult.specialtySuggested} hospitals in ${hospital?.city || selectedCity || 'Jalandhar'}`;
    onClose();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-navy-950 border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-navy-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-cyan-300 border border-cyan-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">Check My Case — Visual Care Assist</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
                  Non-Diagnostic
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {hospital ? `Checking capability match against ${hospital.name}` : 'Identify relevant care category and matching hospital capabilities'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Medical Safety Disclaimer Alert Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">Responsible Healthcare AI Notice: </span>
              CareMatch India assists in categorizing healthcare requirements and matching verified hospital departments. It does <strong>not</strong> provide medical diagnosis, disease detection, or treatment prescriptions. Always seek direct medical evaluation.
            </div>
          </div>

          {!analysisResult ? (
            <form onSubmit={handleRunAnalysis} className="space-y-4">
              
              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Upload Photo, Prescription or Scan (Optional):
                </label>
                
                <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-2xl p-6 text-center transition-colors bg-slate-900/40">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  
                  {imageFile?.previewUrl ? (
                    <div className="flex items-center justify-center gap-4">
                      <img
                        src={imageFile.previewUrl}
                        alt="Uploaded preview"
                        className="w-16 h-16 object-cover rounded-xl border border-cyan-500/40"
                      />
                      <div className="text-left">
                        <div className="text-xs font-bold text-white truncate max-w-xs">{imageFile.name}</div>
                        <div className="text-[11px] text-slate-400">{(imageFile.size / 1024).toFixed(1)} KB • Image Loaded</div>
                        <span className="text-[10px] text-cyan-400 font-semibold">Click to change photo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-2xl bg-slate-800 text-cyan-400 mx-auto flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-semibold text-slate-200">
                        Drag & drop or click to upload photo / prescription
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Supported formats: JPG, PNG, WEBP, PDF (Max 10MB)
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Text Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Describe the concern or symptoms:
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Red itchy rash on forearm for 4 days, or father has severe knee stiffness when climbing stairs..."
                  rows={3}
                  className="w-full rounded-2xl bg-slate-900 border border-slate-700 focus:border-cyan-500 px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Sample Quick Presets */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-400">Quick Test Samples:</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setDescription('Red itchy skin rash on arm with mild swelling for 3 days')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  >
                    🔍 Skin Rash (Dermatology)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDescription('Severe knee pain and difficulty bending joint after sports injury')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  >
                    🦵 Knee Pain (Orthopedics)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDescription('Blurry vision and cataract cloudiness in right eye for 6 months')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  >
                    👁️ Blurry Vision (Eye Care)
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isAnalyzing || (!description.trim() && !imageFile)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 text-slate-950 font-black text-xs sm:text-sm hover:opacity-95 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing Case & Matching Capabilities...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Analyze Care Category & Capability Match</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          ) : (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Output Result Card */}
              <div className="p-5 rounded-2xl bg-navy-900/90 border border-cyan-500/30 space-y-4">
                
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                      Interpreted Care Category
                    </span>
                    <h4 className="text-base font-extrabold text-white">
                      {analysisResult.caseCategory}
                    </h4>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    Suggested Specialty: {analysisResult.specialtySuggested}
                  </span>
                </div>

                {/* Specific Hospital Compatibility if applicable */}
                {analysisResult.hospitalCompatibility && (
                  <div className={`p-4 rounded-xl border ${
                    analysisResult.hospitalCompatibility.hasRelevantDepartment 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' 
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-xs">
                      {analysisResult.hospitalCompatibility.hasRelevantDepartment ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Hospital Capability Verified</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          <span>Care Gap Alert</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs mt-1 text-slate-300 leading-relaxed">
                      {analysisResult.hospitalCompatibility.summary}
                    </p>
                  </div>
                )}

                {/* Suggested Questions for Doctor */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Recommended Questions for the Specialist:</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-400 pl-4 list-disc">
                    {analysisResult.suggestedQuestions.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                  {analysisResult.extractedTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAnalysisResult(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                >
                  ← Test Another Case
                </button>

                <button
                  type="button"
                  onClick={handleFindHospitals}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
                >
                  <span>Explore Matching {analysisResult.specialtySuggested} Hospitals</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
