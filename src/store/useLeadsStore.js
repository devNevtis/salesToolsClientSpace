// src/store/useLeadsStore.js
import { create } from 'zustand';
import axios from '@/lib/axios';
import { env } from '@/config/env';

const useLeadsStore = create((set, get) => ({
  // Data State
  businesses: [],
  contacts: {},
  sellers: [], // Para managers: lista de sellers bajo su gestión
  isLoading: false,
  error: null,

  // UI State
  searchTerm: '',
  visibleColumns: [
    'companyName',
    'email',
    'phone',
    'location',
    'website',
    'contacts',
    'actions'
  ],
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0
  },

  // Column Configuration (No cambia ya que es parte del contrato con ColumnsVisibilityDialog)
  availableColumns: [
    { id: 'companyName', label: 'Company Name', required: true },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'location', label: 'Location' },
    { id: 'website', label: 'Website' },
    { id: 'contacts', label: 'Contacts', required: true },
    { id: 'actions', label: 'Actions', required: true }
  ],

  // Fetch sellers para managers
  fetchSellers: async (managerId) => {
    try {
      const response = await axios.get(env.endpoints.users.getAll('sale'));
      const sellersList = response.data.filter(seller => seller.managerId === managerId);
      set({ sellers: sellersList });
      return sellersList;
    } catch (error) {
      console.error('Error fetching sellers:', error);
      return [];
    }
  },

  // Función principal para obtener businesses según el rol
  fetchBusinesses: async (user) => {
    if (!user) return;
    
    set({ isLoading: true, error: null });
    
    try {
      let businessesData = [];
      let contactsData = [];

      // Estrategia de fetch según rol
      switch (user.role) {
        case 'admin':
          // Admin ve todo
          const [businessesResponse, contactsResponse] = await Promise.all([
            axios.get(env.endpoints.business.all),
            axios.get(env.endpoints.leads.all)
          ]);
          businessesData = businessesResponse.data;
          contactsData = contactsResponse.data;
          break;

        case 'owner':
          // Owner ve todo de su compañía
          const [ownerBusinesses, ownerContacts] = await Promise.all([
            axios.get(env.endpoints.business.all),
            axios.get(env.endpoints.leads.all)
          ]);
          businessesData = ownerBusinesses.data.filter(business => 
            business.createdBy?.companyId === user.companyId
          );
          contactsData = ownerContacts.data.filter(contact => 
            contact.user?.companyId === user.companyId || 
            businessesData.some(b => b._id === contact.business?._id)
          );
          break;

        case 'manager':
          // Manager ve sus leads y los de sus sellers
          const sellers = await get().fetchSellers(user._id);
          const sellerIds = [user._id, ...sellers.map(seller => seller._id)];
          
          const [managerBusinesses, managerContacts] = await Promise.all([
            axios.get(env.endpoints.business.all),
            axios.get(env.endpoints.leads.all)
          ]);
          
          businessesData = managerBusinesses.data.filter(business =>
            sellerIds.includes(business.createdBy?._id)
          );
          contactsData = managerContacts.data.filter(contact =>
            sellerIds.includes(contact.assignedTo) || 
            businessesData.some(b => b._id === contact.business?._id)
          );
          break;

        case 'sale':
          // Seller solo ve sus leads
          const [sellerBusinesses, sellerContacts] = await Promise.all([
            axios.get(env.endpoints.business.getByUser(user._id)),
            axios.get(env.endpoints.leads.all)
          ]);
          businessesData = sellerBusinesses.data;
          contactsData = sellerContacts.data.filter(contact => 
            contact.assignedTo === user._id
          );
          break;

        default:
          throw new Error('Invalid user role');
      }

      // Organizar contactos por business
      const contactsByBusiness = {};
      
      // Primero creamos un mapa de los business permitidos
      const allowedBusinessIds = new Set(businessesData.map(b => b._id));
      
      // Filtramos y organizamos los contactos
      contactsData.forEach(contact => {
        // Asegurarse que el contacto tiene un business válido
        const businessId = contact.business?._id;
        if (!businessId || !allowedBusinessIds.has(businessId)) return;
        
        // Inicializar el array si no existe
        if (!contactsByBusiness[businessId]) {
          contactsByBusiness[businessId] = [];
        }
        
        // Añadir el contacto con la estructura requerida
        contactsByBusiness[businessId].push({
          _id: contact._id,
          name: `${contact.firstName} ${contact.lastName}`,
          email: contact.email,
          phone: contact.phone,
          status: contact.status,
          assignedTo: contact.assignedTo,
          createdAt: contact.createdAt,
          opportunities: contact.opportunities || [],
          dndSettings: contact.dndSettings
        });
      });

      set({
        businesses: businessesData,
        contacts: contactsByBusiness,
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      set({
        error: error.message || 'Error fetching data',
        isLoading: false
      });
    }
  },

  // UI Actions (Mantienen compatibilidad con componentes existentes)
  setVisibleColumns: (columns) => set({ visibleColumns: columns }),
  resetColumnsToDefault: () => set({ 
    visibleColumns: ['companyName', 'email', 'phone', 'location', 'website', 'contacts', 'actions']
  }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setPage: (page) => set((state) => ({
    pagination: { ...state.pagination, currentPage: page }
  })),
  setPageSize: (size) => set((state) => ({
    pagination: { ...state.pagination, pageSize: size }
  })),

  // Getters para datos filtrados (Mantienen compatibilidad con LeadsDataTable)
  getContactsForBusiness: (businessId) => {
    const { contacts } = get();
    return contacts[businessId] || [];
  },

  getFilteredBusinesses: () => {
    const { businesses, searchTerm } = get();
    if (!searchTerm) return businesses;

    const searchLower = searchTerm.toLowerCase();
    return businesses.filter((business) => 
      business.name?.toLowerCase().includes(searchLower) ||
      business.email?.toLowerCase().includes(searchLower) ||
      business.phone?.includes(searchTerm)
    );
  },

  getPaginatedBusinesses: () => {
    const { pagination } = get();
    const filteredBusinesses = get().getFilteredBusinesses();
    
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    
    return filteredBusinesses.slice(start, end);
  },
  fetchAllOpportunities: async () => {
    const { businesses, contacts } = get(); // Datos ya cargados en el store
    const user = get().currentUser; // Información del usuario actual
    
    const opportunities = [];
    
    businesses.forEach((business) => {
      const businessContacts = contacts[business._id] || [];
      businessContacts.forEach((contact) => {
        if (
          user.role === 'admin' || 
          (user.role === 'owner' && business.createdBy.companyId === user.companyId) || 
          (user.role === 'manager' && contact.assignedTo === user._id) || 
          (user.role === 'sale' && contact.assignedTo === user._id)
        ) {
          opportunities.push(...contact.opportunities);
        }
      });
    });
  
    return opportunities;
  }
  
}));

export default useLeadsStore;