//src/components/milestones/dialogs/EditMilestoneDialog.jsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useMilestonesStore from "@/store/useMilestonesStore";
import { useState, useEffect } from "react";

export default function EditMilestoneDialog({ open, onOpenChange, milestone }) {
  const { updateMilestone } = useMilestonesStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    dueDate: "",
  });

  useEffect(() => {
    if (milestone) {
      setFormData({
        title: milestone.title || "",
        description: milestone.description || "",
        startDate: milestone.startDate
          ? new Date(milestone.startDate).toISOString().split('T')[0]
          : "",
        dueDate: milestone.dueDate
          ? new Date(milestone.dueDate).toISOString().split('T')[0]
          : "",
      });
    }
  }, [milestone]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!milestone) return;
    updateMilestone(milestone.id, {
      ...milestone,
      ...formData,
      startDate: new Date(formData.startDate),
      dueDate: new Date(formData.dueDate),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Milestone</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Milestone Title"
          />
          <Input
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Milestone Description"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
            />
            <Input
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleInputChange}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
