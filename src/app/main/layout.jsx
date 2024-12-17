// src/app/main/layout.jsx
'use client';
import Navbar from '@/components/Navbar/Navbar';
import Sidebar from '@/components/Sidebar/Sidebar';
import { useCompanyData } from '@/hooks/useCompanyData';

const MainLayout = ({ children }) => {
  useCompanyData();

  return (
    <div className="flex flex-col-reverse md:flex-row">
      <Sidebar />
      <div className="w-[100%] h-[100vh]">
        <Navbar />
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;