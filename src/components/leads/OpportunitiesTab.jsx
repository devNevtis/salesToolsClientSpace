// components/leads/OpportunitiesTab.jsx
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Search, 
    Plus, 
    Loader2, 
    Briefcase,
    Pencil,
    Trash2,
    DollarSign
} from "lucide-react";
import useBusinessStore from "@/store/useBusinessStore";
import useLeadsStore from "@/store/useLeadsStore2";
import useOpportunitiesStore from "@/store/useOpportunitiesStore";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import AddOpportunityDialog from "./dialogs/AddOpportunityDialog";
import EditOpportunityDialog from "./dialogs/EditOpportunityDialog";
import DeleteOpportunityDialog from "./dialogs/DeleteOpportunityDialog";

export default function OpportunitiesTab({ businessId }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingOpportunity, setEditingOpportunity] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [deletingOpportunity, setDeletingOpportunity] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    
    const { 
        businesses, 
        getBusinessContacts, 
        fetchContacts 
    } = useBusinessStore();

    const { fetchLeads } = useLeadsStore();

    const {
        fetchProducts,
        fetchStages,
        isLoadingProducts,
        isLoadingStages
    } = useOpportunitiesStore();

    const { toast } = useToast();

    // Función para refrescar los datos
    const handleRefreshData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                fetchContacts(), 
                fetchLeads(),
                fetchProducts(),
                fetchStages()
            ]);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to refresh opportunities",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleRefreshData();
    }, [fetchContacts, fetchLeads, fetchProducts, fetchStages]);

    // Obtener el business y su primer contacto
    const business = businesses.find(b => b._id === businessId);
    const contacts = getBusinessContacts(businessId);
    const primaryContact = contacts[0];

    // Funciones para manejar acciones
    const handleEditClick = (opportunity) => {
        setEditingOpportunity(opportunity);
        setIsEditOpen(true);
    };

    const handleDeleteClick = (opportunity) => {
        setDeletingOpportunity(opportunity);
        setIsDeleteOpen(true);
    };

    // Filtrar oportunidades basado en la búsqueda
    const filteredOpportunities = primaryContact?.opportunities?.filter(opp => 
        opp.titles.some(title => title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        opp.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.stage?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    // Formatear valor para mostrar
    const formatValue = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value).replace(/^(\D+)/, '$');
    };

    if (!primaryContact) {
        return (
            <div className="flex flex-col items-center justify-center h-[57vh] text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Contact Available</h3>
                <p className="text-sm text-muted-foreground mt-2">
                    Please add a contact to this lead before adding opportunities.
                </p>
            </div>
        );
    }

    // Estado de carga inicial
    if (isLoading || isLoadingProducts || isLoadingStages) {
        return (
            <div className="flex flex-col items-center justify-center h-[57vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-2">Loading opportunities...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 h-[57vh]">
            {/* Header con búsqueda y botón de añadir */}
            <div className="flex justify-between items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search opportunities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4"
                    />
                </div>
                <Button 
                    onClick={() => setIsAddOpen(true)}
                    className="gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add Opportunity
                </Button>
            </div>
            
            {/* Lista scrolleable de oportunidades */}
            <div className="h-[55vh] overflow-y-auto">
                <div className="space-y-4">
                    {filteredOpportunities.length === 0 ? (
                        <div className="text-center py-8">
                            <Briefcase className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                                {searchQuery ? "No opportunities match your search" : "No opportunities yet"}
                            </p>
                        </div>
                    ) : (
                        filteredOpportunities.map((opportunity) => (
                            <Card key={opportunity._id} className="p-4 hover:shadow-md transition-shadow">
                                <div className="space-y-3"> {/* Cambiamos a estructura vertical */}
                                    <div className="flex justify-between items-start">
                                        {/* Header con título y acciones */}
                                        <div className="flex-1">
                                            {/* Títulos de productos como badges primarias */}
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {opportunity.titles.map((title, index) => (
                                                    <Badge key={index} variant="secondary" className="text-sm">
                                                        {title}
                                                    </Badge>
                                                ))}
                                            </div>
                                            {/* Nueva sección de stage y valor */}
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                                {/* Stage con estilo distintivo */}
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-muted-foreground">Stage:</span>
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-50">
                                                        {opportunity.stage}
                                                    </Badge>
                                                </div>
                                                {/* Valor con estilo distintivo */}
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-muted-foreground">Value:</span>
                                                    <span className="text-sm font-medium text-green-600">
                                                        {formatValue(opportunity.value)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Botones de acción */}
                                        <div className="flex gap-2 ml-4">
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleEditClick(opportunity)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleDeleteClick(opportunity)}
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    {/* Descripción */}
                                    {opportunity.description && (
                                        <p className="text-sm text-muted-foreground mt-2 pl-1">
                                            {opportunity.description}
                                        </p>
                                    )}
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            <AddOpportunityDialog
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
                contact={primaryContact}
                onSuccess={handleRefreshData}
            />

            <EditOpportunityDialog
                open={isEditOpen}
                onOpenChange={(open) => {
                    setIsEditOpen(open);
                    if (!open) setEditingOpportunity(null);
                }}
                opportunity={editingOpportunity}
                contact={primaryContact}
                onSuccess={handleRefreshData}
            />

            <DeleteOpportunityDialog
                open={isDeleteOpen}
                onOpenChange={(open) => {
                    setIsDeleteOpen(open);
                    if (!open) setDeletingOpportunity(null);
                }}
                opportunity={deletingOpportunity}
                contact={primaryContact}
                onSuccess={handleRefreshData}
            />

        </div>
    );
}