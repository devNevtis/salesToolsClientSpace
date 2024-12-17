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
      update: (role) => `${process.env.NEXT_PUBLIC_API_URL}/user/users/${role}/update`,
    },
  },
};