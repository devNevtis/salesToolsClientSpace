// components/leads/dialogs/EditNoteDialog.jsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useLeadsStore from "@/store/useLeadsStore2";

const noteSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    tags: z.string().optional()
});

export default function EditNoteDialog({ 
    open, 
    onOpenChange, 
    note,
    contact,
    onSuccess 
}) {
    const [isLoading, setIsLoading] = useState(false);
    const { updateLead } = useLeadsStore();
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(noteSchema),
        defaultValues: {
            title: "",
            content: "",
            tags: ""
        }
    });

    // Actualizar el formulario cuando cambia la nota
    useEffect(() => {
        if (note && open) {
            form.reset({
                title: note.title,
                content: note.content,
                tags: note.tags ? note.tags.join(', ') : '' // Convertir array a string
            });
        }
    }, [note, open, form]);

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);

            // Convertir el string de tags en array
            const tagsArray = data.tags
                ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                : [];

            // Actualizar la nota existente
            const updatedNote = {
                ...note,
                title: data.title,
                content: data.content,
                tags: tagsArray,
                updatedAt: new Date().toISOString()
            };

            // Actualizar el arreglo de notas del contacto
            const updatedNotes = contact.notes.map(n => 
                n === note ? updatedNote : n
            );

            // Actualizar el contacto
            const updatedContact = {
                ...contact,
                notes: updatedNotes
            };

            const result = await updateLead(updatedContact);

            if (result.success) {
                toast({
                    title: "Success",
                    description: "Note updated successfully",
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
                description: error.message || "Failed to update note",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Note</DialogTitle>
                    <DialogDescription>
                        Make changes to your note.
                    </DialogDescription>
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
                                        <Input {...field} placeholder="Note title" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            {...field} 
                                            placeholder="Write your note here..." 
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
                                            placeholder="Enter tags separated by commas (e.g., important, follow-up, meeting)"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Separate tags with commas
                                    </FormDescription>
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