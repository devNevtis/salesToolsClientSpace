// src/components/milestones/dialogs/AddMilestoneDialog.jsx
'use client';

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useMilestonesStore from '@/store/useMilestonesStore';

export default function AddMilestoneDialog({ open, onOpenChange }) {
  const [isLoading, setIsLoading] = useState(false);
  const { createMilestone, selectedBusinessId, selectedLeadId } = useMilestonesStore();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data) => {
    if (!selectedLeadId) {
      toast({
        title: "Error",
        description: "Please select a business first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const newMilestone = {
        businessId: selectedLeadId, // Este es el ID del negocio seleccionado
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        dueDate: new Date(data.dueDate),
        progress: 0,
        status: 'planned',
        tasks: [], // Sin tareas inicialmente
        notifications: true,
      };

      // Llamamos al método de Zustand para enviar al backend
      await createMilestone(newMilestone);

      toast({
        title: "Success",
        description: "Milestone created successfully.",
      });

      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create milestone.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] px-6 py-5">
        <DialogHeader className="space-y-2 pb-3">
          <DialogTitle>Create New Milestone</DialogTitle>
          <DialogDescription className="text-slate-500 text-sm font-normal">
            Add a new milestone for this business. You can add tasks after creating the milestone.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm text-slate-600 font-normal">Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter milestone title"
                      className="h-9 border-slate-200 focus-visible:ring-0 focus-visible:border-slate-300"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm text-slate-600 font-normal">Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter milestone description"
                      className="h-9 border-slate-200 focus-visible:ring-0 focus-visible:border-slate-300"
                    />
                  </FormControl>
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
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="h-9 border-slate-200 pr-8 focus-visible:ring-0 focus-visible:border-slate-300"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm text-slate-600 font-normal">Due Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="h-9 border-slate-200 pr-8 focus-visible:ring-0 focus-visible:border-slate-300"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Actions */}
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
                Create Milestone
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
