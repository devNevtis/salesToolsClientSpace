// store/useLeadsStore.js
import { create } from 'zustand';
import axios from 'axios';

const useLeadsStore = create((set, get) => ({
    leads: [],
    isLoading: false,
    isTransitioning: false, // Nuevo estado para transiciones suaves

    setTransitioning: (status) => set({ isTransitioning: status }),

    fetchLeads: async () => {
        try {
            set({ isLoading: true, isTransitioning: true });
            const response = await axios.get("https://api.nevtis.com/dialtools/leads/allLeads");
            // Pequeño delay para suavizar la transición
            await new Promise(resolve => setTimeout(resolve, 100));
            set({ leads: response.data, isLoading: false, isTransitioning: false });
            return response.data;
        } catch (error) {
            set({ error: error.message, isLoading: false, isTransitioning: false });
            return [];
        }
    },

    // Actualización optimista para crear
    createLead: async (leadData) => {
        const newLead = { ...leadData, _id: Date.now() }; // ID temporal
        
        // Actualización optimista
        set(state => ({
            leads: [...state.leads, newLead],
            isTransitioning: true
        }));

        try {
            const response = await axios.post("https://api.nevtis.com/dialtools/leads/create", leadData);
            set(state => ({
                leads: state.leads.map(lead => 
                    lead._id === newLead._id ? response.data : lead
                ),
                isTransitioning: false
            }));
            return { success: true, data: response.data };
        } catch (error) {
            // Revertir en caso de error
            set(state => ({
                leads: state.leads.filter(lead => lead._id !== newLead._id),
                isTransitioning: false
            }));
            return { success: false, error: error.message };
        }
    },

    // Actualización optimista para update
    updateLead: async (leadData) => {
        // Guardar estado anterior y actualizar optimistamente
        const previousLeads = get().leads;
        set(state => ({
            leads: state.leads.map(lead => 
                lead._id === leadData._id ? leadData : lead
            ),
            isTransitioning: true
        }));

        try {
            const response = await axios.put(
                `https://api.nevtis.com/dialtools/leads/update/${leadData._id}`,
                leadData
            );
            set({ isTransitioning: false });
            return { success: true, data: response.data };
        } catch (error) {
            // Revertir en caso de error
            set({ leads: previousLeads, isTransitioning: false });
            return { success: false, error: error.message };
        }
    },

    // Actualización optimista para delete
    deleteLead: async (id) => {
        const previousLeads = get().leads;
        
        set(state => ({
            leads: state.leads.filter(lead => lead._id !== id),
            isTransitioning: true
        }));

        try {
            await axios.delete(`https://api.nevtis.com/dialtools/leads/delete/${id}`);
            set({ isTransitioning: false });
            return { success: true };
        } catch (error) {
            set({ leads: previousLeads, isTransitioning: false });
            return { success: false, error: error.message };
        }
    }
}));

export default useLeadsStore;