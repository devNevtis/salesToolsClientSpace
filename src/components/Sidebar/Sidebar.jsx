//src/components/Sidebar/Sidebar.jsx
"use client";
import CompanyLogo from "./CompanyLogo";
import useCompanyTheme from '@/store/useCompanyTheme';
import UserCard from "./UserCard";
import DialerPad from "./DialePad";

const Sidebar = () => {
  const { theme } = useCompanyTheme();
  return (
    <div 
      className="w-full md:w-[20vw] h-[100vh] py-2 px-4 overflow-y-auto"
      style={{ backgroundColor: '#f1f5f9' || '#f1f5f9' }}
    >
            {/* Logo Section */}
      <div className="mb-4">
        <CompanyLogo />
      </div>
      <div className="mb-4">
        <UserCard />
      </div>
      <DialerPad/>

      {/* Navigation Section - Placeholder for future navigation items */}
      <div className="space-y-2">
        {/* Aquí irán los items de navegación */}
      </div>

      {/* Footer Section - Placeholder for additional content */}
      <div className="mt-auto pt-4">
        {/* Aquí puede ir contenido adicional del footer */}
      </div>
    </div>
  )
}

export default Sidebar