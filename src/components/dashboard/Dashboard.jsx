// src/components/dashboard/Dashboard.jsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import useFunnelStore from '@/store/useFunnelStore';
import useLeadsStore from '@/store/useLeadsStore';  // Añadir esta importación
import SalesFunnel from './SalesFunnel';
import OpportunityFunnel from './OpportunityFunnel';
import LeadSourceChart from './LeadSourceChart';

export default function Dashboard({ leads }) {
  const { user } = useAuth();
  const { contacts } = useLeadsStore();  // Obtener los contacts
  const { initializeWithLeads, fetchConfig, processOpportunities, setContacts } = useFunnelStore();

  useEffect(() => {
    const initialize = async () => {
      if (!user || !leads) return;
      
      //console.log('Dashboard - Contacts before initialization:', contacts);
      setContacts(contacts);  // Primero establecer los contacts
      initializeWithLeads(leads);
      
      const stages = await fetchConfig();
      if (stages) {
        processOpportunities(leads, stages);
      }
    };

    initialize();
  }, [leads, user, contacts, initializeWithLeads, fetchConfig, processOpportunities, setContacts]);

  //console.log(contacts)

  return (
    <div className="px-6 py-1 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <SalesFunnel />
          <LeadSourceChart contacts={contacts} />
        </div>
        <div className="space-y-2">
          <OpportunityFunnel />
          <div className="h-64 bg-card rounded-lg border shadow-sm" />
        </div>
      </div>
    </div>
  );
}