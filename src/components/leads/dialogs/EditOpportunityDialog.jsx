// components/leads/dialogs/EditOpportunityDialog.jsx
"use client";

import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import useLeadsStore from "@/store/useLeadsStore2";
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

export default function EditOpportunityDialog({ 
    open, 
    onOpenChange, 
    opportunity,
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

    // Cargar datos iniciales cuando se abre el diálogo
    useEffect(() => {
        if (opportunity && open) {
            // Convertir los títulos al formato de react-select
            const selectedTitles = opportunity.titles.map(title => ({
                value: title,
                label: title
            }));

            // Convertir el stage al formato de react-select
            const selectedStage = {
                value: opportunity.stage,
                label: opportunity.stage
            };

            form.reset({
                titles: selectedTitles,
                stage: selectedStage,
                description: opportunity.description,
                value: opportunity.value.toString()
            });
        }
    }, [opportunity, open, form]);

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);

            // Preparar la oportunidad actualizada
            const updatedOpportunity = {
                ...opportunity,
                titles: data.titles.map(product => product.value),
                stage: data.stage.value,
                description: data.description,
                value: data.value,
                updatedAt: new Date().toISOString()
            };

            // Actualizar el array de oportunidades
            const updatedOpportunities = contact.opportunities.map(opp => 
                opp === opportunity ? updatedOpportunity : opp
            );

            // Actualizar el contacto
            const updatedContact = {
                ...contact,
                opportunities: updatedOpportunities
            };

            const result = await updateLead(updatedContact);

            if (result.success) {
                toast({
                    title: "Success",
                    description: "Opportunity updated successfully",
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
                description: error.message || "Failed to update opportunity",
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
                    <DialogTitle>Edit Opportunity</DialogTitle>
                    <DialogDescription>
                        Make changes to the opportunity details.
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