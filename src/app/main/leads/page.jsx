// src/app/main/leads/page.jsx
'use client';

import { useEffect } from 'react';
import withAuth from '@/components/withAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import useLeadsStore from '@/store/useLeadsStore';
import useCompanyTheme from '@/store/useCompanyTheme';
import { Upload, Search, Loader2 } from 'lucide-react';
import LeadsDataTable from '@/components/leads/LeadsDataTable';
import CustomersTab from '@/components/customers/CustomersTab';
import ColumnsVisibilityDialog from '@/components/leads/ColumnsVisibilityDialog';
import LeadCreationDialog from '@/components/leads/LeadCreationDialog';
import MilestonesTab from '@/components/milestones/MilestonesTab';
import OpportunitiesTab from '@/components/opportunities/OpportunitiesTab';

function LeadsPage() {
  const { theme } = useCompanyTheme();
  const { user } = useAuth();
  const { fetchBusinesses, setSearchTerm, searchTerm, isLoading, error } =
    useLeadsStore();

  useEffect(() => {
    if (user) {
      fetchBusinesses(user);
    }
  }, [user, fetchBusinesses]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (theme.base1) {
      document.documentElement.style.setProperty('--theme-base1', theme.base1);
    }
    if (theme.highlighting) {
      document.documentElement.style.setProperty(
        '--theme-highlighting',
        theme.highlighting
      );
    }
  }, [theme]);

  const handleImportLeads = () => {
    // TODO: Implementar importación de leads
    console.log('Import leads clicked');
  };
  //console.log(`data-[state=active]:bg-[${theme.base1}] data-[state=active]:text-primary-foreground px-4 py-2 rounded-md transition-all`)

  return (
    <div className="container mx-auto px-4">
      <Tabs defaultValue="leads" className="w-full">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
          <h1 className="text-2xl font-bold text-[var(--theme-base1)]">
            Sales Pipeline
          </h1>
          <TabsList className="bg-card border rounded-lg p-1 h-auto">
            <TabsTrigger
              value="leads"
              className="px-4 py-2 rounded-md transition-all data-[state=active]:bg-[var(--theme-base1)] data-[state=active]:text-[var(--theme-highlighting)]"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="font-medium">Leads</span>
                <span className="text-xs">Active Pipeline</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              className="px-4 py-2 rounded-md transition-all data-[state=active]:bg-[var(--theme-base1)] data-[state=active]:text-[var(--theme-highlighting)]"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="font-medium">Customers</span>
                <span className="text-xs">Won Deals</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="opportunities"
              className="px-4 py-2 rounded-md transition-all data-[state=active]:bg-[var(--theme-base1)] data-[state=active]:text-[var(--theme-highlighting)]"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="font-medium">Oportunities</span>
                <span className="text-xs">Key products</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="milestones"
              className="px-4 py-2 rounded-md transition-all data-[state=active]:bg-[var(--theme-base1)] data-[state=active]:text-[var(--theme-highlighting)]"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="font-medium">Milestones</span>
                <span className="text-xs">Key Events</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Leads Tab Content */}
        <TabsContent value="leads">
          <div className="flex justify-between">
            <div className="flex justify-between items-center mb-2">
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
            <div className="flex justify-between items-center mb-2">
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

        {/* Opportunities Tab Content */}
        <TabsContent value="opportunities">
          <OpportunitiesTab />
        </TabsContent>

        {/* Milestones Tab Content - Placeholder */}
        <TabsContent value="milestones">
          <MilestonesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withAuth(LeadsPage);
