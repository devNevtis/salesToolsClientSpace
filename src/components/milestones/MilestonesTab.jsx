// src/components/milestones/MilestonesTab.jsx
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import LeadSelector from "./LeadSelector";
import MilestonesList from "./ListView/MilestonesList";
import useMilestonesStore from "@/store/useMilestonesStore";
import useLeadsStore from "@/store/useLeadsStore";

export default function MilestonesTab() {
  const {
    milestones,
    selectedLeadId,
    setSelectedLead,
    fetchMilestonesByBusiness,
  } = useMilestonesStore();

  const { businesses } = useLeadsStore();

  useEffect(() => {
    if (selectedLeadId) {
      fetchMilestonesByBusiness(selectedLeadId);
    }
  }, [selectedLeadId, fetchMilestonesByBusiness]);

  if (!businesses) {
    return <div>Loading businesses...</div>;
  }
  //console.log(milestones)
  //console.log(selectedLeadId)

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <LeadSelector
          selectedLeadId={selectedLeadId}
          onSelectLead={setSelectedLead}
        />
      </Card>
      <Card className="p-4">
        {!selectedLeadId ? (
          <div>Please select a business to view milestones.</div>
        ) : (
          <MilestonesList milestones={milestones} />
        )}
      </Card>
    </div>
  );
}
