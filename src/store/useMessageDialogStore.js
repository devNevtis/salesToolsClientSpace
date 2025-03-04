import { create } from 'zustand';

export const useMessageDialogStore = create((set) => ({
  isOpen: false,
  business: null,
  openDialog: (business) => set({ isOpen: true, business }),
  closeDialog: () => set({ isOpen: false, business: null }),
}));
