// src/components/milestones/ListView/TaskItem.jsx
'use client';

import { useState } from "react";
import SubtaskItem from "./SubtaskItem";
import DeleteTaskDialog from "../dialogs/DeleteTaskDialog";
import useMilestonesStore from "@/store/useMilestonesStore";
import StatusBadge from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Trash2, Edit3 } from "lucide-react";

export default function TaskItem({ task, milestoneId, onEditTask }) {
    const { deleteTask } = useMilestonesStore();
    const { deleteSubtask } = useMilestonesStore();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = () => {
      deleteTask(milestoneId, task.id);
    };

  return (
    <div className="bg-white p-3 rounded-lg border">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium text-sm">{task.title}</div>
          <p className="text-sm text-muted-foreground">{task.description}</p>
          {task.assignedTo && (
            <div className="mt-1 text-xs text-muted-foreground">
              Assigned to: {task.assignedTo.name}
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <StatusBadge status={task.status} />
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => onEditTask(task)} 
            className="text-muted-foreground hover:text-primary"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive hover:text-destructive/90"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {task.subtasks?.length > 0 && (
        <div className="mt-2 pl-4 border-l space-y-2">
          {task.subtasks.map((subtask) => (
            <SubtaskItem
              key={subtask.id}
              subtask={subtask}
              milestoneId={milestoneId}
              taskId={task.id}
              onDeleteSubtask={(milestoneId, taskId, subtaskId) =>
                deleteSubtask(milestoneId, taskId, subtaskId)
              }
            />
          ))}
        </div>
      )}
      <DeleteTaskDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        task={task}
        onDelete={(id) => deleteTask(milestoneId, id)}
      />
    </div>
  );
}
