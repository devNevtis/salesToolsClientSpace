// src/store/useCompanyStages.js
import { create } from 'zustand';

const useCompanyStages = create((set, get) => ({
  stages: [],
  // Guarda todos los stages sin filtrar
  setStages: (stages) => set({ 
    stages: stages.sort((a, b) => a.order - b.order) 
  }),
  // Método para obtener solo los stages activos (para el funnel)
  getActiveStages: () => {
    return get().stages.filter(stage => stage.show).sort((a, b) => a.order - b.order);
  },
  resetStages: () => set({ stages: [] }),
}));

export default useCompanyStages;