// components/leads/AssociatedContactsSection.jsx
"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
    MoreHorizontal, 
    UserPlus, 
    Phone, 
    Mail, 
    Pencil, 
    Trash,
    User,
    Loader2
} from "lucide-react";
import useLeadsStore from "@/store/useLeadsStore2";
import useBusinessStore from "@/store/useBusinessStore";
import AddContactDialog from "./dialogs/AddContactDialog";
import EditContactDialog from "./dialogs/EditContactDialog";
import DeleteContactDialog from "./dialogs/DeleteContactDialog";
import { useDialogContext } from "@/contexts/DialogContext";


export default function AssociatedContactsSection({ businessId, currentStatus }) { // Añadimos currentStatus
    const [selectedContact, setSelectedContact] = useState(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { registerOverlay, unregisterOverlay } = useDialogContext();
    
    const { 
        businesses, 
        getBusinessContacts, 
        isLoadingContacts,
        fetchContacts 
    } = useBusinessStore();
    
    const { fetchLeads } = useLeadsStore();

    // Efecto para cargar los datos inicialmente y después de cada operación
    useEffect(() => {
        const loadData = async () => {
            await Promise.all([fetchContacts(), fetchLeads()]);
        };
        loadData();
    }, [fetchContacts, fetchLeads]);

    // Añadir useEffect para manejar overlays
/*     useEffect(() => {
        if (isEditDialogOpen) {
          registerOverlay('edit-contact');
        } else {
          unregisterOverlay('edit-contact');
        }
      }, [isEditDialogOpen, registerOverlay, unregisterOverlay]); */
      useEffect(() => {
        if (isEditDialogOpen) {
            registerOverlay('edit-contact');
        } else {
            unregisterOverlay('edit-contact');
        }
        return () => unregisterOverlay('edit-contact');
    }, [isEditDialogOpen, registerOverlay, unregisterOverlay]);
  
      useEffect(() => {
        if (isDeleteDialogOpen) {
            registerOverlay('delete-contact');
        } else {
            unregisterOverlay('delete-contact');
        }
        return () => unregisterOverlay('delete-contact');
    }, [isDeleteDialogOpen, registerOverlay, unregisterOverlay]);

    const business = businesses.find(b => b._id === businessId);
    const contacts = getBusinessContacts(businessId);

    const handleAddSuccess = async () => {
        await Promise.all([fetchContacts(), fetchLeads()]);
    };

    if (!business) return null;

    // Función para obtener el estilo del badge según el status
    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case 'new':
                return 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20';
            case 'qualified':
                return 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20';
            case 'discussion':
                return 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20';
            case 'negotiation':
                return 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20';
            case 'won':
                return 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20';
            case 'lost':
                return 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20';
            default:
                return 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20';
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-medium">Associated Contacts</CardTitle>
                <Button 
                    size="sm" 
                    className="gap-2"
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    <UserPlus className="h-4 w-4" />
                    Add Contact
                </Button>
            </CardHeader>
            <CardContent>
                {isLoadingContacts ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : contacts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <User className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No contacts associated with this lead yet.</p>
                        <Button 
                            variant="link" 
                            className="mt-2"
                            onClick={() => setIsAddDialogOpen(true)}
                        >
                            Add your first contact
                        </Button>
                    </div>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contacts.map((contact) => (
                                    <TableRow key={contact._id}>
                                        <TableCell className="font-medium">
                                            {contact.firstName} {contact.lastName}
                                        </TableCell>
                                        <TableCell>
                                            {contact.email && (
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    {contact.email}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {contact.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                                    {contact.phone}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusBadgeStyle(contact.status)}`}>
                                                {contact.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();  // Añadir esto
                                                            setSelectedContact(contact);
                                                            setIsEditDialogOpen(true);
                                                        }}
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit Contact
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();  // Añadir esto
                                                            setSelectedContact(contact);
                                                            setIsDeleteDialogOpen(true);
                                                        }}
                                                        className="text-red-600"
                                                    >
                                                        <Trash className="mr-2 h-4 w-4" />
                                                        Delete Contact
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>

            {/* Add Contact Dialog - Pasamos el currentStatus */}
            <AddContactDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                business={business}
                currentStatus={currentStatus} // Pasamos el status actual
                onSuccess={handleAddSuccess}
            />

            <EditContactDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                contact={selectedContact}
                business={business}
                currentStatus={currentStatus} // Pasamos el status actual
                onSuccess={handleAddSuccess}
            />

            <DeleteContactDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                contact={selectedContact}
                onSuccess={handleAddSuccess}
            />
        </Card>
    );
}