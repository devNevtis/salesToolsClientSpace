// src/components/Sidebar/Dialist.jsx
'use client';

import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useCallStore from '@/store/useCallStore';
import axios from 'axios';
import { Loader2, AlertCircle } from 'lucide-react';

const DialList = () => {
  const { destination, setDestination } = useCallStore(); // Obtener y actualizar el destino
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_CALL_API_URL}/c401dee4-4ecf-4cc6-9fbd-5dddb3e1a376/resume`
        );
        setDestinations(response.data);
      } catch (err) {
        setError('Cannot get the number list.');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  //console.log(destinations);

  return (
    <div className="w-[200px] pt-2">
      {loading ? (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      ) : (
        <Select
          value={destination ? JSON.stringify(destination) : ''}
          onValueChange={(val) => setDestination(JSON.parse(val))}
        >
          {/* <Select value={destination} onValueChange={setDestination}> */}
          <SelectTrigger className="w-full border-gray-300 rounded-xl bg-white text-gray-700 shadow-sm hover:shadow-md transition-all">
            <SelectValue placeholder="Select a number">
              {destination?.destination_number || 'Select a number'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-gray-300 shadow-md">
            <SelectGroup>
              {destinations.map((dest) => (
                <SelectItem
                  key={dest.destination_number}
                  value={JSON.stringify(dest)}
                  /* value={dest.destination_number} */
                >
                  {dest.destination_number}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default DialList;
