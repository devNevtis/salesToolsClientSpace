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
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useMilestonesStore from '@/store/useMilestonesStore';

export default function AddMilestoneDialog({ 
  open, 
  onOpenChange 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { selectedLeadId, addMilestone } = useMilestonesStore();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
    }
  });

  const onSubmit = async (data) => {
    if (!selectedLeadId) {
      toast({
        title: "Error",
        description: "Please select a lead first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const newMilestone = {
        id: `m-${Date.now()}`,
        leadId: selectedLeadId,
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        dueDate: new Date(data.dueDate),
        progress: 0,
        status: 'planned',
        tasks: [],
        notifications: true
      };

      addMilestone(newMilestone);
      
      toast({
        title: "Success",
        description: "Milestone created successfully"
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create milestone",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6">
        {/* Custom Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-500"
        >
          <X className="h-4 w-4" />
        </button>

        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl">Create New Milestone</DialogTitle>
          <DialogDescription className="text-slate-500 text-sm">
            Add a new milestone for this lead. You can add tasks after creating the milestone.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm text-slate-600">Title</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter milestone title" 
                      className="border-slate-200 focus:ring-0 focus:border-slate-300 py-1.5"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm text-slate-600">Description</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter milestone description" 
                      className="border-slate-200 focus:ring-0 focus:border-slate-300 py-1.5"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm text-slate-600">Start Date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="text"
                          readOnly
                          value={field.value ? new Date(field.value).toLocaleDateString() : ''}
                          onClick={() => {
                            const dateInput = document.createElement('input');
                            dateInput.type = 'date';
                            dateInput.value = field.value;
                            dateInput.onchange = (e) => field.onChange(e.target.value);
                            dateInput.click();
                          }}
                          className="border-slate-200 focus:ring-0 focus:border-slate-300 py-1.5 cursor-pointer"
                        />
                        <svg 
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm text-slate-600">Due Date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="text"
                          readOnly
                          value={field.value ? new Date(field.value).toLocaleDateString() : ''}
                          onClick={() => {
                            const dateInput = document.createElement('input');
                            dateInput.type = 'date';
                            dateInput.value = field.value;
                            dateInput.onchange = (e) => field.onChange(e.target.value);
                            dateInput.click();
                          }}
                          className="border-slate-200 focus:ring-0 focus:border-slate-300 py-1.5 cursor-pointer"
                        />
                        <svg 
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="text-slate-500 hover:text-slate-600 text-sm"
              >
                Cancel
              </button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-[#0f172a] hover:bg-[#0f172a]/90 text-white rounded-md px-4 py-2 text-sm"
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