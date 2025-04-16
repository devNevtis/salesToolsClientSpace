// src/components/milestones/LeadSelector.jsx
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useLeadsStore from '@/store/useLeadsStore';
import useMilestonesStore from '@/store/useMilestonesStore';

export default function LeadSelector() {
  const { businesses } = useLeadsStore();
  const { selectedLeadId, setSelectedLead } = useMilestonesStore();

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium">Select Lead/Customer:</span>
      <Select 
        value={selectedLeadId || ''} 
        onValueChange={setSelectedLead}
      >
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Select a lead or customer" />
        </SelectTrigger>
        <SelectContent>
          {businesses.map((business) => (
            <SelectItem key={business._id} value={business._id}>
              {business.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}