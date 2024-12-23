// src/store/useDeleteBusinessStore.js
import { create } from 'zustand';
import axios from '@/lib/axios';
import { env } from '@/config/env';

const useDeleteBusinessStore = create((set, get) => ({
  // Estado
  isOpen: false,
  isLoading: false,
  error: null,
  business: null,
  associatedContacts: [],

  // Acciones básicas del dialog
  openDialog: (business, contacts) => set({
    isOpen: true,
    business,
    associatedContacts: contacts,
    error: null
  }),
  
  closeDialog: () => set({
    isOpen: false,
    business: null,
    associatedContacts: [],
    error: null,
    isLoading: false  // Asegurar reset del estado loading
  })
,

  // Proceso de eliminación
  deleteBusiness: async () => {
    set({ isLoading: true, error: null });
    const { business, associatedContacts } = get();

    try {
      // 1. Primero eliminamos todos los contactos asociados
      for (const contact of associatedContacts) {
        await axios.delete(env.endpoints.leads.delete(contact._id));
      }

      // 2. Luego eliminamos el business
      await axios.delete(env.endpoints.business.delete(business._id));

      set({ isLoading: false, isOpen: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error deleting business and contacts',
        isLoading: false
      });
      throw error;
    }
  }
}));

export default useDeleteBusinessStore;