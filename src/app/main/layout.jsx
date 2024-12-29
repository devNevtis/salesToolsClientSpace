// app/main/layout.jsx
'use client';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Sidebar from '@/components/Sidebar/Sidebar';
import { useCompanyData } from '@/hooks/useCompanyData';
import useBusinessStore from '@/store/useBusinessStore';
import useLeadsStore from '@/store/useLeadsStore2';

const MainLayout = ({ children }) => {
  const { fetchBusinesses } = useBusinessStore();
  const { fetchLeads } = useLeadsStore();
  useCompanyData();

  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([fetchBusinesses(), fetchLeads()]);
    };
    loadInitialData();
  }, [fetchBusinesses, fetchLeads]);

  return (
    <div className="flex flex-col-reverse md:flex-row">
      <Sidebar />
      <div className="w-[100%] h-[100vh]">
        <Navbar />
        <div>{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;