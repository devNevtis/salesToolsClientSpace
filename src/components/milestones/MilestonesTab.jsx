// src/components/milestones/MilestonesTab.jsx
'use client';

import { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import LeadSelector from './LeadSelector';
import MilestonesList from './ListView/MilestonesList';
import useMilestonesStore from '@/store/useMilestonesStore';
import useLeadsStore from '@/store/useLeadsStore';

export default function MilestonesTab() {
  const { selectedLeadId, setSelectedLead } = useMilestonesStore();
  const { businesses, getPaginatedBusinesses } = useLeadsStore();
  
  // Al montar, si hay businesses pero no hay lead seleccionado, seleccionar el primero
  useEffect(() => {
    if (!selectedLeadId && businesses.length > 0) {
      setSelectedLead(businesses[0]._id);
    }
  }, [businesses, selectedLeadId, setSelectedLead]);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <LeadSelector />
      </Card>

      <Card className="p-4">
        <MilestonesList />
      </Card>
    </div>
  );
}