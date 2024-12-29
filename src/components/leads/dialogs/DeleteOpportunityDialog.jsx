// components/leads/dialogs/DeleteOpportunityDialog.jsx
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
import { Loader2, AlertTriangle, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useLeadsStore from "@/store/useLeadsStore2";
import { Badge } from "@/components/ui/badge";

export default function DeleteOpportunityDialog({ 
    open, 
    onOpenChange, 
    opportunity,
    contact,
    onSuccess 
}) {
    const [isLoading, setIsLoading] = useState(false);
    const { updateLead } = useLeadsStore();
    const { toast } = useToast();

    const handleDelete = async () => {
        try {
            setIsLoading(true);

            // Filtrar la oportunidad del array
            const updatedOpportunities = contact.opportunities.filter(
                opp => opp !== opportunity
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
                    description: "Opportunity deleted successfully",
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
                description: error.message || "Failed to delete opportunity",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!opportunity) return null;

    // Formatear valor para mostrar
    const formatValue = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value).replace(/^(\D+)/, '$');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Delete Opportunity
                    </DialogTitle>
                    <DialogDescription className="space-y-4">
                        {/* Detalles de la oportunidad */}
                        <div className="mt-2 p-4 bg-muted rounded-md space-y-3">
                            {/* Productos */}
                            <div className="flex flex-wrap gap-2">
                                {opportunity.titles.map((title, index) => (
                                    <Badge key={index} variant="secondary">
                                        {title}
                                    </Badge>
                                ))}
                            </div>
                            {/* Stage y Valor */}
                            <div className="flex items-center justify-between text-sm">
                                <Badge variant="outline" className="bg-blue-50 text-blue-600">
                                    {opportunity.stage}
                                </Badge>
                                <span className="flex items-center gap-1 font-medium text-green-600">
                                    <DollarSign className="h-4 w-4" />
                                    {formatValue(opportunity.value)}
                                </span>
                            </div>
                            {/* Descripción */}
                            {opportunity.description && (
                                <p className="text-sm text-muted-foreground">
                                    {opportunity.description}
                                </p>
                            )}
                        </div>
                        <p className="text-red-600 font-semibold text-sm pt-2">
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
                            'Delete Opportunity'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}