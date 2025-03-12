'use client';

import { useState } from 'react';
import axiosInstance from '@/lib/axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DeleteCallRecordDialog({
  open,
  onOpenChange,
  callRecord,
  onSuccess,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!callRecord?._id) return;

    try {
      setIsLoading(true);
      await axiosInstance.delete(
        `https://api.nevtis.com/dialtools/call-notes/delete/${callRecord._id}`
      );

      toast({
        title: 'Success',
        description: 'Call record deleted successfully',
        variant: 'success',
      });

      onSuccess?.(callRecord._id);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to delete call record',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!callRecord) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Call Record
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this call record? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
