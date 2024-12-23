// src/store/useLeadCreationStore.js
import { create } from 'zustand';
import axios from '@/lib/axios';
import { env } from '@/config/env';

const useLeadCreationStore = create((set, get) => ({
  // Control del estado del formulario
  currentStep: 1,
  isLoading: false,
  error: null,
  createdBusinessId: null,

  // Datos del formulario Business
  businessData: {
    name: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    city: '',
    description: '',
    state: '',
    postalCode: '',
    country: 'USA'  // Default value
  },

  // Datos del formulario Contact
  contactData: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    source: '',
    dndSettings: {
      Call: { status: false },
      Email: { status: false },
      SMS: { status: false },
      WhatsApp: { status: false },
      GMB: { status: false },
      FB: { status: false }
    }
  },

  // Acciones para actualizar datos
  setBusinessData: (data) => set((state) => ({
    businessData: { ...state.businessData, ...data }
  })),

  setContactData: (data) => set((state) => ({
    contactData: { ...state.contactData, ...data }
  })),

  setStep: (step) => set({ currentStep: step }),

  // Auto-rellenar datos del contacto desde business
  prefillContactData: () => {
    const { businessData } = get();
    set((state) => ({
      contactData: {
        ...state.contactData,
        email: businessData.email,
        phone: businessData.phone,
        address: businessData.address,
        city: businessData.city,
        state: businessData.state,
        postalCode: businessData.postalCode,
        country: businessData.country
      }
    }));
  },

  // Crear Business
  createBusiness: async (userId) => {
    const { businessData } = get();
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(env.endpoints.business.create, {
        ...businessData,
        createdBy: userId
      });

      set({ 
        createdBusinessId: response.data._id,
        isLoading: false,
        currentStep: 2
      });

      // Pre-llenar datos del contacto después de crear business
      get().prefillContactData();
      
      return response.data;
    } catch (error) {
      console.error('Error creating business:', error);
      set({ 
        error: error.response?.data?.message || 'Error creating business',
        isLoading: false 
      });
      throw error;
    }
  },

  // Crear Contact/Lead
  createContact: async (userId, userName) => {
    const { contactData, createdBusinessId, businessData } = get();
    set({ isLoading: true, error: null });

    try {
      const leadData = {
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        name: `${contactData.firstName} ${contactData.lastName}`,
        email: contactData.email,
        phone: contactData.phone,
        address1: contactData.address,
        city: contactData.city,
        state: contactData.state,
        postalCode: contactData.postalCode,
        country: contactData.country,
        source: contactData.source || 'direct',
        dndSettings: {
          Call: { status: contactData.dndSettings.Call.status ? "true" : "false" },
          Email: { status: contactData.dndSettings.Email.status ? "true" : "false" },
          SMS: { status: contactData.dndSettings.SMS.status ? "true" : "false" },
          WhatsApp: { status: contactData.dndSettings.WhatsApp.status ? "true" : "false" },
          GMB: { status: contactData.dndSettings.GMB.status ? "true" : "false" },
          FB: { status: contactData.dndSettings.FB.status ? "true" : "false" }
        },
        status: "new",
        seller: userId,
        user: {
          _id: userId,
          name: userName
        },
        business: {
          _id: createdBusinessId,
          name: businessData.name
        },
        assignedTo: userId,
        companyName: businessData.name,
        notes: [],
        opportunities: []
      };

      const response = await axios.post(env.endpoints.leads.create, leadData);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      console.error('Error creating contact:', error);
      set({ 
        error: error.response?.data?.message || 'Error creating contact',
        isLoading: false 
      });
      throw error;
    }
  },

  // Reset del store
  reset: () => set({
    currentStep: 1,
    isLoading: false,
    error: null,
    createdBusinessId: null,
    businessData: {
      name: '',
      phone: '',
      email: '',
      website: '',
      address: '',
      city: '',
      description: '',
      state: '',
      postalCode: '',
      country: 'USA'
    },
    contactData: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'USA',
      source: '',
      dndSettings: {
        Call: { status: false },
        Email: { status: false },
        SMS: { status: false },
        WhatsApp: { status: false },
        GMB: { status: false },
        FB: { status: false }
      }
    }
  })
}));

export default useLeadCreationStore;