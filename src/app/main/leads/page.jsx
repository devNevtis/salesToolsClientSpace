// src/app/main/leads/page.jsx
'use client';

import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import useLeadsStore from "@/store/useLeadsStore";
import { 
  Upload, 
  UserPlus, 
  LayoutGrid, 
  Search,
  Loader2 
} from "lucide-react";
import LeadsDataTable from "@/components/leads/LeadsDataTable";
import CustomersTab from "@/components/customers/CustomersTab";
import ColumnsVisibilityDialog from "@/components/leads/ColumnsVisibilityDialog";
import { Card } from "@/components/ui/card";
import LeadCreationDialog from "@/components/leads/LeadCreationDialog";
import MilestonesTab from "@/components/milestones/MilestonesTab";

export default function LeadsPage() {
  const { user } = useAuth();
  const { 
    fetchBusinesses, 
    setSearchTerm,
    searchTerm,
    isLoading,
    error 
  } = useLeadsStore();

  //console.log(error)

  useEffect(() => {
    if (user) {
      fetchBusinesses(user);
    }
  }, [user, fetchBusinesses]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleImportLeads = () => {
    // TODO: Implementar importación de leads
    console.log('Import leads clicked');
  };

/*   if (error) {
    return (
      <div className="p-6">
        <Card className="p-4 bg-red-50 text-red-600">
          <p>Error loading leads: {error}</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => fetchBusinesses(user)}
          >
            Retry
          </Button>
        </Card>
      </div>
    );
  } */

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="leads" className="w-full">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
          <h1 className="text-2xl font-bold">Sales Pipeline</h1>
          <TabsList className="bg-card border rounded-lg p-1 h-auto">
            <TabsTrigger 
              value="leads" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-md transition-all"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="font-medium">Leads</span>
                <span className="text-xs text-muted-foreground">Active Pipeline</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="customers" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-md transition-all"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="font-medium">Customers</span>
                <span className="text-xs text-muted-foreground">Won Deals</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="milestones" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-md transition-all"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="font-medium">Milestones</span>
                <span className="text-xs text-muted-foreground">Key Events</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Leads Tab Content */}
        <TabsContent value="leads">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleImportLeads}
              >
                <Upload className="h-4 w-4" />
                Import Leads
              </Button>
              <LeadCreationDialog 
                onLeadCreated={() => {
                  if (user) {
                    fetchBusinesses(user);
                  }
                }} 
              />
            </div>
          </div>

          {/* Search and Column Visibility */}
          <div className="flex justify-between items-center mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search businesses..."
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
            <LeadsDataTable />
          )}
        </TabsContent>

        {/* Customers Tab Content */}
        <TabsContent value="customers">
          <CustomersTab />
        </TabsContent>

        {/* Milestones Tab Content - Placeholder */}
        <TabsContent value="milestones">
          <MilestonesTab/>
        </TabsContent>
      </Tabs>
    </div>
  );
}