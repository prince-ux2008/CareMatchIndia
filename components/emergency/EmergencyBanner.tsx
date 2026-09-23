'use client';

import React from 'react';
import { AlertOctagon, PhoneCall, ShieldAlert, X } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';

interface EmergencyBannerProps {
  onDismiss?: () => void;
}

export function EmergencyBanner({ onDismiss }: EmergencyBannerProps) {
  const { t } = useApp();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950 via-red-900 to-rose-950 border-2 border-red-500/80 p-4 sm:p-5 shadow-2xl shadow-red-950/60 animate-in fade-in zoom-in-95 duration-300">
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/40 animate-pulse">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-white tracking-wide">
                {t.emergencyAlertTitle}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white uppercase tracking-wider">
                Immediate Action Required
              </span>
            </div>
            <p className="text-xs sm:text-sm text-red-200 mt-1 max-w-2xl leading-relaxed">
              {t.emergencyAlertDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <a
            href="tel:108"
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-red-700 font-bold text-xs sm:text-sm hover:bg-red-50 transition-all shadow-md active:scale-95"
          >
            <PhoneCall className="w-4 h-4 text-red-600 animate-bounce" />
            <span>{t.emergencyAmbulanceBtn}</span>
          </a>

          <a
            href="tel:112"
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-800 text-white font-bold text-xs sm:text-sm hover:bg-red-700 transition-all border border-red-400/30 active:scale-95"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{t.emergencyNationalBtn}</span>
          </a>

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-2 text-red-300 hover:text-white rounded-lg hover:bg-red-800/40 transition-colors"
              title="Close Emergency Warning"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
