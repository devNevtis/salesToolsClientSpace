'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const callRecordSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  tags: z.string().optional(),
});

export default function EditCallRecordDialog({
  open,
  onOpenChange,
  callRecord,
  onSuccess,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(callRecordSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: '',
    },
  });

  useEffect(() => {
    if (callRecord && open) {
      form.reset({
        title: callRecord.title,
        description: callRecord.description,
        tags: callRecord.tags ? callRecord.tags.join(', ') : '',
      });
    }
  }, [callRecord, open, form]);

  const onSubmit = async (data) => {
    if (!callRecord?._id) return;

    try {
      setIsLoading(true);

      const tagsArray = data.tags
        ? data.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
        : [];

      const updatedCallRecord = {
        ...callRecord,
        title: data.title,
        description: data.description,
        tags: tagsArray,
      };

      await axiosInstance.put(
        `https://api.nevtis.com/dialtools/call-notes/update/${callRecord._id}`,
        updatedCallRecord
      );

      toast({
        title: 'Success',
        description: 'Call record updated successfully',
        variant: 'success',
      });

      onSuccess?.(updatedCallRecord);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to update call record',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Call Record</DialogTitle>
          <DialogDescription>Modify the call record details.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Call record title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe the call details..."
                      className="min-h-[100px] resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter tags separated by commas (e.g., urgent, client, follow-up)"
                    />
                  </FormControl>
                  <FormDescription>Separate tags with commas</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
