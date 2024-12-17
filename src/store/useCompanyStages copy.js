// src/store/useCompanyStages.js
import { create } from 'zustand';

const useCompanyStages = create((set) => ({
  stages: [],
  setStages: (stages) => set({ 
    stages: stages.filter(stage => stage.show).sort((a, b) => a.order - b.order) 
  }),
  resetStages: () => set({ stages: [] }),
}));

export default useCompanyStages;