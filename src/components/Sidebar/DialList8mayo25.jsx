// src/components/Sidebar/DialList.jsx
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
import { env } from '@/config/env';

const DialList = () => {
  const { destination, setDestination } = useCallStore();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl =
          env.endpoints?.call?.resume ||
          `${process.env.NEXT_PUBLIC_CALL_API_URL}/c401dee4-4ecf-4cc6-9fbd-5dddb3e1a376/resume`;
        if (!apiUrl) {
          throw new Error('Call API URL is not configured.');
        }
        const response = await axios.get(apiUrl);
        setDestinations(response.data);
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError('Cannot get the number list.');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <div className="w-full pt-2">
      {loading ? (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-500 text-sm p-2 bg-red-50 rounded-md border border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="break-words">{error}</span>{' '}
          {/* Permite que el texto se rompa */}
        </div>
      ) : (
        <Select
          value={destination ? JSON.stringify(destination) : ''}
          onValueChange={(val) => {
            try {
              setDestination(val ? JSON.parse(val) : null); // Maneja valor vacío/null
            } catch (e) {
              console.error('Failed to parse destination value:', e);
              // Opcional: mostrar error al usuario
            }
          }}
        >
          <SelectTrigger className="w-full border-gray-300 rounded-xl bg-white text-gray-700 shadow-sm hover:shadow-md transition-all">
            <SelectValue placeholder="Select a number">
              {/* Muestra número o placeholder. Trunca si es muy largo (opcional) */}
              <span className="truncate">
                {destination?.destination_number || 'Select a number'}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-gray-300 shadow-md">
            <SelectGroup>
              {destinations.length > 0 ? (
                destinations.map((dest) => (
                  <SelectItem
                    key={dest.destination_uuid || dest.destination_number}
                    value={JSON.stringify(dest)}
                  >
                    {dest.destination_number}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-3 text-center text-sm text-gray-500">
                  No numbers available.
                </div>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default DialList;
