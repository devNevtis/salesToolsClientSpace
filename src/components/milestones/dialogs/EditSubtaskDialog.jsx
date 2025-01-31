//src/components/milestones/dialogs/EditSubtaskDialog.jsx
'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useMilestonesStore from "@/store/useMilestonesStore";

export default function EditSubtaskDialog({ open, onOpenChange, subtask, milestoneId, taskId }) {
  const { updateSubtask } = useMilestonesStore();
  const [title, setTitle] = useState(subtask?.title || "");

  const handleSave = async () => {
    if (!milestoneId || !taskId || !subtask?._id) return;
    await updateSubtask(milestoneId, taskId, subtask._id, { title });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Subtask</DialogTitle>
        </DialogHeader>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Subtask title" />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
