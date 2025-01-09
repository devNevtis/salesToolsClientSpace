// src/components/milestones/ListView/TaskItem.jsx
'use client';

import SubtaskItem from "./SubtaskItem";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useMilestonesStore from "@/store/useMilestonesStore";
import { Trash2, Edit3 } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";


function getBadgeVariant(status) {
  switch (status) {
    case "completed":
      return "default"; // Badge más destacado para tareas completadas
    case "in-progress":
      return "secondary"; // Badge secundario para tareas en progreso
    case "planned":
    default:
      return "outline"; // Badge contorneado para tareas planeadas
  }
}

export default function TaskItem({ task, milestoneId, onEditTask }) {
    const { deleteTask } = useMilestonesStore();
    const { deleteSubtask } = useMilestonesStore();

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
            onClick={handleDelete} 
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
