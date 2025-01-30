import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LanguageStore = {
  language: 'en' | 'es';
  setLanguage: (language: 'en' | 'es') => void;
};

export const useLanguage = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'language-storage',
    }
  )
);
