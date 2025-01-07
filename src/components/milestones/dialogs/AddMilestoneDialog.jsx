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

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] px-6 py-5 [&_button[aria-label='Close']]:opacity-40 [&_button[aria-label='Close']]:hover:opacity-60 [&_button[aria-label='Close']>svg]:h-3 [&_button[aria-label='Close']>svg]:w-3">
        <DialogHeader className="space-y-2 pb-3">
          <DialogTitle>Create New Milestone</DialogTitle>
          <DialogDescription className="text-slate-500 text-sm font-normal">
            Add a new milestone for this lead. You can add tasks after creating the milestone.
          </DialogDescription>
        </DialogHeader>
 
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                Create Milestone
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}