// src/store/useCallStore.js
import { create } from 'zustand';

const useCallStore = create((set) => ({
  destination: '', // El número del destino seleccionado
  dialedNumber: '', // El número digitado en el dialer pad
  userCall: null,
  setDestination: (destination) => set({ destination }),
  setDialedNumber: (number) => set({ dialedNumber: number }),
  setUserCall: (userCallData) => set({ userCall: userCallData }),
}));

export default useCallStore;
