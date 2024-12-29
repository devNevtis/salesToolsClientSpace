// src/components/dashboard/Dashboard.jsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import useFunnelStore from '@/store/useFunnelStore';
import useLeadsStore from '@/store/useLeadsStore';  // Añadir esta importación
import SalesFunnel from './SalesFunnel';
import OpportunityFunnel from './OpportunityFunnel';

export default function Dashboard({ leads }) {
  const { user } = useAuth();
  const { contacts } = useLeadsStore();  // Obtener los contacts
  const { initializeWithLeads, fetchConfig, processOpportunities, setContacts } = useFunnelStore();

  useEffect(() => {
    const initialize = async () => {
      if (!user || !leads) return;
      
      console.log('Dashboard - Contacts before initialization:', contacts);
      setContacts(contacts);  // Primero establecer los contacts
      initializeWithLeads(leads);
      
      const stages = await fetchConfig();
      if (stages) {
        processOpportunities(leads, stages);
      }
    };

    initialize();
  }, [leads, user, contacts, initializeWithLeads, fetchConfig, processOpportunities, setContacts]);

  return (
    <div className="p-6 h-[calc(100vh-5rem)] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-6">
          <SalesFunnel />
          <div className="h-64 bg-card rounded-lg border shadow-sm" />
        </div>
        <div className="space-y-6">
          <OpportunityFunnel />
          <div className="h-64 bg-card rounded-lg border shadow-sm" />
        </div>
      </div>
    </div>
  );
}