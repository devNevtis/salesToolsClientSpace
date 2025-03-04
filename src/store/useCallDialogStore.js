import { create } from 'zustand';

export const useCallDialogStore = create((set) => ({
  isOpen: false,
  business: null,
  openDialog: (business) => set({ isOpen: true, business }),
  closeDialog: () => set({ isOpen: false, business: null }),
}));
