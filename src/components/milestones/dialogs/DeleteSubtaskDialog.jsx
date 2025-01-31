// src/components/milestones/dialogs/DeleteSubtaskDialog.jsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import useMilestonesStore from "@/store/useMilestonesStore";

export default function DeleteSubtaskDialog({ open, onOpenChange,milestoneId,subtask,taskId,onDelete }) {
  const { deleteSubtask, clearSubtaskToDelete } = useMilestonesStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    //console.log("✅ DeleteSubtaskDialog - handleDelete ejecutado con:", subtask);
    setIsLoading(true);
    try {
      await onDelete(milestoneId,taskId,subtask._id);
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirm Subtask Deletion
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the subtask? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
