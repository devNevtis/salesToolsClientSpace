// src/store/emailComposeStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useEmailComposeStore = create(
  persist(
    (set) => ({
      emailData: {
        to: '',
        subject: '',
        body: '',
      },
      setEmailData: (data) =>
        set((state) => ({ emailData: { ...state.emailData, ...data } })),
      resetEmailData: () =>
        set(() => ({ emailData: { to: '', subject: '', body: '' } })),
    }),
    {
      name: 'email-compose-storage', // key en localStorage
      // Persistir solo subject y body, no el campo "to"
      partialize: (state) => ({
        emailData: {
          subject: state.emailData.subject,
          body: state.emailData.body,
        },
      }),
      // Solo usa localStorage si está definido (en el cliente)
      getStorage: () => (typeof window !== 'undefined' ? localStorage : undefined),
    }
  )
);
