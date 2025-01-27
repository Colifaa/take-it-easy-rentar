'use client';

import { create } from 'zustand';

type LanguageStore = {
  language: 'en' | 'es';
  setLanguage: (language: 'en' | 'es') => void;
};

export const useLanguage = create<LanguageStore>((set) => ({
  language: 'en',
  setLanguage: (language) => set({ language }),
}));