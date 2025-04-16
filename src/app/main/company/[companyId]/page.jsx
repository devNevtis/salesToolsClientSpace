// src/app/main/company/[companyId]/page.jsx
'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeConfig from './theme-config';
import StagesConfig from './stages-config';
import OpportunitiesConfig from './opportunities-config';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CompanyConfigPage({ params }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'owner' && user.role !== 'admin') {
      console.log('User does not have permission, redirecting...');
      router.push('/main/leads');
    }
  }, [user, router]);

  if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Company Configuration</h1>
      <Tabs defaultValue="theme" className="w-full">
        <TabsList className="flex flex-wrap h-auto justify-start mb-4 bg-card border rounded-lg p-1 gap-1">
          <TabsTrigger
            value="theme"
            className="flex-grow sm:flex-grow-0 px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base"
          >
            Theme
          </TabsTrigger>
          <TabsTrigger
            value="stages"
            className="flex-grow sm:flex-grow-0 px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base"
          >
            Funnel Stages
          </TabsTrigger>
          <TabsTrigger
            value="opportunities"
            className="flex-grow sm:flex-grow-0 px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base"
          >
            Opportunities List
          </TabsTrigger>
        </TabsList>

        <TabsContent value="theme">
          <ThemeConfig companyId={params.companyId} />
        </TabsContent>

        <TabsContent value="stages">
          <StagesConfig companyId={params.companyId} />
        </TabsContent>

        <TabsContent value="opportunities">
          <OpportunitiesConfig companyId={params.companyId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
