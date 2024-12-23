// src/store/useQuickEditStore.js
import { create } from 'zustand';
import axios from '@/lib/axios';
import { env } from '@/config/env';

const useQuickEditStore = create((set, get) => ({
  // Estado del dialog y datos
  isOpen: false,
  isLoading: false,
  error: null,
  businessData: null,

  // Acciones básicas del dialog
  openDialog: (business) => set({
    isOpen: true,
    businessData: business,
    error: null
  }),
  
  closeDialog: () => set({
    isOpen: false,
    businessData: null,
    error: null,
    isLoading: false  // Asegurar reset del estado loading
  }),

  // Actualizar datos locales
  setBusinessData: (data) => set((state) => ({
    businessData: {
      ...state.businessData,
      ...data
    }
  })),

  // Guardar cambios
  saveChanges: async () => {
    const { businessData } = get();
    const updatedFields = {
      name: businessData.name,
      phone: businessData.phone,
      email: businessData.email,
      address: businessData.address,
      city: businessData.city,
      state: businessData.state
    };

    set({ isLoading: true, error: null });

    try {
      const response = await axios.put(
        env.endpoints.business.update(businessData._id),
        updatedFields
      );

      set({
        isLoading: false,
        isOpen: false,
        businessData: null
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error updating business',
        isLoading: false
      });
      throw error;
    }
  }
}));

export default useQuickEditStore;