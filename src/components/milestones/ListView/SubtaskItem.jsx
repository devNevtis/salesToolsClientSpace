// src/components/milestones/ListView/SubtaskItem.jsx
'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useMilestonesStore from "@/store/useMilestonesStore";

export default function SubtaskItem({ subtask, milestoneId, taskId }) {
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
      <Button size="sm" variant="destructive" onClick={handleRemove}>
        Remove
      </Button>
    </div>
  );
}
