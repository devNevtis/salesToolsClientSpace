// src/components/milestones/dialogs/AddTaskDialog.jsx
'use client';

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useMilestonesStore from '@/store/useMilestonesStore';
import useBusinessStore from '@/store/useBusinessStore';

export default function AddTaskDialog({ 
  open, 
  onOpenChange,
  milestone 
}) {

  const [isLoading, setIsLoading] = useState(false);
  const { addTask } = useMilestonesStore();
  const { getBusinessContacts } = useBusinessStore();
  const { contacts } = useMilestonesStore();
  const [subtasks, setSubtasks] = useState([]);
  const { updateMilestone } = useMilestonesStore();

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      assignedTo: '',
      status: 'pending'
    }
  });

  useEffect(() => {
    if (!document.getElementById("dialog-portal-root")) {
      const portalRoot = document.createElement("div");
      portalRoot.id = "dialog-portal-root";
      document.body.appendChild(portalRoot);
    }
  }, []);

  if (!milestone) return null;

  const addSubtask = () => {
    setSubtasks((prev) => [
      ...prev,
      { id: `st-${Date.now()}`, title: '', completed: false },
    ]);
  };

  const updateSubtask = (id, title) => {
    setSubtasks((prev) =>
      prev.map((subtask) =>
        subtask.id === id ? { ...subtask, title } : subtask
      )
    );
  };

  const removeSubtask = (id) => {
    setSubtasks((prev) => prev.filter((subtask) => subtask.id !== id));
  };

  

  const onSubmit = async (data) => {
    try {
      if (subtasks.length === 0) {
        alert("A task must have at least one subtask.");
        return;
      }
  
      const assignedContact = contacts.find(c => c._id === data.assignedTo);
      const newTask = {
        id: `t-${Date.now()}`,
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        dueDate: new Date(data.dueDate),
        status: 'planned', // Cambiar el estado inicial a planned
        progress: 0,
        assignedTo: assignedContact
          ? {
              id: assignedContact._id,
              type: 'contact',
              name: `${assignedContact.name}`,
            }
          : null,
        subtasks,
      };

        // Actualizamos el milestone con la nueva tarea
        const updatedMilestone = {
          ...milestone,
          tasks: [...milestone.tasks, newTask] // Añadimos la nueva tarea
        };

      // Llamamos al backend para actualizar el milestone con la nueva tarea
      await updateMilestone(milestone._id, updatedMilestone);
  
      /* await useMilestonesStore.getState().addTask(milestone.id, newTask); */
      form.reset();
      setSubtasks([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };
  
  

  //console.log(contacts);
  return (
    <Dialog key={milestone?.id || 'default-dialog'} open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] px-6 py-5">
        <DialogHeader className="space-y-2 pb-3">
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription className="text-slate-500 text-sm font-normal">
            Add a new task to &quot;{milestone.title}&quot;
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Task Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm text-slate-600 font-normal">Title</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter task title" 
                      className="h-9 border-slate-200 focus-visible:ring-0 focus-visible:border-slate-300"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Task Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm text-slate-600 font-normal">Description</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter task description" 
                      className="h-9 border-slate-200 focus-visible:ring-0 focus-visible:border-slate-300"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Assigned To */}
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm text-slate-600 font-normal">Assign to</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9 border-slate-200 focus:ring-0">
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contacts.map((contact) => (
                        <SelectItem 
                          key={contact._id} 
                          value={contact._id}
                        >
                          {contact.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm text-slate-600 font-normal">Start Date</FormLabel>
                    <div className="relative">
                      <Input 
                        type="date" 
                        {...field}
                        className="h-9 border-slate-200 pr-8 focus-visible:ring-0 focus-visible:border-slate-300"
                      />
                      <svg 
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm text-slate-600 font-normal">Due Date</FormLabel>
                    <div className="relative">
                      <Input 
                        type="date" 
                        {...field}
                        className="h-9 border-slate-200 pr-8 focus-visible:ring-0 focus-visible:border-slate-300"
                      />
                      <svg 
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Subtasks Section */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Subtasks</h4>
              {subtasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No subtasks added yet.</p>
              ) : (
                subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <Input
                      value={subtask.title}
                      onChange={(e) => updateSubtask(subtask.id, e.target.value)}
                      placeholder="Enter subtask title"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSubtask(subtask.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              )}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addSubtask}
              >
                Add Subtask
              </Button>
            </div>

            <div className="flex justify-end items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="text-slate-500 hover:text-slate-600 text-sm px-2"
              >
                Cancel
              </button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-[#0f172a] hover:bg-[#0f172a]/90 text-white px-4 py-1.5 h-8 text-sm font-normal"
              >
                Add Task
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
