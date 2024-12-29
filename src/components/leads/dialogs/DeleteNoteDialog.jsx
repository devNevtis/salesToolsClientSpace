// components/leads/dialogs/DeleteNoteDialog.jsx
"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useLeadsStore from "@/store/useLeadsStore2";

export default function DeleteNoteDialog({ 
    open, 
    onOpenChange, 
    note,
    contact,
    onSuccess 
}) {
    const [isLoading, setIsLoading] = useState(false);
    const { updateLead } = useLeadsStore();
    const { toast } = useToast();

    const handleDelete = async () => {
        try {
            setIsLoading(true);

            // Filtrar la nota del arreglo de notas
            const updatedNotes = contact.notes.filter(n => n !== note);

            // Actualizar el contacto
            const updatedContact = {
                ...contact,
                notes: updatedNotes
            };

            const result = await updateLead(updatedContact);

            if (result.success) {
                toast({
                    title: "Success",
                    description: "Note deleted successfully",
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
                description: error.message || "Failed to delete note",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!note) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Delete Note
                    </DialogTitle>
                    <DialogDescription className="space-y-2">
                        <p>Are you sure you want to delete this note?</p>
                        <div className="mt-2 p-3 bg-muted rounded-md">
                            <p className="font-medium text-sm">{note.title}</p>
                            {note.tags?.length > 0 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Tags: {note.tags.join(', ')}
                                </p>
                            )}
                        </div>
                        <p className="text-red-600 font-semibold text-sm">
                            This action cannot be undone.
                        </p>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
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
                        className="gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Delete Note'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}