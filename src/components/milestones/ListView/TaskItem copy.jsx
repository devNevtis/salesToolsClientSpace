// src/components/milestones/ListView/TaskItem.jsx
'use client';

import SubtaskItem from "./SubtaskItem";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useMilestonesStore from "@/store/useMilestonesStore";

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

export default function TaskItem({ task, milestoneId }) {
    const { deleteTask } = useMilestonesStore();

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
          <Badge variant={getBadgeVariant(task.status)}>{task.status}</Badge>
          <Button size="sm" onClick={() => console.log('Edit Task')}>Edit</Button>
          <Button size="sm" variant="destructive" onClick={handleDelete}>
            Delete
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
