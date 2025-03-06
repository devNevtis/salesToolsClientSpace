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
import useCallStore from '@/store/useCallStore'; // Importamos el store

import axios from 'axios';

const DialList = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const setDestination = useCallStore((state) => state.setDestination); // Usamos la función para actualizar el destino

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        // Usamos la nueva variable de entorno para la API de llamadas
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_CALL_API_URL}/c401dee4-4ecf-4cc6-9fbd-5dddb3e1a376/resume`
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
      <div className="flex justify-center">
        <Select onValueChange={setDestination}>
          {' '}
          {/* Actualizamos el store con el destino seleccionado */}
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Destination" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Destinations</SelectLabel>
              {destinations.map((destination) => (
                <SelectItem
                  key={destination.destination_number}
                  /* value={destination.destination_number} */
                  value={destination}
                >
                  {destination.destination_number}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DialList;
