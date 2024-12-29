// components/leads/dialogs/AddOpportunityDialog.jsx
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Select from "react-select";
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
import { useToast } from "@/components/ui/use-toast";
import useLeadsStore from "@/store/useLeadsStore";
import useOpportunitiesStore from "@/store/useOpportunitiesStore";

const opportunitySchema = z.object({
    titles: z.array(z.object({
        value: z.string(),
        label: z.string()
    })).min(1, "At least one product must be selected"),
    stage: z.object({
        value: z.string(),
        label: z.string()
    }, {
        required_error: "Stage is required",
    }),
    description: z.string().min(1, "Description is required"),
    value: z.string().min(1, "Value is required")
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val) && val >= 0, "Value must be a positive number"),
});

export default function AddOpportunityDialog({ 
    open, 
    onOpenChange, 
    contact,
    onSuccess 
}) {
    const [isLoading, setIsLoading] = useState(false);
    const { updateLead } = useLeadsStore();
    const { products, stages, isLoadingProducts, isLoadingStages } = useOpportunitiesStore();
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(opportunitySchema),
        defaultValues: {
            titles: [],
            stage: null,
            description: "",
            value: "",
        }
    });

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);

            // Preparar la nueva oportunidad
            const newOpportunity = {
                titles: data.titles.map(product => product.value),
                stage: data.stage.value,
                description: data.description,
                value: data.value,
                createdAt: new Date().toISOString()
            };

            // Actualizar el contacto con la nueva oportunidad
            const updatedContact = {
                ...contact,
                opportunities: [...(contact.opportunities || []), newOpportunity]
            };

            const result = await updateLead(updatedContact);

            if (result.success) {
                toast({
                    title: "Success",
                    description: "Opportunity added successfully",
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
                description: error.message || "Failed to add opportunity",
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
                    <DialogTitle>Add New Opportunity</DialogTitle>
                    <DialogDescription>
                        Create a new opportunity for this lead.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Products Multi-select */}
                        <FormField
                            control={form.control}
                            name="titles"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Products</FormLabel>
                                    <FormControl>
                                        <Select
                                            {...field}
                                            isMulti
                                            options={products}
                                            isLoading={isLoadingProducts}
                                            className="min-h-[40px]"
                                            classNamePrefix="react-select"
                                            placeholder="Select products..."
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Select one or more products for this opportunity
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Stage Select */}
                        <FormField
                            control={form.control}
                            name="stage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stage</FormLabel>
                                    <FormControl>
                                        <Select
                                            {...field}
                                            options={stages}
                                            isLoading={isLoadingStages}
                                            className="min-h-[40px]"
                                            classNamePrefix="react-select"
                                            placeholder="Select stage..."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Value Input */}
                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value ($)</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            min="0"
                                            step="1"
                                            placeholder="Enter value..."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Enter opportunity description..."
                                            className="resize-none min-h-[100px]"
                                        />
                                    </FormControl>
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
                                    'Create Opportunity'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}