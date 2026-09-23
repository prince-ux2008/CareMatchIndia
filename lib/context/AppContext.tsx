'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, TRANSLATIONS, TranslationDictionary } from '../i18n/translations';
import { HospitalRecord, HealthcareRequirement, UserProfile } from '../types';
import { generateMemberId } from '../utils';

interface AppContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationDictionary;
  memberId: string;
  selectedState: string;
  setSelectedState: (state: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  savedHospitalIds: string[];
  toggleSaveHospital: (id: string) => void;
  compareHospitalIds: string[];
  toggleCompareHospital: (id: string) => void;
  clearCompare: () => void;
  searchHistory: { id: string; query: string; timestamp: string; resultsCount: number }[];
  addSearchHistory: (query: string, count: number) => void;
  activeRequirement: HealthcareRequirement | null;
  setActiveRequirement: (req: HealthcareRequirement | null) => void;
  userProfile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [memberId, setMemberId] = useState<string>('CM-IN-104582');
  const [selectedState, setSelectedState] = useState<string>('All India');
  const [selectedCity, setSelectedCity] = useState<string>('All India Hubs');
  const [savedHospitalIds, setSavedHospitalIds] = useState<string[]>(['hosp_pb_jal_01', 'hosp_pb_lud_01']);
  const [compareHospitalIds, setCompareHospitalIds] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<{ id: string; query: string; timestamp: string; resultsCount: number }[]>([
    {
      id: 'h1',
      query: 'Cardiac care and angioplasty in top verified hospitals',
      timestamp: 'Today, 2:15 PM',
      resultsCount: 6,
    },
    {
      id: 'h2',
      query: 'Kidney stone laser removal and PMNDP dialysis',
      timestamp: 'Yesterday',
      resultsCount: 4,
    },
  ]);
  const [activeRequirement, setActiveRequirement] = useState<HealthcareRequirement | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user_101',
    memberId: 'CM-IN-104582',
    fullName: 'Gurpreet Singh',
    email: 'gurpreet.singh@example.com',
    preferredLanguage: 'en',
    state: 'All India',
    district: 'All Districts',
    city: 'All India Hubs',
    createdAt: '2026-01-15',
  });

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updated }));
  };

  useEffect(() => {
    const savedMid = localStorage.getItem('cm_member_id');
    if (savedMid) {
      setMemberId(savedMid);
    } else {
      const newMid = generateMemberId('IN');
      setMemberId(newMid);
      localStorage.setItem('cm_member_id', newMid);
    }

    const savedLang = localStorage.getItem('cm_lang') as SupportedLanguage;
    if (savedLang && ['en', 'hi', 'pa'].includes(savedLang)) {
      setLanguageState(savedLang);
    }

    const savedShortlist = localStorage.getItem('cm_saved_hospitals');
    if (savedShortlist) {
      try {
        setSavedHospitalIds(JSON.parse(savedShortlist));
      } catch (e) {}
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('cm_lang', lang);
  };

  const toggleSaveHospital = (id: string) => {
    setSavedHospitalIds(prev => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('cm_saved_hospitals', JSON.stringify(next));
      return next;
    });
  };

  const toggleCompareHospital = (id: string) => {
    setCompareHospitalIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      if (prev.length >= 4) {
        alert('You can compare up to 4 hospitals simultaneously.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const clearCompare = () => {
    setCompareHospitalIds([]);
  };

  const addSearchHistory = (query: string, count: number) => {
    setSearchHistory(prev => [
      {
        id: 'sh_' + Date.now(),
        query,
        timestamp: 'Just now',
        resultsCount: count,
      },
      ...prev.slice(0, 9),
    ]);
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        memberId,
        selectedState,
        setSelectedState,
        selectedCity,
        setSelectedCity,
        savedHospitalIds,
        toggleSaveHospital,
        compareHospitalIds,
        toggleCompareHospital,
        clearCompare,
        searchHistory,
        addSearchHistory,
        activeRequirement,
        setActiveRequirement,
        userProfile,
        updateProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
