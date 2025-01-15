// src/components/milestones/ListView/TaskItem.jsx
'use client';

import { useState, useEffect } from "react";
import SubtaskItem from "./SubtaskItem";
import DeleteTaskDialog from "../dialogs/DeleteTaskDialog";
import useMilestonesStore from "@/store/useMilestonesStore";
import StatusBadge from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import useCompanyTheme from '@/store/useCompanyTheme';
import { Trash2, Edit3 } from "lucide-react";

export default function TaskItem({ task, milestoneId, onEditTask }) {
    const { theme } = useCompanyTheme();
    const { deleteTask } = useMilestonesStore();
    const { deleteSubtask } = useMilestonesStore();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
      if (theme.base1) {
        document.documentElement.style.setProperty('--theme-base1', theme.base1);
      }
      if (theme.base2) {
        document.documentElement.style.setProperty('--theme-base2', theme.base2);
      }
      if (theme.highlighting) {
        document.documentElement.style.setProperty('--theme-highlighting', theme.highlighting);
      }
      if (theme.callToAction) {
        document.documentElement.style.setProperty('--theme-callToAction', theme.callToAction);
      }
    }, [theme]);

    const handleDelete = () => {
      deleteTask(milestoneId, task.id);
    };

  return (
    <div className="bg-white p-3 rounded-lg border">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium text-sm text-[var(--theme-base1)]">{task.title}</div>
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
            className="text-[var(--theme-base1)] hover:text-primary"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-[var(--theme-callToAction)] hover:text-destructive/90"
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
