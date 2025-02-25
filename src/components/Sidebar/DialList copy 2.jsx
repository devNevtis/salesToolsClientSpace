// src/components/Sidebar/Dialist.jsx
'use client';

import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useCallStore from '@/store/useCallStore'; // Importa el store

import axios from 'axios';

const DialList = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const setDestination = useCallStore((state) => state.setDestination);
  const setUserCall = useCallStore((state) => state.setUserCall); // Usamos la función para actualizar el destino

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        // Usamos la URL desde el archivo .env.local
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_CALL_API_URL}/f1d51904-3b02-4453-8536-28e7c1e8290a/resume`
        );
        setDestinations(response.data); // Guardamos los destinos obtenidos
        setLoading(false); // Desactivamos el estado de carga
      } catch (err) {
        setError('Error al obtener los destinos'); // Si hay error, lo mostramos
        setLoading(false); // Desactivamos el estado de carga
      }
    };

    fetchDestinations(); // Llamamos a la función de obtención de datos
  }, []);

  // Si está cargando, mostramos un mensaje de carga
  if (loading) {
    return <div>Loading...</div>;
  }

  // Si hay un error, mostramos el mensaje de error
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Destinations</h1>
      <Select onValueChange={setDestination}>
        {' '}
        {/* Actualizamos el store con el destino seleccionado */}
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a destination" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>destinations</SelectLabel>
            {destinations.map((destination) => (
              <SelectItem
                key={destination.destination_number}
                value={destination.destination_number}
              >
                {destination.destination_number}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DialList;
