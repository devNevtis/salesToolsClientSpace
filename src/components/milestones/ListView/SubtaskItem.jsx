// src/components/milestones/ListView/SubtaskItem.jsx
'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useMilestonesStore from "@/store/useMilestonesStore";
import { Trash2, Edit3 } from "lucide-react";
import { useState } from "react";
import DeleteSubtaskDialog from "../dialogs/DeleteSubtaskDialog";


export default function SubtaskItem({ subtask, milestoneId, taskId, onDeleteSubtask }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { updateSubtask, deleteSubtask } = useMilestonesStore();

  const handleToggle = () => {
    updateSubtask(milestoneId, taskId, subtask.id, {
      completed: !subtask.completed,
    });
  };

  const handleTitleChange = (e) => {
    updateSubtask(milestoneId, taskId, subtask.id, {
      title: e.target.value,
    });
  };

  const handleRemove = () => {
    deleteSubtask(milestoneId, taskId, subtask.id);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={subtask.completed}
        onChange={handleToggle}
        className="h-4 w-4 rounded border-slate-200"
      />
      <Input
        value={subtask.title}
        onChange={handleTitleChange} // Actualización dinámica del título
        className="h-9 border-slate-200 focus-visible:ring-0 focus-visible:border-slate-300"
      />
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setIsDeleteDialogOpen(true)}
        className="text-destructive hover:text-destructive/90"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <DeleteSubtaskDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        subtask={subtask}
        onDelete={(id) => onDeleteSubtask(milestoneId, taskId, id)}
      />
    </div>
  );
}
