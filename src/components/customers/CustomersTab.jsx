// src/components/customers/CustomersTab.jsx
'use client';

import CustomersDataTable from "./CustomersDataTable";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import useLeadsStore from "@/store/useLeadsStore";
import ColumnsVisibilityDialog from "../leads/ColumnsVisibilityDialog";
import { Card } from "../ui/card";

export default function CustomersTab() {
  const { 
    setSearchTerm,
    searchTerm,
    isLoading,
    error 
  } = useLeadsStore();

  // Manejadores de eventos
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-4 bg-red-50 text-red-600">
          <p>Error loading customers: {error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Column Visibility */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-9 md:w-[300px]"
          />
        </div>
        <ColumnsVisibilityDialog />
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <CustomersDataTable />
      )}
    </div>
  );
}