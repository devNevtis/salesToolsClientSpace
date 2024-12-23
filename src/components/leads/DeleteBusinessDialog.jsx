// src/components/leads/DeleteBusinessDialog.jsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useDeleteBusinessStore from '@/store/useDeleteBusinessStore';
import { Loader2, AlertTriangle } from "lucide-react";
import useLeadsStore from "@/store/useLeadsStore";
import { useAuth } from "@/components/AuthProvider";

export default function DeleteBusinessDialog() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { fetchBusinesses } = useLeadsStore();
  const {
    isOpen,
    closeDialog,
    business,
    associatedContacts,
    deleteBusiness,
    isLoading,
    error
  } = useDeleteBusinessStore();

  useEffect(() => {
    if (!isOpen) {
      document.body.style.pointerEvents = 'auto';
    }
  }, [isOpen]);

  const handleDelete = async () => {
    try {
      await deleteBusiness();
      await fetchBusinesses(user);
      
      toast({
        title: "Successfully deleted",
        description: "The business and its associated contacts have been deleted.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error deleting",
        description: err.message || "There was a problem deleting the business."
      });
    }
  };

  if (!business) return null;


  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete <span className="font-medium">{business.name}</span>?
            </p>
            {associatedContacts.length > 0 && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 font-medium">
                  Warning: This will also delete:
                </p>
                <p className="text-sm text-red-600">
                  • {associatedContacts.length} associated contact{associatedContacts.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
            <p className="text-sm text-red-600 font-semibold mt-4">
              This action cannot be undone.
            </p>
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="text-sm text-red-500 mt-2">
            {error}
          </div>
        )}
        
        <DialogFooter className="flex gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={closeDialog}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}