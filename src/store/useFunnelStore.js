// src/store/useFunnelStore.js
import { create } from 'zustand';
import axios from '@/lib/axios';
import { env } from '@/config/env';

const useFunnelStore = create((set, get) => ({
  // Estado inicial
  leadStatuses: {
    new: 0,
    qualified: 0,
    discussion: 0,
    negotiation: 0,
    won: 0,
    lost: 0,
  },
  opportunityStages: {},
  stages: [],
  contacts: {},
  isLoading: false,
  error: null,

  // Inicializar datos con los leads ya filtrados de useLeadsStore
  initializeWithLeads: (leads) => {
    console.log('FunnelStore - Initialize with leads:', leads);
    if (!leads || !Array.isArray(leads)) {
      console.error('Invalid leads data provided');
      return;
    }
  
    try {
      const contacts = get().contacts;
      console.log('FunnelStore - Current contacts:', contacts);
  
      const statusCounts = {
        new: 0,
        qualified: 0,
        discussion: 0,
        negotiation: 0,
        won: 0,
        lost: 0,
      };
  
      leads.forEach(business => {
        // Los contacts ahora están indexados por el business._id
        const businessContacts = contacts[business._id];
        console.log(`Processing business ${business.name}:`, businessContacts);
  
        if (businessContacts && businessContacts.length > 0) {
          // Usar el primer contacto ya que todos tienen el mismo status
          const status = businessContacts[0].status?.toLowerCase();
          if (statusCounts.hasOwnProperty(status)) {
            statusCounts[status]++;
          }
        }
      });
  
      console.log('FunnelStore - Final status counts:', statusCounts);
      set({ leadStatuses: statusCounts });
  
    } catch (error) {
      console.error('Error processing leads:', error);
      set({ error: error.message });
    }
  },

  // Obtener configuración de stages
  fetchConfig: async () => {
    set({ isLoading: true });
    try {
      console.log('FunnelStore - Fetching config...');
      // Corregir la ruta
      const response = await axios.get(`${env.apiUrl}/dialtools/configuration/all`);
      console.log('FunnelStore - Config response:', response.data);
      const stages = response.data[0]?.stages || [];
      console.log('FunnelStore - Processed stages:', stages);
      
      set({ 
        stages,
        isLoading: false 
      });
  
      return stages;
    } catch (error) {
      console.error('Error fetching config:', error);
      set({ 
        error: error.message,
        isLoading: false 
      });
      return [];
    }
  },

  // Procesar oportunidades usando los leads ya filtrados
  processOpportunities: (leads, stages) => {
    console.log('FunnelStore - Processing opportunities with:', { leads, stages });
    if (!leads || !stages) return;
  
    try {
      const contacts = get().contacts;
      
      // Initialize stage values
      const stageValues = {};
      stages.forEach(stage => {
        if (stage.show) {
          stageValues[stage.name] = 0;
        }
      });
  
      // Process each business's contacts
      leads.forEach(business => {
        const businessContacts = contacts[business._id];
        console.log(`Processing business ${business.name}:`, {
          contacts: businessContacts,
          opportunities: businessContacts?.map(c => c.opportunities)
        });
  
        if (businessContacts) {
          businessContacts.forEach(contact => {
            contact.opportunities?.forEach(opportunity => {
              console.log('Found opportunity:', {
                stage: opportunity.stage,
                value: opportunity.value,
                contact: contact.name
              });
              
              if (stageValues.hasOwnProperty(opportunity.stage)) {
                stageValues[opportunity.stage] += opportunity.value;
              }
            });
          });
        }
      });
  
      console.log('FunnelStore - Final opportunity values:', stageValues);
      const hasData = Object.values(stageValues).some(value => value > 0);
      
      set({ opportunityStages: hasData ? stageValues : null });
    } catch (error) {
      console.error('Error processing opportunities:', error);
      set({ error: error.message });
    }
  },

  // Función para sincronizar contacts desde useLeadsStore
  setContacts: (contacts) => {
    set({ contacts });
  },

  // Resetear datos
  resetFunnelData: () => {
    set({
      leadStatuses: null,
      opportunityStages: null,
      stages: [],
      contacts: {},
      error: null
    });
  }
}));

export default useFunnelStore;