// store/useBusinessStore.js
import { create } from 'zustand';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.nevtis.com',
});

// Función para obtener columnas visibles del localStorage
const getStoredColumns = () => {
    if (typeof window === 'undefined') return ['name', 'email', 'phone', 'city', 'website', 'contacts'];
    
    const stored = localStorage.getItem('visibleColumns');
    return stored ? JSON.parse(stored) : ['name', 'email', 'phone', 'city', 'website', 'contacts'];
};

const useBusinessStore = create((set, get) => ({
    // Estado original
    businesses: [],
    contacts: [],
    isLoading: false,
    isLoadingContacts: false,
    isTransitioning: false,
    currentStep: 1,
    selectedBusinesses: [],
    filteredBusinesses: [],
    error: null,
    filterValue: '',
    sortField: null,
    sortDirection: null,
    currentPage: 1,
    pageSize: 10,
    pageSizeOptions: [5, 10, 20, 50, 100],
    visibleColumns: getStoredColumns(),
/*     visibleColumns: [
        'name',
        'email',
        'phone',
        'city',
        'website'
    ], */

    // Función original createBusinessWithContact
    createBusinessWithContact: async (businessData, contactData, userData) => {
        set({ isTransitioning: true });
        try {
            // Crear Business
            const businessResponse = await axios.post(
                'https://api.nevtis.com/dialtools/business/create', 
                businessData
            );
    
            // Preparar los datos del contacto con toda la información necesaria
            const fullContactData = {
                ...contactData,
                // Información del usuario
                user: {
                    _id: userData._id,
                    name: userData.name
                },
                // Información del business
                business: {
                    _id: businessResponse.data._id,
                    name: businessResponse.data.name
                },
                // Nombre completo para el campo name
                name: `${contactData.firstName} ${contactData.lastName}`,
                // Copiar campos del business
                companyName: businessResponse.data.name,
                website: businessResponse.data.website,
                address1: businessResponse.data.address,
                city: businessResponse.data.city,
                state: businessResponse.data.state,
                postalCode: businessResponse.data.postalCode,
                country: businessResponse.data.country,
                // Usar el status proporcionado en lugar del valor por defecto
                status: contactData.status,
                // Campos adicionales
                customFields: [],
                notes: [],
                opportunities: [],
                // Si no existe timezone en businessData, usar un valor por defecto
                timezone: businessResponse.data.timezone || "America/New_York",
                assignedTo: userData._id
            };
            
            const contactResponse = await axios.post(
                'https://api.nevtis.com/dialtools/leads/create',
                fullContactData
            );
    
            // Actualizar el estado local
            set(state => ({
                businesses: [...state.businesses, businessResponse.data],
                filteredBusinesses: [...state.filteredBusinesses, businessResponse.data],
                contacts: [...state.contacts, contactResponse.data],
                isTransitioning: false
            }));
    
            return { 
                success: true, 
                business: businessResponse.data, 
                contact: contactResponse.data 
            };
        } catch (error) {
            set({ isTransitioning: false });
            return { success: false, error: error.message };
        }
    },

    // Nuevas funciones para selección
    toggleBusinessSelection: (businessId) => {
        set(state => {
            const isSelected = state.selectedBusinesses.includes(businessId);
            return {
                selectedBusinesses: isSelected
                    ? state.selectedBusinesses.filter(id => id !== businessId)
                    : [...state.selectedBusinesses, businessId]
            };
        });
    },

    toggleAllBusinessesInPage: (pageBusinessIds) => {
        set(state => {
            const allSelected = pageBusinessIds.every(id => 
                state.selectedBusinesses.includes(id)
            );

            return {
                selectedBusinesses: allSelected
                    ? state.selectedBusinesses.filter(id => !pageBusinessIds.includes(id))
                    : [...new Set([...state.selectedBusinesses, ...pageBusinessIds])]
            };
        });
    },

    clearSelection: () => {
        set({ selectedBusinesses: [] });
    },

    // Nuevas funciones para la tabla
    fetchBusinesses: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/dialtools/business/all');
            set({ 
                businesses: response.data, 
                filteredBusinesses: response.data,
                isLoading: false 
            });
        } catch (error) {
            set({ 
                isLoading: false,
                error: error.response?.data?.message || 'Failed to fetch businesses'
            });
        }
    },

    updateBusiness: async (id, data) => {
        set({ isTransitioning: true });
        try {
            const response = await api.put(`/dialtools/business/update/${id}`, data);
            
            // Actualizar el estado local después de la actualización exitosa
            set(state => {
                const updatedBusinesses = state.businesses.map(business =>
                    business._id === id ? response.data : business
                );
                return {
                    businesses: updatedBusinesses,
                    filteredBusinesses: updatedBusinesses,
                    isTransitioning: false
                };
            });
            
            return { success: true, data: response.data };
        } catch (error) {
            set({ isTransitioning: false });
            return { 
                success: false, 
                error: error.response?.data?.message || 'Failed to update business'
            };
        }
    },

    updateLocalBusiness: (updatedBusiness) => {
        set(state => ({
            businesses: state.businesses.map(business => 
                business._id === updatedBusiness._id ? updatedBusiness : business
            ),
            filteredBusinesses: state.filteredBusinesses.map(business => 
                business._id === updatedBusiness._id ? updatedBusiness : business
            )
        }));
    },

    deleteBusiness: async (id) => {
        set({ isTransitioning: true });
        try {
            await api.delete(`/dialtools/business/delete/${id}`);
            set(state => ({
                businesses: state.businesses.filter(business => business._id !== id),
                filteredBusinesses: state.filteredBusinesses.filter(business => business._id !== id),
                isTransitioning: false
            }));
            return { success: true };
        } catch (error) {
            set({ isTransitioning: false });
            return { 
                success: false, 
                error: error.response?.data?.message || 'Failed to delete business'
            };
        }
    },


    deleteMultipleBusinesses: async (ids) => {
        set({ isTransitioning: true });
        const errors = [];
        
        try {
            // Eliminar businesses uno por uno
            await Promise.all(ids.map(async (id) => {
                try {
                    await api.delete(`/dialtools/business/delete/${id}`);
                } catch (error) {
                    errors.push({
                        id,
                        error: error.response?.data?.message || 'Failed to delete business'
                    });
                }
            }));

            // Actualizar el estado local removiendo los businesses eliminados
            set(state => ({
                businesses: state.businesses.filter(business => !ids.includes(business._id)),
                filteredBusinesses: state.filteredBusinesses.filter(business => !ids.includes(business._id)),
                selectedBusinesses: state.selectedBusinesses.filter(id => !ids.includes(id)),
                isTransitioning: false
            }));

            return { 
                success: true, 
                errors: errors.length > 0 ? errors : null 
            };
        } catch (error) {
            set({ isTransitioning: false });
            return { 
                success: false, 
                error: 'Failed to delete businesses' 
            };
        }
    },

    // Funciones de filtrado y ordenamiento
    setFilter: (value) => {
        const businesses = get().businesses;
        const sortField = get().sortField;
        const sortDirection = get().sortDirection;
        
        set({ 
            filterValue: value,
            currentPage: 1,
            selectedBusinesses: []
        });

        let filtered = businesses;

        if (value.trim()) {
            const searchStr = value.toLowerCase();
            filtered = businesses.filter(business => {
                return (
                    business.name?.toLowerCase().includes(searchStr) ||
                    business.email?.toLowerCase().includes(searchStr) ||
                    business.phone?.includes(searchStr) ||
                    business.city?.toLowerCase().includes(searchStr) ||
                    business.state?.toLowerCase().includes(searchStr)
                );
            });
        }

        if (sortField && sortDirection) {
            const direction = sortDirection;
            filtered.sort((a, b) => {
                let aValue = a[sortField] || '';
                let bValue = b[sortField] || '';
                
                if (typeof aValue === 'string') aValue = aValue.toLowerCase();
                if (typeof bValue === 'string') bValue = bValue.toLowerCase();

                if (aValue < bValue) return direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        set({ filteredBusinesses: filtered });
    },

    setSorting: (field) => {
        const currentSortField = get().sortField;
        const currentSortDirection = get().sortDirection;
        
        const newDirection = 
            field === currentSortField
                ? currentSortDirection === 'asc' 
                    ? 'desc' 
                    : currentSortDirection === 'desc'
                        ? null
                        : 'asc'
                : 'asc';

        const newSortField = newDirection === null ? null : field;

        let businessesToSort = [...get().filteredBusinesses];

        if (newDirection && newSortField) {
            businessesToSort.sort((a, b) => {
                let aValue = a[newSortField];
                let bValue = b[newSortField];

                if (!aValue) aValue = '';
                if (!bValue) bValue = '';

                if (typeof aValue === 'string') aValue = aValue.toLowerCase();
                if (typeof bValue === 'string') bValue = bValue.toLowerCase();

                if (aValue < bValue) return newDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return newDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        set({ 
            sortField: newSortField,
            sortDirection: newDirection,
            filteredBusinesses: businessesToSort,
            currentPage: 1
        });
    },

    // Funciones de paginación
    getPaginatedData: () => {
        const { filteredBusinesses, currentPage, pageSize } = get();
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        
        return {
            data: filteredBusinesses.slice(start, end),
            totalPages: Math.ceil(filteredBusinesses.length / pageSize),
            totalItems: filteredBusinesses.length
        };
    },

    setCurrentPage: (page) => {
        set({ currentPage: page });
    },

    setPageSize: (size) => {
        const currentFirstItem = (get().currentPage - 1) * get().pageSize;
        const newPage = Math.floor(currentFirstItem / size) + 1;
        set({ 
            pageSize: size,
            currentPage: newPage
        });
    },
    
    // Función para actualizar columnas visibles
    updateVisibleColumns: (columns) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('visibleColumns', JSON.stringify(columns));
        }
        set({ visibleColumns: columns });
    },
/*     updateVisibleColumns: (columns) => {
        set({ visibleColumns: columns });
    }, */

    // Función para verificar si una columna está visible
    isColumnVisible: (column) => {
        return get().visibleColumns.includes(column);
    },

    // Función para cargar todos los contacts
    fetchContacts: async () => {
        try {
            set({ isLoadingContacts: true });
            const response = await axios.get('https://api.nevtis.com/dialtools/leads/allLeads');
            set({ 
                contacts: response.data, 
                isLoadingContacts: false 
            });
        } catch (error) {
            console.error('Error fetching contacts:', error);
            set({ 
                contacts: [], 
                isLoadingContacts: false,
                error: error.message 
            });
        }
    },

    // Función para obtener contacts asociados a un business
    getBusinessContacts: (businessId) => {
        return get().contacts.filter(
            contact => contact.business?._id === businessId
        );
    },

}));

export default useBusinessStore;