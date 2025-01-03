// store/useOpportunitiesStore.js
import { create } from 'zustand';
import axios from 'axios';
import { env } from '@/config/env';
import { useAuth } from '@/components/AuthProvider';

const useOpportunitiesStore = create((set, get) => ({
    products: [],
    stages: [],
    isLoadingProducts: false,
    isLoadingStages: false,
    error: null,

    fetchProducts: async () => {
        const { isLoadingProducts, products } = get();
        if (isLoadingProducts || products.length > 0) return; // Ya cargado o en proceso
    
        try {
            set({ isLoadingProducts: true, error: null });
            const response = await axios.get(env.endpoints.products.getAll);
    
            const formattedProducts = response.data.map((product) => ({
                value: product.name,
                label: product.name,
                companyId: product.companyId || null,
            }));
    
            set({
                products: formattedProducts,
                isLoadingProducts: false,
            });
        } catch (error) {
            set({
                error: error.message,
                isLoadingProducts: false,
            });
        }
    },
    
    
    

    fetchStages: async () => {
        try {
            set({ isLoadingStages: true, error: null });
            const response = await axios.get(env.endpoints.config.all);

            const formattedStages = response.data[0].stages.map((stage) => ({
                value: stage.name,
                label: stage.name,
            }));

            set({
                stages: formattedStages,
                isLoadingStages: false,
            });
        } catch (error) {
            set({
                error: error.message,
                isLoadingStages: false,
            });
        }
    },
}));

export default useOpportunitiesStore;
