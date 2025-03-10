// src/config/env.js
export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  endpoints: {
    auth: {
      login: `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_AUTH_ENDPOINT}/login`,
    },
    company: {
      getById: (id) =>
        `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_COMPANY_ENDPOINT}/${id}`,
    },
    products: {
      getAll: `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_PRODUCTS_ENDPOINT}/getAll`,
      create: `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_PRODUCTS_ENDPOINT}/create`,
      delete: `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_PRODUCTS_ENDPOINT}/delete`,
      update: `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_PRODUCTS_ENDPOINT}/update`,
    },
    users: {
      update: (role) =>
        `${process.env.NEXT_PUBLIC_API_URL}/dialtools/users/${role}/update`,
      create: (role) =>
        `${process.env.NEXT_PUBLIC_API_URL}/dialtools/users/${role}/create`,
      getAll: (role) =>
        `${process.env.NEXT_PUBLIC_API_URL}/dialtools/users/${role}/all`,
      delete: (role) =>
        `${process.env.NEXT_PUBLIC_API_URL}/dialtools/users/${role}/delete`,
    },
    // Nuevos endpoints para business y leads
    business: {
      all: `${process.env.NEXT_PUBLIC_API_URL}/dialtools/business/all`,
      getByUser: (userId) =>
        `${process.env.NEXT_PUBLIC_API_URL}/dialtools/business/createdBy/${userId}`, // Este es el cambio principal
      create: `${process.env.NEXT_PUBLIC_API_URL}/dialtools/business/create`,
      update: (id) =>
        `${process.env.NEXT_PUBLIC_API_URL}/dialtools/business/update/${id}`,
      delete: (id) =>
        `${process.env.NEXT_PUBLIC_API_URL}/dialtools/business/delete/${id}`,
    },
    business2: {
      all: `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_BUSINESS_ENDPOINT}/all`,
      update: (id) =>
        `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_BUSINESS_ENDPOINT}/update/${id}`,
      delete: (id) =>
        `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_BUSINESS_ENDPOINT}/delete/${id}`,
      create: `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_BUSINESS_ENDPOINT}/create`,
      getByUser: (userId) =>
        `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_BUSINESS_ENDPOINT}/createdBy/${userId}`,
    },
    leads: {
      all: `${process.env.NEXT_PUBLIC_API_URL}/dialtools/leads/allLeads`,
      getByBusiness: `${process.env.NEXT_PUBLIC_API_URL}/dialtools/leads/business`,
      create: `${process.env.NEXT_PUBLIC_API_URL}/dialtools/leads/create`,
      update: (id) =>
        `${process.env.NEXT_PUBLIC_API_URL}/dialtools/leads/update/${id}`,
      delete: (id) =>
        `${process.env.NEXT_PUBLIC_API_URL}/dialtools/leads/delete/${id}`,
    },
    leads2: {
      all: `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_LEADS_ENDPOINT}/allLeads`,
      create: `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_LEADS_ENDPOINT}/create`,
      update: (id) =>
        `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_LEADS_ENDPOINT}/update/${id}`,
      delete: (id) =>
        `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_LEADS_ENDPOINT}/delete/${id}`,
    },
    callNotes: {
      create: `${process.env.NEXT_PUBLIC_API_URL}/dialtools/call-notes/create`,
      getByUser: (userId) =>
        `${process.env.NEXT_PUBLIC_API_URL}/dialtools/call-notes/user/${userId}`,
      getByBusiness: (businessId) =>
        `${process.env.NEXT_PUBLIC_API_URL}/dialtools/call-notes/business/${businessId}`,
    },
    config: {
      all: `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_CONFIG_ENDPOINT}/all`,
    },
  },
};
