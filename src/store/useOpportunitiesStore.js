// store/useOpportunitiesStore.js
import { create } from 'zustand';
import axios from 'axios';

const useOpportunitiesStore = create((set, get) => ({
    products: [],
    stages: [],
    isLoadingProducts: false,
    isLoadingStages: false,
    error: null,

    fetchProducts: async () => {
        try {
            set({ isLoadingProducts: true, error: null });
            const response = await axios.get('https://api.nevtis.com/dialtools/products/getAll');
            
            const formattedProducts = response.data.map(product => ({
                value: product.name,
                label: product.name
            }));
            
            set({ 
                products: formattedProducts, 
                isLoadingProducts: false 
            });
        } catch (error) {
            set({ 
                error: error.message, 
                isLoadingProducts: false 
            });
        }
    },

    fetchStages: async () => {
        try {
            set({ isLoadingStages: true, error: null });
            const response = await axios.get('https://api.nevtis.com/dialtools/configuration/all');
            
            const formattedStages = response.data[0].stages.map(stage => ({
                value: stage.name,
                label: stage.name
            }));
            
            set({ 
                stages: formattedStages, 
                isLoadingStages: false 
            });
        } catch (error) {
            set({ 
                error: error.message, 
                isLoadingStages: false 
            });
        }
    },

    // Podemos agregar más funciones específicas para oportunidades aquí si es necesario
}));

export default useOpportunitiesStore;