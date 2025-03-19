// app/main/leads/[id]/page.jsx
'use client';

import { useEffect, Suspense, useState, useTransition } from 'react';
import withAuth from '@/components/withAuth';
import { useParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useLeadsStore from '@/store/useLeadsStore2';
import useBusinessStore from '@/store/useBusinessStore';
import { ChevronLeft, Loader2 } from 'lucide-react';
import LeadDetailHeader from '@/components/leads/LeadDetailHeader';
import EditLeadTab from '@/components/leads/EditLeadTab';
import NotesTab from '@/components/leads/NotesTab';
import OpportunitiesTab from '@/components/leads/OpportunitiesTab';
import CallRecords from '@/components/leads/CallRecords';
import { Button } from '@/components/ui/button';
import LeadEditSkeleton from '@/components/skeletons/LeadEditSkeleton';
import NotesSkeleton from '@/components/skeletons/NotesSkeleton';
import OpportunitiesSkeleton from '@/components/skeletons/OpportunitiesSkeleton';

function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id;
  const {
    businesses,
    isLoading: isLoadingBusiness,
    fetchBusinesses,
    getBusinessContacts,
  } = useBusinessStore();
  const { fetchLeads } = useLeadsStore();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState('edit');

  useEffect(() => {
    const currentBusiness = businesses.find((b) => b._id === leadId);
    if (!currentBusiness && !isLoadingBusiness) {
      fetchBusinesses();
      fetchLeads();
    }
  }, [leadId, businesses, isLoadingBusiness]);

  const handleTabChange = (value) => {
    startTransition(() => {
      setActiveTab(value);
      document.querySelector('#tab-content')?.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  };

  const currentBusiness = businesses.find((b) => b._id === leadId);
  const associatedContacts = currentBusiness
    ? getBusinessContacts(currentBusiness._id)
    : [];

  if (isLoadingBusiness) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!currentBusiness) {
    return (
      <div className="flex items-center justify-center h-[50vh] flex-col gap-4">
        <p className="text-muted-foreground">Lead not found</p>
        <Button
          variant="outline"
          onClick={() => router.push('/main/leads')}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Leads
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <LeadDetailHeader
        business={currentBusiness}
        contactsCount={associatedContacts.length}
      />

      <div className="mt-6 relative">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full transition-all duration-300 ease-in-out"
        >
          {/* 🆕 Tabs List Mejorado */}
          <div className="relative border-b border-muted flex justify-between overflow-x-auto">
            <TabsList className="flex space-x-4 px-4 w-full">
              {[
                { id: 'edit', label: 'Edit Lead' },
                { id: 'notes', label: 'Notes' },
                { id: 'opportunities', label: 'Opportunities' },
                { id: 'call-records', label: 'Call Records' },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all 
                    ${
                      activeTab === tab.id
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full transition-all duration-300" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* 🆕 Contenido con Transiciones Suaves */}
          <div
            id="tab-content"
            className="relative transition-all duration-300"
          >
            <TabsContent value="edit" className="mt-4 animate-fadeIn">
              <Suspense fallback={<LeadEditSkeleton />}>
                <EditLeadTab business={currentBusiness} />
              </Suspense>
            </TabsContent>

            <TabsContent value="notes" className="mt-4 animate-fadeIn">
              <Suspense fallback={<NotesSkeleton />}>
                <NotesTab businessId={currentBusiness?._id} />
              </Suspense>
            </TabsContent>

            <TabsContent value="opportunities" className="mt-4 animate-fadeIn">
              <Suspense fallback={<OpportunitiesSkeleton />}>
                <OpportunitiesTab businessId={currentBusiness._id} />
              </Suspense>
            </TabsContent>

            <TabsContent value="call-records" className="mt-4 animate-fadeIn">
              <Suspense fallback={<OpportunitiesSkeleton />}>
                <CallRecords businessId={currentBusiness._id} />
              </Suspense>
            </TabsContent>
          </div>
        </Tabs>

        {/* 🆕 Indicador de Carga al Cambiar de Tab */}
        {isPending && (
          <div className="absolute bottom-4 right-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-black/80 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(LeadDetailPage);
