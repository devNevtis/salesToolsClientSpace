'use client';

import { useMessageDialogStore } from '@/store/useMessageDialogStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function MessageDialog() {
  const { isOpen, business, closeDialog } = useMessageDialogStore();

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Message to: {business?.name}</DialogTitle>
        </DialogHeader>
        <p>Phone: {business?.phone}</p>
      </DialogContent>
    </Dialog>
  );
}
