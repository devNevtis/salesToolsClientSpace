// src/components/milestones/dialogs/DeleteTaskDialog.jsx
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
import useMilestonesStore from "@/store/useMilestonesStore";
import { useState } from "react";

export default function DeleteTaskDialog({ open, onOpenChange, task, milestoneId }) {
  const { deleteTask } = useMilestonesStore();
  const [isLoading, setIsLoading] = useState(false);

  //console.log("DeleteTaskDialog opened with:", { task, milestoneId });

  const handleDelete = async () => {
    if (!task || !milestoneId) {
      console.error("Task or milestoneId is missing!");
      return;
    }

    setIsLoading(true);
    console.log("Deleting task with ID:", task._id, "from milestone:", milestoneId);

    try {
      await deleteTask(milestoneId, task._id);
      console.log("Task deleted successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirm Task Deletion
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the task <strong>{task.title}</strong>? This action cannot be undone.
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
