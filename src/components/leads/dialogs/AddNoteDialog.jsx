// components/leads/dialogs/AddNoteDialog.jsx
"use client";

import { useState } from "react";
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

export default function AddNoteDialog({ 
    open, 
    onOpenChange, 
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

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);

            // Convertir el string de tags en array
            const tagsArray = data.tags
                ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                : [];

            // Preparar la nueva nota
            const newNote = {
                title: data.title,
                content: data.content,
                tags: tagsArray,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Actualizar el contacto con la nueva nota
            const updatedContact = {
                ...contact,
                notes: [...(contact.notes || []), newNote]
            };

            const result = await updateLead(updatedContact);

            if (result.success) {
                toast({
                    title: "Success",
                    description: "Note added successfully",
                    variant: "success",
                });
                onSuccess?.();
                onOpenChange(false);
                form.reset();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to add note",
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
                    <DialogTitle>Add New Note</DialogTitle>
                    <DialogDescription>
                        Create a new note for this lead.
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
                                onClick={() => {
                                    form.reset();
                                    onOpenChange(false);
                                }}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Note'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}