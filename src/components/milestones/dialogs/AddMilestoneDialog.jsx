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
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
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
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold">Create New Milestone</DialogTitle>
          <DialogDescription className="text-slate-500">
            Add a new milestone for this lead. You can add tasks after creating the milestone.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium">Title</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter milestone title" 
                      className="border-slate-200 focus-visible:ring-0 focus-visible:border-slate-400"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium">Description</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter milestone description" 
                      className="border-slate-200 focus-visible:ring-0 focus-visible:border-slate-400"
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
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Start Date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="date" 
                          {...field}
                          className="border-slate-200 focus-visible:ring-0 focus-visible:border-slate-400 pl-3 pr-10"
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Due Date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="date" 
                          {...field}
                          className="border-slate-200 focus-visible:ring-0 focus-visible:border-slate-400 pl-3 pr-10"
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end items-center gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="text-slate-600 hover:text-slate-800 hover:bg-transparent"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-[#0f172a] hover:bg-[#0f172a]/90 text-white px-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Milestone'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}