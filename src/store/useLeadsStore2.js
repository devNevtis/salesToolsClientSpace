// src/store/useLeadsStore2.js
import { create } from 'zustand';
import axios from 'axios';
import { env } from '@/config/env';

const useLeadsStore = create((set, get) => ({
    leads: [],
    isLoading: false,
    isTransitioning: false,

    setTransitioning: (status) => set({ isTransitioning: status }),

    fetchLeads: async () => {
        try {
            set({ isLoading: true, isTransitioning: true });
            const response = await axios.get(env.endpoints.leads2.all);
            await new Promise(resolve => setTimeout(resolve, 100));
            set({ leads: response.data, isLoading: false, isTransitioning: false });
            return response.data;
        } catch (error) {
            set({ error: error.message, isLoading: false, isTransitioning: false });
            return [];
        }
    },

    createLead: async (leadData) => {
        const newLead = { ...leadData, _id: Date.now() };
        
        set(state => ({
            leads: [...state.leads, newLead],
            isTransitioning: true
        }));

        try {
            const response = await axios.post(env.endpoints.leads2.create, leadData);
            set(state => ({
                leads: state.leads.map(lead => 
                    lead._id === newLead._id ? response.data : lead
                ),
                isTransitioning: false
            }));
            return { success: true, data: response.data };
        } catch (error) {
            set(state => ({
                leads: state.leads.filter(lead => lead._id !== newLead._id),
                isTransitioning: false
            }));
            return { success: false, error: error.message };
        }
    },

    updateLead: async (leadData) => {
        const previousLeads = get().leads;
        set(state => ({
            leads: state.leads.map(lead => 
                lead._id === leadData._id ? leadData : lead
            ),
            isTransitioning: true
        }));

        try {
            const response = await axios.put(
                env.endpoints.leads2.update(leadData._id),
                leadData
            );
            set({ isTransitioning: false });
            return { success: true, data: response.data };
        } catch (error) {
            set({ leads: previousLeads, isTransitioning: false });
            return { success: false, error: error.message };
        }
    },

    deleteLead: async (id) => {
        const previousLeads = get().leads;
        
        set(state => ({
            leads: state.leads.filter(lead => lead._id !== id),
            isTransitioning: true
        }));

        try {
            await axios.delete(env.endpoints.leads2.delete(id));
            set({ isTransitioning: false });
            return { success: true };
        } catch (error) {
            set({ leads: previousLeads, isTransitioning: false });
            return { success: false, error: error.message };
        }
    }
}));

export default useLeadsStore;