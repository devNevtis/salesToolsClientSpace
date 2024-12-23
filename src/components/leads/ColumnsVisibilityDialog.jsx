// src/components/leads/ColumnsVisibilityDialog.jsx
'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { LayoutGrid } from "lucide-react";
import useLeadsStore from "@/store/useLeadsStore";

export default function ColumnsVisibilityDialog() {
  const { 
    visibleColumns, 
    setVisibleColumns, 
    resetColumnsToDefault,
    availableColumns 
  } = useLeadsStore();

  const handleColumnToggle = (columnId) => {
    const column = availableColumns.find(col => col.id === columnId);
    if (column?.required) return;

    const newVisibleColumns = visibleColumns.includes(columnId)
      ? visibleColumns.filter(col => col !== columnId)
      : [...visibleColumns, columnId];

    setVisibleColumns(newVisibleColumns);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Show/Hide Columns</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            {availableColumns.map((column) => (
              <div key={column.id} className="flex items-center space-x-2">
                <Checkbox
                  id={column.id}
                  checked={visibleColumns.includes(column.id)}
                  onCheckedChange={() => handleColumnToggle(column.id)}
                  disabled={column.required}
                />
                <label
                  htmlFor={column.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {column.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={resetColumnsToDefault}
          >
            Reset to Default
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}