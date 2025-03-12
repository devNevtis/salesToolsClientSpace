'use client';

import { useState } from 'react';
import { Loader2, Pencil, StickyNote, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DeleteCallRecordDialog from './dialogs/DeleteCallRecordDialog';
import EditCallRecordDialog from './dialogs/EditCallRecordDialog';

const CallRecordsTab = ({ callRecords, setCallRecords }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [deletingCallRecord, setDeletingCallRecord] = useState(null);
  const [isDeleteCallRecordOpen, setIsDeleteCallRecordOpen] = useState(false);
  const [editingCallRecord, setEditingCallRecord] = useState(null);
  const [isEditCallRecordOpen, setIsEditCallRecordOpen] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDeleteClick = (callRecord) => {
    setDeletingCallRecord(callRecord);
    setIsDeleteCallRecordOpen(true);
  };

  const handleDeleteSuccess = (deletedId) => {
    setCallRecords((prevRecords) =>
      prevRecords.filter((record) => record._id !== deletedId)
    );
  };

  const handleEditClick = (callRecord) => {
    setEditingCallRecord(callRecord);
    setIsEditCallRecordOpen(true);
  };

  const handleEditSuccess = (updatedCallRecord) => {
    setCallRecords((prevRecords) =>
      prevRecords.map((record) =>
        record._id === updatedCallRecord._id ? updatedCallRecord : record
      )
    );
  };

  return (
    <div className="space-y-4 h-[57vh]">
      <div className="h-[55vh] overflow-y-auto">
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : callRecords.length === 0 ? (
            <div className="text-center py-8">
              <StickyNote className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No call records yet.
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
                      onClick={() => handleEditClick(call)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(call)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-sm whitespace-pre-wrap">
                  {call.description}
                </p>
              </Card>
            ))
          )}
        </div>
      </div>

      <DeleteCallRecordDialog
        open={isDeleteCallRecordOpen}
        onOpenChange={(open) => {
          setIsDeleteCallRecordOpen(open);
          if (!open) setDeletingCallRecord(null);
        }}
        callRecord={deletingCallRecord}
        onSuccess={handleDeleteSuccess}
      />
      <EditCallRecordDialog
        open={isEditCallRecordOpen}
        onOpenChange={setIsEditCallRecordOpen}
        callRecord={editingCallRecord}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default CallRecordsTab;
