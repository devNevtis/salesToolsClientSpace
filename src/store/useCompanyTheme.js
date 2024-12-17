// src/store/useCompanyTheme.js
import { create } from 'zustand';

const useCompanyTheme = create((set) => ({
  theme: {
    base1: '',
    base2: '',
    highlighting: '',
    callToAction: '',
    logo: '',
  },
  setTheme: (themeData) => set({ theme: themeData }),
  resetTheme: () => set({
    theme: {
      base1: '',
      base2: '',
      highlighting: '',
      callToAction: '',
      logo: '',
    }
  }),
}));

export default useCompanyTheme;