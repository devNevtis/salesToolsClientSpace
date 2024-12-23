// src/config/env.js
export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  endpoints: {
    auth: {
      login: `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_AUTH_ENDPOINT}/login`,
    },
    company: {
      getById: (id) => `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_COMPANY_ENDPOINT}/${id}`,
    },
    products: {
      getAll: `${process.env.NEXT_PUBLIC_API_URL}/dialtools/products/getAll`,
      create: `${process.env.NEXT_PUBLIC_API_URL}/dialtools/products/create`,
      delete: `${process.env.NEXT_PUBLIC_API_URL}/dialtools/products/delete`,
      update: `${process.env.NEXT_PUBLIC_API_URL}/dialtools/products/update`,
    },
    users: {
      update: (role) => `${process.env.NEXT_PUBLIC_API_URL}/dialtools/users/${role}/update`,
      create: (role) => `${process.env.NEXT_PUBLIC_API_URL}/dialtools/users/${role}/create`,
      getAll: (role) => `${process.env.NEXT_PUBLIC_API_URL}/dialtools/users/${role}/all`,
      delete: (role) => `${process.env.NEXT_PUBLIC_API_URL}/dialtools/users/${role}/delete`,
    },
      // Nuevos endpoints para business y leads
      business: {
        all: `${process.env.NEXT_PUBLIC_API_URL}/dialtools/business/all`,
        getByUser: (userId) => `${process.env.NEXT_PUBLIC_API_URL}/dialtools/business/createdBy/${userId}`, // Este es el cambio principal
        create: `${process.env.NEXT_PUBLIC_API_URL}/dialtools/business/create`,
        update: (id) => `${process.env.NEXT_PUBLIC_API_URL}/dialtools/business/update/${id}`,
        delete: (id) => `${process.env.NEXT_PUBLIC_API_URL}/dialtools/business/delete/${id}`,
      },
      leads: {
        all: `${process.env.NEXT_PUBLIC_API_URL}/dialtools/leads/allLeads`,
        getByBusiness: `${process.env.NEXT_PUBLIC_API_URL}/dialtools/leads/business`,
        create: `${process.env.NEXT_PUBLIC_API_URL}/dialtools/leads/create`,
        update: (id) => `${process.env.NEXT_PUBLIC_API_URL}/dialtools/leads/update/${id}`,
        delete: (id) => `${process.env.NEXT_PUBLIC_API_URL}/dialtools/leads/delete/${id}`,
      },
  },
};