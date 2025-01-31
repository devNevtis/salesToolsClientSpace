// src/components/milestones/ListView/SubtaskItem.jsx
'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useMilestonesStore from "@/store/useMilestonesStore";
import { Trash2, Edit3 } from "lucide-react";
import { useState } from "react";
import DeleteSubtaskDialog from "../dialogs/DeleteSubtaskDialog";
import EditSubtaskDialog from "../dialogs/EditSubtaskDialog";


export default function SubtaskItem({ subtask, milestoneId, taskId, onDeleteSubtask }) {
  const { setSubtaskToDelete, updateSubtask } = useMilestonesStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleToggle = () => {
    updateSubtask(milestoneId, taskId, subtask._id, {
      completed: !subtask.completed,
    });
  };

  const handleTitleChange = (e) => {
    updateSubtask(milestoneId, taskId, subtask.id, {
      title: e.target.value,
    });
  };


  const handleDeleteClick = () => {
    setSubtaskToDelete(milestoneId, taskId, subtask._id);
    setIsDeleteDialogOpen(true);
  };

  //console.log(taskId, subtask);

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={subtask.completed}
        onChange={handleToggle}
        className="h-4 w-4 rounded border-slate-200"
      />
      <span className="flex-1">
        {subtask.title}
      </span>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setIsEditDialogOpen(true)}
        className="text-primary hover:text-primary/90"
      >
        <Edit3 className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={handleDeleteClick}
        className="text-destructive hover:text-destructive/90"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <EditSubtaskDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        subtask={subtask}
        milestoneId={milestoneId}
        taskId={taskId}
      />
      <DeleteSubtaskDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        milestoneId={milestoneId}
        subtask={subtask}
        taskId={taskId}
        onDelete={onDeleteSubtask}
      />
    </div>
  );
}
