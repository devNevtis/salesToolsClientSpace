// src/app/main/company/[companyId]/page.jsx
'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeConfig from "./theme-config";
import StagesConfig from "./stages-config";
/* import OpportunitiesConfig from "./opportunities-config"; */
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import OpportunitiesConfig from "./opportunities-config";

export default function CompanyConfigPage({ params }) {
  const { user } = useAuth();
  const router = useRouter();

  // Verificación adicional de seguridad
  useEffect(() => {
    if (user && user.role !== 'owner' && user.role !== 'admin') {
      router.push('/main/leads');
    }
  }, [user, router]);

  return (
    <div className="py-1 px-6">
      <h1 className="text-2xl font-bold mb-2">Company Configuration</h1>
      
      <Tabs defaultValue="theme" className="w-full rounded-xl shadow-md">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="stages">Funnel Stages</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="theme" className="h-[78vh] overflow-y-auto">
          <ThemeConfig companyId={params.companyId} />
        </TabsContent>
        
        <TabsContent value="stages" className="h-[78vh] overflow-y-auto">
          <StagesConfig companyId={params.companyId} />
        </TabsContent>
        
        <TabsContent value="opportunities" className="h-[78vh] overflow-y-auto">
          <OpportunitiesConfig companyId={params.companyId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}