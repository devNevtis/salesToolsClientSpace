'use client';

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useMilestonesStore from "@/store/useMilestonesStore";

export default function EditTaskDialog({ open, onOpenChange, task, milestoneId }) {
  const { updateTask } = useMilestonesStore();
  const { register, setValue, handleSubmit } = useForm();

  useEffect(() => {
    if (task) {
      setValue("title", task.title || "");
      setValue("description", task.description || "");
      setValue("startDate", task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : "");
      setValue("dueDate", task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");
    }
  }, [task, setValue]);

  const onSubmit = async (data) => {
    await updateTask(milestoneId, task.id, {
      ...data,
      startDate: new Date(data.startDate),
      dueDate: new Date(data.dueDate),
    });
    onOpenChange(false);
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Update the task details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("title")} placeholder="Task Title" />
          <Input {...register("description")} placeholder="Task Description" />
          <div className="grid grid-cols-2 gap-4">
            <Input {...register("startDate")} type="date" />
            <Input {...register("dueDate")} type="date" />
          </div>
          {task.assignedTo && (
            <div className="text-sm text-muted-foreground">
              Assigned to: {task.assignedTo.name}
            </div>
          )}
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
