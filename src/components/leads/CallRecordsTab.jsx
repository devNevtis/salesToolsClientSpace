'use client';

import { Loader2, Pencil, StickyNote, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '../ui/button';

const CallRecordsTab = ({ callRecords }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isEditNoteOpen, setIsEditNoteOpen] = useState(false);
  const [deletingNote, setDeletingNote] = useState(null);
  const [isDeleteNoteOpen, setIsDeleteNoteOpen] = useState(false);

  console.log(callRecords);
  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4 h-[57vh]">
      {/* Header con búsqueda y botón de añadir */}
      {/*             <div className="flex justify-between items-center gap-4">
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
            </div> */}
      <div className="h-[55vh] overflow-y-auto">
        {/* Lista de notas */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : callRecords.length === 0 ? (
            <div className="text-center py-8">
              <StickyNote className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? 'No call notes match your search'
                  : 'No call notes yet'}
              </p>
            </div>
          ) : (
            callRecords.map((call) => (
              <Card
                key={call._id || call.createdAt}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{call.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(call.createdAt)}
                      {call.updatedAt && call.updatedAt !== call.createdAt && (
                        <span className="ml-2 text-xs">
                          (Edited: {formatDate(call.updatedAt)})
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      /* onClick={() => handleEditClick(note)} */
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      /* onClick={() => handleDeleteClick(note)} */
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-sm whitespace-pre-wrap">
                  {call.description}
                </p>
                {call.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {call.tags.map((tag, index) => (
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
        {/*                 <AddNoteDialog
                    open={isAddNoteOpen}
                    onOpenChange={setIsAddNoteOpen}
                    contact={primaryContact}
                    onSuccess={handleRefreshData}
                /> */}
        {/*                 <EditNoteDialog
                    open={isEditNoteOpen}
                    onOpenChange={(open) => {
                        setIsEditNoteOpen(open);
                        if (!open) setEditingNote(null);
                    }}
                    note={editingNote}
                    contact={primaryContact}
                    onSuccess={handleRefreshData}
                /> */}
        {/*                <DeleteNoteDialog
                    open={isDeleteNoteOpen}
                    onOpenChange={(open) => {
                        setIsDeleteNoteOpen(open);
                        if (!open) setDeletingNote(null);
                    }}
                    note={deletingNote}
                    contact={primaryContact}
                    onSuccess={handleRefreshData}
                /> */}
      </div>
    </div>
  );
};

export default CallRecordsTab;
