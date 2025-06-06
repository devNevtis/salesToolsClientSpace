// src/components/dashboard/Dashboard.jsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import useFunnelStore from '@/store/useFunnelStore';
import useLeadsStore from '@/store/useLeadsStore';
import SalesFunnel from './SalesFunnel';
import OpportunityFunnel from './OpportunityFunnel';
import LeadSourceChart from './LeadSourceChart';
import CallNotesChart from './CallNotesChart';

export default function Dashboard({ leads }) {
  const { user } = useAuth();
  const { contacts } = useLeadsStore();
  const {
    initializeWithLeads,
    fetchConfig,
    processOpportunities,
    setContacts,
  } = useFunnelStore();

  // ... (useEffect sin cambios) ...
  useEffect(() => {
    const initialize = async () => {
      if (!user || !leads) return;
      if (contacts) {
        setContacts(contacts);
      }
      initializeWithLeads(leads);

      const stages = await fetchConfig();
      if (stages) {
        processOpportunities(leads, stages);
      }
    };

    initialize();
  }, [
    leads,
    user,
    contacts,
    initializeWithLeads,
    fetchConfig,
    processOpportunities,
    setContacts,
  ]);

  return (
    <div className="px-6">
      {/* Grid Layout (sin cambios) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-4">
          {' '}
          <SalesFunnel />
          <LeadSourceChart contacts={contacts} />
        </div>
        <div className="space-y-4">
          {' '}
          <OpportunityFunnel />
          <CallNotesChart contacts={contacts} />
        </div>
      </div>
    </div>
  );
}
