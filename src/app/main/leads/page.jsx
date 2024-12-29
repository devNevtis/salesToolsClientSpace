//src/app/main/leads/page.jsx
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
import ColumnsVisibilityDialog from "@/components/leads/ColumnsVisibilityDialog";
import { Card } from "@/components/ui/card";
import LeadCreationDialog from "@/components/leads/LeadCreationDialog";

export default function LeadsPage() {
  const { user } = useAuth();
  const { 
    fetchBusinesses, 
    setSearchTerm,
    searchTerm,
    isLoading,
    error 
  } = useLeadsStore();

  useEffect(() => {
    if (user) {
      fetchBusinesses(user);
    }
  }, [user, fetchBusinesses]);

  // Manejadores de eventos
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  //console.log(user)

  const handleImportLeads = () => {
    // TODO: Implementar importación de leads
    console.log('Import leads clicked');
  };

  if (error) {
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
  }

  return (
    <div className="p-6">
      {/* Tabs Container */}
      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="w-full bg-card border-b rounded-none">
          <TabsTrigger 
            value="leads" 
            className="data-[state=active]:bg-background rounded-none"
          >
            Leads
          </TabsTrigger>
          <TabsTrigger 
            value="customers"
            className="data-[state=active]:bg-background rounded-none"
          >
            Customers
          </TabsTrigger>
          <TabsTrigger 
            value="milestones"
            className="data-[state=active]:bg-background rounded-none"
          >
            Milestones
          </TabsTrigger>
        </TabsList>

        {/* Leads Tab Content */}
        <TabsContent value="leads" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <LayoutGrid className="h-6 w-6" />
              Leads
            </h1>
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
{/*               <Button 
                className="flex items-center gap-2"
                onClick={handleAddLead}
              >
                <UserPlus className="h-4 w-4" />
                Add Lead
              </Button> */}
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

        {/* Customers Tab Content - Placeholder */}
        <TabsContent value="customers">
          <div className="flex items-center justify-center h-[50vh]">
            <p className="text-muted-foreground">Customers section coming soon...</p>
          </div>
        </TabsContent>

        {/* Milestones Tab Content - Placeholder */}
        <TabsContent value="milestones">
          <div className="flex items-center justify-center h-[50vh]">
            <p className="text-muted-foreground">Milestones section coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}