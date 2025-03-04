// src/store/useLeadsStore.js
import { create } from 'zustand';
import axios from '@/lib/axios';
import { env } from '@/config/env';

const useLeadsStore = create((set, get) => ({
  // Data State
  businesses: [],
  contacts: {},
  sellers: [],
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
    'actions',
  ],
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
  },

  // Column Configuration (Contrato con ColumnsVisibilityDialog)
  availableColumns: [
    { id: 'companyName', label: 'Company Name', required: true },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'location', label: 'Location' },
    { id: 'website', label: 'Website' },
    { id: 'contacts', label: 'Contacts', required: true },
    { id: 'actions', label: 'Actions', required: true },
  ],

  // Fetch sellers para managers
  fetchSellers: async (managerId) => {
    try {
      const response = await axios.get(env.endpoints.users.getAll('sale'));
      const sellersList = response.data.filter(
        (seller) => seller.managerId === managerId
      );
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

      switch (user.role) {
        case 'admin': {
          const [businessesResponse, contactsResponse] = await Promise.all([
            axios.get(env.endpoints.business.all),
            axios.get(env.endpoints.leads.all),
          ]);
          console.log(
            'Total de registros sin filtrar:',
            businessesResponse.data.length
          );
          businessesData = businessesResponse.data;
          contactsData = contactsResponse.data;
          break;
        }
        case 'owner': {
          const [ownerBusinesses, ownerContacts] = await Promise.all([
            axios.get(env.endpoints.business.all),
            axios.get(env.endpoints.leads.all),
          ]);
          businessesData = ownerBusinesses.data.filter(
            (business) => business.createdBy?.companyId === user.companyId
          );
          contactsData = ownerContacts.data.filter(
            (contact) =>
              contact.user?.companyId === user.companyId ||
              businessesData.some((b) => b._id === contact.business?._id)
          );
          break;
        }
        case 'manager': {
          const sellers = await get().fetchSellers(user._id);
          const sellerIds = [user._id, ...sellers.map((seller) => seller._id)];

          const [managerBusinesses, managerContacts] = await Promise.all([
            axios.get(env.endpoints.business.all),
            axios.get(env.endpoints.leads.all),
          ]);

          businessesData = managerBusinesses.data.filter((business) =>
            sellerIds.includes(business.createdBy?._id)
          );
          contactsData = managerContacts.data.filter(
            (contact) =>
              sellerIds.includes(contact.assignedTo) ||
              businessesData.some((b) => b._id === contact.business?._id)
          );
          break;
        }
        case 'sale': {
          const [sellerBusinesses, sellerContacts] = await Promise.all([
            axios.get(env.endpoints.business.getByUser(user._id)),
            axios.get(env.endpoints.leads.all),
          ]);
          businessesData = sellerBusinesses.data;
          contactsData = sellerContacts.data.filter(
            (contact) => contact.assignedTo === user._id
          );
          break;
        }
        default:
          throw new Error('Invalid user role');
      }

      // Organizar contactos por business
      const contactsByBusiness = {};
      const allowedBusinessIds = new Set(businessesData.map((b) => b._id));

      contactsData.forEach((contact) => {
        const businessId = contact.business?._id;
        if (!businessId || !allowedBusinessIds.has(businessId)) return;
        if (!contactsByBusiness[businessId]) {
          contactsByBusiness[businessId] = [];
        }
        contactsByBusiness[businessId].push({
          _id: contact._id,
          name: `${contact.firstName} ${contact.lastName}`,
          email: contact.email,
          phone: contact.phone,
          status: contact.status,
          assignedTo: contact.assignedTo,
          createdAt: contact.createdAt,
          opportunities: contact.opportunities || [],
          dndSettings: contact.dndSettings,
        });
      });

      // Actualizar totalItems en la paginación con la cantidad de negocios filtrados
      const filteredBusinesses = get().getFilteredBusinesses();
      set({
        businesses: businessesData,
        contacts: contactsByBusiness,
        pagination: {
          ...get().pagination,
          totalItems: filteredBusinesses.length,
        },
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      set({
        error: error.message || 'Error fetching data',
        isLoading: false,
      });
    }
  },

  // UI Actions (mantiene compatibilidad con componentes existentes)
  setVisibleColumns: (columns) => set({ visibleColumns: columns }),
  resetColumnsToDefault: () =>
    set({
      visibleColumns: [
        'companyName',
        'email',
        'phone',
        'location',
        'website',
        'contacts',
        'actions',
      ],
    }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setPage: (page) =>
    set((state) => ({
      pagination: { ...state.pagination, currentPage: page },
    })),
  setPageSize: (size) =>
    set((state) => ({
      pagination: { ...state.pagination, pageSize: size, currentPage: 1 }, // reinicia a la primera página al cambiar el tamaño
    })),

  // Getters para datos filtrados
  getContactsForBusiness: (businessId) => {
    const { contacts } = get();
    return contacts[businessId] || [];
  },

  // Se aplica el filtro de búsqueda y se descartan los negocios cuyo primer contacto tenga status "won"
  getFilteredBusinesses: () => {
    const { businesses, searchTerm } = get();
    let filtered = businesses;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = businesses.filter(
        (business) =>
          business.name?.toLowerCase().includes(searchLower) ||
          business.email?.toLowerCase().includes(searchLower) ||
          business.phone?.includes(searchTerm)
      );
    }
    // Se filtran los negocios que tengan contacto con status "won" (se evalúa el primer contacto)
    return filtered.filter((business) => {
      const contacts = get().getContactsForBusiness(business._id);
      return !contacts.length || contacts[0].status !== 'won';
    });
  },

  getPaginatedBusinesses: () => {
    const { pagination, getFilteredBusinesses } = get();
    const filteredBusinesses = getFilteredBusinesses();
    // Ordenar por fecha de creación descendente (más recientes primero)
    const sortedBusinesses = filteredBusinesses
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedBusinesses.slice(start, end);
  },

  // Función para obtener todas las oportunidades
  fetchAllOpportunities: async () => {
    const { businesses, contacts, currentUser } = get();
    const opportunities = [];

    businesses.forEach((business) => {
      const businessContacts = contacts[business._id] || [];
      businessContacts.forEach((contact) => {
        if (
          currentUser.role === 'admin' ||
          (currentUser.role === 'owner' &&
            business.createdBy.companyId === currentUser.companyId) ||
          (currentUser.role === 'manager' &&
            contact.assignedTo === currentUser._id) ||
          (currentUser.role === 'sale' &&
            contact.assignedTo === currentUser._id)
        ) {
          opportunities.push(...contact.opportunities);
        }
      });
    });

    return opportunities;
  },
}));

export default useLeadsStore;
