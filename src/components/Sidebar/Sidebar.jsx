// src/components/Sidebar/Sidebar.jsx
'use client';
import CompanyLogo from './CompanyLogo';
import useCompanyTheme from '@/store/useCompanyTheme'; // Asegúrate que theme se usa o elimínalo si no
import UserCard from './UserCard';
import DialerPad from './DialePad'; // Corregir typo: DialerPad
import DialList from './DialList';

const Sidebar = () => {
  return (
    <div className="w-[280px] h-full flex flex-col bg-slate-100 px-4 py-2 overflow-y-auto">
      {/* Logo Section */}
      <div className="mb-1 shrink-0">
        {' '}
        {/* shrink-0 evita que se encoja */}
        <CompanyLogo />
      </div>

      {/* User Card Section */}
      <div className="mb-4 shrink-0">
        <UserCard />
      </div>

      {/* Dial List Section */}
      <div className="mb-4 shrink-0">
        <DialList /> {/* DialList internamente debe ser w-full ahora */}
      </div>

      {/* Dialer Pad Section */}
      <div className="mb-4 shrink-0">
        <DialerPad />
      </div>

      {/* Navigation Section - Placeholder */}
      <div className="space-y-2 mt-4 shrink-0">
        {/* Aquí irán los items de navegación si los añades */}
        {/* Ejemplo: <NavItem href="/settings" label="Settings" /> */}
      </div>

      {/* Footer Section - Placeholder (usamos mt-auto en el div de abajo para empujar esto) */}
      {/* <div className="mt-auto pt-4 shrink-0"> */}
      {/* Aquí puede ir contenido adicional del footer */}
      {/* Ejemplo: <VersionInfo /> */}
      {/* </div> */}

      {/* Empujador para poner el footer (si existiera) al final */}
      <div className="mt-auto"></div>
    </div>
  );
};

export default Sidebar;
