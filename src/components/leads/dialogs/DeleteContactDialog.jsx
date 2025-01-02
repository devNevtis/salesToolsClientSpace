// components/leads/dialogs/DeleteContactDialog.jsx
"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogPortal,
    DialogOverlay
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useLeadsStore from "@/store/useLeadsStore2";
/* import { DialogPortal } from "@/components/ui/DialogPortal"; */

export default function DeleteContactDialog({ 
    open, 
    onOpenChange, 
    contact,
    onSuccess 
}) {
    const [isLoading, setIsLoading] = useState(false);
    const { deleteLead } = useLeadsStore();
    const { toast } = useToast();

    const handleDelete = async () => { 
        try {
            setIsLoading(true);
            const result = await deleteLead(contact._id);

            if (result.success) {
                toast({
                    title: "Success",
                    description: "Contact deleted successfully",
                    variant: "success",
                });
                onSuccess?.();
                onOpenChange(false);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete contact",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!contact) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Delete Contact
                    </DialogTitle>
                    <DialogDescription className="space-y-2">
                        Are you sure you want to delete {contact.firstName} {contact.lastName}?
                        <p className="font-semibold text-red-600">
                            This action cannot be undone.
                        </p>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            onOpenChange(false);
                            setIsLoading(false); // Asegura que no quede en estado de carga.
                        }}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Delete Contact'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}