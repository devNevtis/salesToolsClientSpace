// src/components/milestones/dialogs/EditTaskDialog.jsx
'use client';

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useMilestonesStore from "@/store/useMilestonesStore";

export default function EditTaskDialog({ open, onOpenChange, task, milestoneId }) {
  const { updateTask } = useMilestonesStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    dueDate: "",
  });

  useEffect(() => {
    console.log("Task loaded into dialog:", task); // Debug: Verificar datos iniciales
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        startDate: task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : "",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
      });
    }
  }, [task]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(`Field changed: ${name} = ${value}`); // Debug: Verificar cambios
  };

  const handleSubmit = () => {
    console.log("Submit button clicked with:", { milestoneId, task }); // Debug
    if (!task || !milestoneId) {
      console.error("Missing task or milestoneId");
      return;
    }
  
    updateTask(milestoneId, task.id, {
      ...task,
      ...formData,
      startDate: new Date(formData.startDate),
      dueDate: new Date(formData.dueDate),
    });
  
    console.log("Task updated successfully in store"); // Confirmación
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
        <div className="space-y-4">
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Task Title"
          />
          <Input
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Task Description"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
            />
            <Input
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleInputChange}
            />
          </div>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
