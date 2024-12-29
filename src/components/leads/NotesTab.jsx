// components/leads/NotesTab.jsx
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Search, 
    Plus, 
    Loader2, 
    StickyNote, 
    Pencil,
    Trash2
} from "lucide-react";
import useBusinessStore from "@/store/useBusinessStore";
import useLeadsStore from "@/store/useLeadsStore2";
import { useToast } from "@/hooks/use-toast";
import AddNoteDialog from "./dialogs/AddNoteDialog";
import EditNoteDialog from "./dialogs/EditNoteDialog";
import DeleteNoteDialog from "./dialogs/DeleteNoteDialog";

export default function NotesTab({ businessId }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [isEditNoteOpen, setIsEditNoteOpen] = useState(false);
    const [deletingNote, setDeletingNote] = useState(null); // Nuevo estado para la nota a eliminar
    const [isDeleteNoteOpen, setIsDeleteNoteOpen] = useState(false); // Nuevo estado para el diálogo de eliminación
    const { businesses, getBusinessContacts, fetchContacts } = useBusinessStore();
    const { fetchLeads } = useLeadsStore();
    const { toast } = useToast();

    // Función para refrescar los datos
    const handleRefreshData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([fetchContacts(), fetchLeads()]);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to refresh notes",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleRefreshData();
    }, [fetchContacts, fetchLeads]);

    // Obtener el business y su primer contacto
    const business = businesses.find(b => b._id === businessId);
    const contacts = getBusinessContacts(businessId);
    const primaryContact = contacts[0];

    // Funciones para manejar acciones
    const handleEditClick = (note) => {
        setEditingNote(note);
        setIsEditNoteOpen(true);
    };

    const handleDeleteClick = (note) => {
        setDeletingNote(note);
        setIsDeleteNoteOpen(true);
    };

    // Filtrar notas basado en la búsqueda
    const filteredNotes = primaryContact?.notes?.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

    // Formatear fecha para mostrar
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!primaryContact) {
        return (
            <div className="flex flex-col items-center justify-center h-[57vh] text-center">
                <StickyNote className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Contact Available</h3>
                <p className="text-sm text-muted-foreground mt-2">
                    Please add a contact to this lead before adding notes.
                </p>
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
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4"
                    />
                </div>
                <Button 
                    onClick={() => setIsAddNoteOpen(true)}
                    className="gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add Note
                </Button>
            </div>
            <div className="h-[55vh] overflow-y-auto">
                {/* Lista de notas */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredNotes.length === 0 ? (
                        <div className="text-center py-8">
                            <StickyNote className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                                {searchQuery ? "No notes match your search" : "No notes yet"}
                            </p>
                        </div>
                    ) : (
                        filteredNotes.map((note) => (
                            <Card key={note._id || note.createdAt} className="p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">{note.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {formatDate(note.createdAt)}
                                            {note.updatedAt && note.updatedAt !== note.createdAt && (
                                                <span className="ml-2 text-xs">
                                                    (Edited: {formatDate(note.updatedAt)})
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => handleEditClick(note)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => handleDeleteClick(note)}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="mt-2 text-sm whitespace-pre-wrap">{note.content}</p>
                                {note.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {note.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        ))
                    )}
                </div>

                {/* Diálogos */}
                <AddNoteDialog
                    open={isAddNoteOpen}
                    onOpenChange={setIsAddNoteOpen}
                    contact={primaryContact}
                    onSuccess={handleRefreshData}
                />

                <EditNoteDialog
                    open={isEditNoteOpen}
                    onOpenChange={(open) => {
                        setIsEditNoteOpen(open);
                        if (!open) setEditingNote(null);
                    }}
                    note={editingNote}
                    contact={primaryContact}
                    onSuccess={handleRefreshData}
                />

                <DeleteNoteDialog
                    open={isDeleteNoteOpen}
                    onOpenChange={(open) => {
                        setIsDeleteNoteOpen(open);
                        if (!open) setDeletingNote(null);
                    }}
                    note={deletingNote}
                    contact={primaryContact}
                    onSuccess={handleRefreshData}
                />
            </div>
        </div>
    );
}