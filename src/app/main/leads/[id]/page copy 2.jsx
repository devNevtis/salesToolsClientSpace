// app/main/leads/[id]/page.jsx
"use client";

import { useEffect,Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useLeadsStore from '@/store/useLeadsStore2';
import useBusinessStore from '@/store/useBusinessStore';
import { ChevronLeft, Loader2 } from "lucide-react";
import LeadDetailHeader from '@/components/leads/LeadDetailHeader';
import EditLeadTab from "@/components/leads/EditLeadTab";
import NotesTab from "@/components/leads/NotesTab";
import OpportunitiesTab from "@/components/leads/OpportunitiesTab";
import { Button } from '@/components/ui/button';
import LeadEditSkeleton from "@/components/skeletons/LeadEditSkeleton";
import NotesSkeleton from "@/components/skeletons/NotesSkeleton";
import OpportunitiesSkeleton from "@/components/skeletons/OpportunitiesSkeleton";

export default function LeadDetailPage() {
    const params = useParams();
    const leadId = params.id;
    const { businesses, isLoading: isLoadingBusiness, fetchBusinesses, getBusinessContacts } = useBusinessStore();
    const { fetchLeads } = useLeadsStore();

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([fetchBusinesses(), fetchLeads()]);
        };
        loadData();
    }, [fetchBusinesses, fetchLeads]);

    const currentBusiness = businesses.find(b => b._id === leadId);
    const associatedContacts = currentBusiness ? getBusinessContacts(currentBusiness._id) : [];

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
        <div className="container mx-auto py-4">
            {/* Lead Header Component */}
            <LeadDetailHeader 
                business={currentBusiness} 
                contactsCount={associatedContacts.length} 
            />

            {/* Tabs Section */}
            <div className="mt-6">
                <Tabs defaultValue="edit" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="edit">Edit Lead</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                  </TabsList>

                    <TabsContent value="edit" className="mt-4">
                        <Suspense fallback={<LeadEditSkeleton />}>
                            <EditLeadTab business={currentBusiness} />
                        </Suspense>
                    </TabsContent>

                    <TabsContent value="notes" className="mt-6">
                        <Suspense fallback={<NotesSkeleton />}>
                            <NotesTab businessId={currentBusiness?._id} />
                        </Suspense>
                    </TabsContent>

                    <TabsContent value="opportunities" className="mt-6">
                        <Suspense fallback={<OpportunitiesSkeleton />}>
                            <OpportunitiesTab businessId={currentBusiness._id} />
                        </Suspense>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}