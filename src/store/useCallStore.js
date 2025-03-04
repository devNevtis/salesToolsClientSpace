// src/store/useCallStore.js
import { create } from 'zustand';

const useCallStore = create((set) => ({
  destination: '', // El número del destino seleccionado
  dialedNumber: '', // El número digitado en el dialer pad
  userCall: {
    // Información adicional de la llamada
    extension_uuid: 'ac5112de-0843-4648-91b6-3d7f48c51c49',
    domain_uuid: 'c401dee4-4ecf-4cc6-9fbd-5dddb3e1a376',
    extension: '120',
    password: '@Nex.2020$$',
    accountcode: 'nevtishq.nevtisvoice.com',
    effective_caller_id_name: 'Juan Olmedo',
    effective_caller_id_number: '120',
    outbound_caller_id_name: 'NEVTIS',
    outbound_caller_id_number: '7147839680',
    directory_first_name: 'Juan',
    directory_last_name: 'Olmedo',
    //extension_uuid: '8a25f402-ef08-48ee-bebb-8be3ff9677d6',
    //domain_uuid: 'c401dee4-4ecf-4cc6-9fbd-5dddb3e1a376',
    //extension: '160',
    //password: 'RW0UB*$k3KX.8I.8Mcvv',
    //accountcode: null,
    // effective_caller_id_name: '160',
    // effective_caller_id_number: '160',
    // outbound_caller_id_name: 'NEVTIS',
    // outbound_caller_id_number: '7147839680',
    // directory_first_name: '160',
    // directory_last_name: '160',
  },

  setDestination: (destination) => set({ destination }),
  setDialedNumber: (number) => set({ dialedNumber: number }),
  setUserCall: (userCallData) => set({ userCall: userCallData }), // Añadimos la función para actualizar los datos de la llamada
}));

export default useCallStore;
