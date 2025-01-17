// src/components/milestones/MilestonesTab.jsx
import { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import LeadSelector from './LeadSelector';
import MilestonesList from './ListView/MilestonesList';
import useMilestonesStore from '@/store/useMilestonesStore';
import useLeadsStore from '@/store/useLeadsStore';

export default function MilestonesTab() {
  const milestonesStore = useMilestonesStore();
  const leadsStore = useLeadsStore();

  const { selectedLeadId, setSelectedLead } = milestonesStore || {};
  const { businesses } = leadsStore || {};

  useEffect(() => {
    if (!selectedLeadId && businesses?.length > 0) {
      setSelectedLead(businesses[0]._id);
    }
  }, [selectedLeadId, businesses, setSelectedLead]);

  if (!selectedLeadId || !businesses) {
    return <div>Loading...</div>;
  }

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
