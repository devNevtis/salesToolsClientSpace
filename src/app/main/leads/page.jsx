// src/app/main/leads/page.jsx
'use client';

import { useEffect } from 'react';
import withAuth from '@/components/withAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import useLeadsStore from '@/store/useLeadsStore'; // Asegúrate que es el store correcto
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
    useLeadsStore(); // Asumiendo que este store también tiene fetchBusinesses

  // useEffect para cargar datos (sin cambios)
  useEffect(() => {
    if (user) {
      // Si fetchBusinesses viene de otro store, ajústalo
      fetchBusinesses(user);
    }
  }, [user, fetchBusinesses]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // useEffect para tema (sin cambios)
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
    console.log('Import leads clicked');
  };
  console.log(user);

  return (
    // Usamos el padding de MainLayout (p-4 md:p-6), así que no añadimos container mx-auto px-4 aquí
    <div>
      <Tabs defaultValue="leads" className="w-full">
        {/* Header con Título y TabsList (layout responsivo sin cambios) */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
          <h1 className="text-2xl font-bold text-[var(--theme-base1)] shrink-0 mr-4">
            {' '}
            {/* Añadido shrink-0 y mr-4 */}
            Sales Pipeline
          </h1>

          {/* --- AJUSTE RESPONSIVO TabsList --- */}
          {/* Añadimos overflow-x-auto para scroll horizontal */}
          {/* Añadimos whitespace-nowrap para asegurar que los triggers no salten de línea */}
          {/* Añadimos clases para ocultar la barra de scroll visualmente (opcional pero común) */}
          <TabsList
            className="relative bg-card border rounded-lg p-1 h-auto overflow-x-auto whitespace-nowrap
                             scrollbar-hide md:overflow-x-visible md:whitespace-normal"
          >
            {/* scrollbar-hide es una utilidad común, si no la tienes definida, puedes omitirla
                o añadirla a tu globals.css: .scrollbar-hide::-webkit-scrollbar { display: none; }
                                            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; } */}
            {/* En pantallas md+, volvemos a overflow visible y whitespace normal si es necesario */}

            {/* Triggers sin cambios internos, pero ahora scrollearán horizontalmente en móvil */}
            <TabsTrigger
              value="leads"
              className="px-2 md:px-4 py-2 rounded-md transition-all data-[state=active]:bg-[var(--theme-base1)] data-[state=active]:text-[var(--theme-highlighting)]"
            >
              <div className="flex flex-col items-center gap-1">
                {' '}
                <span className="font-medium">Leads</span>{' '}
                <span className="hidden md:block text-xs">Active Pipeline</span>{' '}
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              className="px-2 md:px-4 py-2 rounded-md transition-all data-[state=active]:bg-[var(--theme-base1)] data-[state=active]:text-[var(--theme-highlighting)]"
            >
              <div className="flex flex-col items-center gap-1">
                {' '}
                <span className="font-medium">Customers</span>{' '}
                <span className="hidden md:block text-xs">Won Deals</span>{' '}
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="opportunities"
              className="px-2 md:px-4 py-2 rounded-md transition-all data-[state=active]:bg-[var(--theme-base1)] data-[state=active]:text-[var(--theme-highlighting)]"
            >
              <div className="flex flex-col items-center gap-1">
                {' '}
                <span className="text-sm md:text-base font-medium">
                  Oportunities
                </span>{' '}
                <span className="hidden md:block text-xs">Key products</span>{' '}
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="milestones"
              className="px-2 md:px-4 py-2 rounded-md transition-all data-[state=active]:bg-[var(--theme-base1)] data-[state=active]:text-[var(--theme-highlighting)]"
            >
              <div className="flex flex-col items-center gap-1">
                {' '}
                <span className="text-sm md:text-base font-medium">
                  Milestones
                </span>{' '}
                <span className="hidden md:block text-xs">Key Events</span>{' '}
              </div>
            </TabsTrigger>
          </TabsList>
          {/* --- FIN AJUSTE --- */}
        </div>

        {/* Contenido de las pestañas (sin cambios) */}
        <TabsContent value="leads">
          {/* Header interno de Leads Tab (sin cambios) */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            {' '}
            {/* Layout responsivo para acciones/búsqueda */}
            <div className="flex gap-2">
              {' '}
              {/* Botones Import/Create */}
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleImportLeads}
              >
                <Upload className="h-4 w-4" /> Import Leads
              </Button>
              <LeadCreationDialog
                onLeadCreated={() => {
                  if (user) {
                    fetchBusinesses(user);
                  }
                }}
              />
            </div>
            {/* Search and Column Visibility */}
            <div className="flex gap-2 items-center">
              {' '}
              {/* Agrupados */}
              <div className="relative flex-1 sm:flex-initial">
                {' '}
                {/* Input toma espacio en móvil */}
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search businesses..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-9 w-full md:w-[300px]"
                />
              </div>
              <ColumnsVisibilityDialog />
            </div>
          </div>

          {/* Loading State o DataTable (sin cambios) */}
          {isLoading ? (
            <div className="flex justify-center items-center h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <LeadsDataTable />
          )}
        </TabsContent>

        <TabsContent value="customers">
          <CustomersTab />
        </TabsContent>
        <TabsContent value="opportunities">
          <OpportunitiesTab />
        </TabsContent>
        <TabsContent value="milestones">
          <MilestonesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withAuth(LeadsPage);
