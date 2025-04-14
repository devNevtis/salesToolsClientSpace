// src/components/Navbar/Navbar.jsx
'use client';

import { useState } from 'react'; // Importa useState
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdOutlineDashboard, MdFormatListBulletedAdd } from 'react-icons/md';
import { FiSettings } from 'react-icons/fi';
import { Menu } from 'lucide-react';
import LogoutButton from '@/components/logout/LogoutButton';
import { useAuth } from '@/components/AuthProvider';
import useCompanyTheme from '@/store/useCompanyTheme';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Sidebar from '@/components/Sidebar/Sidebar';

const Navbar = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { theme } = useCompanyTheme();
  // Estado para el Sheet, manejado DENTRO del Navbar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const canAccessConfig = user?.role === 'owner' || user?.role === 'admin';

  const headerInlineStyle = {
    '--theme-base1': theme?.base1 || '#224F5A',
    '--theme-highlighting': theme?.highlighting || '#FFFFFF',
    backgroundColor: 'var(--theme-base1)',
  };

  const getLinkClasses = (href) => {
    const isActive = pathname.startsWith(href);
    let classes =
      'flex items-center gap-1.5 p-2 rounded-md transition-colors duration-150 ease-in-out text-sm font-medium'; // Ajustado gap y items-center
    if (isActive) {
      // Usa la variable CSS para el color de texto activo
      classes += ' text-[var(--theme-highlighting)] bg-black/10';
    } else {
      // Color blanco por defecto para inactivo, hover sutil
      classes += ' text-white hover:bg-black/10 hover:text-white/90';
    }
    return classes;
  };

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 border-b shadow-md"
      style={headerInlineStyle}
    >
      {/* === Sheet y Trigger (Contenedor + Botón Hamburguesa) === */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        {/* Botón Hamburguesa (SheetTrigger) - Visible solo en pantallas < lg */}
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-black/20 mr-2"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>

        {/* Contenido del Sheet (Sidebar) */}
        <SheetContent
          side="left"
          className="p-0 w-[280px]"
          aria-describedby={undefined}
        >
          <Sidebar closeSheet={() => setIsSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
      <nav className="hidden lg:flex items-center gap-1">
        <Link
          href="/main/dashboard"
          className={getLinkClasses('/main/dashboard')}
        >
          <MdOutlineDashboard size={18} />
          <p>Dash</p>
        </Link>
        <Link href="/main/leads" className={getLinkClasses('/main/leads')}>
          <MdFormatListBulletedAdd size={18} />
          <p>Leads/Cust</p>
        </Link>
        {canAccessConfig && (
          <Link
            href={`/main/company/${user.companyId}`}
            className={getLinkClasses(`/main/company/${user.companyId}`)}
          >
            <FiSettings size={18} />
            <p>Settings</p>
          </Link>
        )}
      </nav>
      <div className="hidden lg:flex justify-center flex-1 px-4">
        <Image
          src="/DialToolsProLogoWhite.png"
          alt="Logo"
          width={140}
          height={40}
          className="object-contain"
          priority={true}
        />
      </div>
      <div className="flex items-center shrink-0">
        <LogoutButton />
      </div>
    </header>
  );
};

export default Navbar;
