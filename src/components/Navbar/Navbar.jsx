// src/components/Navbar/Navbar.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdOutlineDashboard, MdFormatListBulletedAdd } from 'react-icons/md';
import { FiSettings } from 'react-icons/fi';
// Importa iconos para los nuevos botones
import { Menu, MoreVertical } from 'lucide-react';
import LogoutButton from '@/components/logout/LogoutButton';
import { useAuth } from '@/components/AuthProvider';
import useCompanyTheme from '@/store/useCompanyTheme';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
// Importa los componentes DropdownMenu
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator, // Opcional, para separar
} from '@/components/ui/dropdown-menu';
import Sidebar from '@/components/Sidebar/Sidebar';

const Navbar = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { theme } = useCompanyTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Estado opcional para controlar el Dropdown (generalmente no necesario)
  // const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  const canAccessConfig = user?.role === 'owner' || user?.role === 'admin';

  const headerInlineStyle = {
    '--theme-base1': theme?.base1 || '#224F5A',
    '--theme-highlighting': theme?.highlighting || '#FFFFFF',
    backgroundColor: 'var(--theme-base1)',
  };

  // Clases para los links del Navbar de escritorio
  const getDesktopLinkClasses = (href) => {
    const isActive = pathname.startsWith(href);
    let classes =
      'flex items-center gap-1.5 p-2 rounded-md transition-colors duration-150 ease-in-out text-sm font-medium';
    if (isActive) {
      classes += ' text-[var(--theme-highlighting)] bg-black/10';
    } else {
      classes += ' text-white hover:bg-black/10 hover:text-white/90';
    }
    return classes;
  };

  // Clases para los items del Dropdown móvil (pueden ser más simples)
  const getDropdownItemClasses = (href) => {
    const isActive = pathname.startsWith(href);
    let classes = 'flex items-center gap-3 px-3 py-2 text-sm'; // Estilo base dropdown
    if (isActive) {
      classes += ' bg-accent text-accent-foreground'; // Estilo activo dropdown
    } else {
      classes += ' text-foreground/80';
    }
    return classes;
  };

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between h-16 px-2 md:px-4 border-b shadow-md" // Reducido padding en móvil
      style={headerInlineStyle}
    >
      {/* === Lado Izquierdo: Hamburguesa y Trigger del Dropdown (Móvil) / Links (Desktop) === */}
      <div className="flex items-center gap-1 md:gap-2">
        {' '}
        {/* Reducido gap en móvil */}
        {/* Sheet Trigger (Hamburguesa) */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-black/20"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-[280px]"
            aria-describedby={undefined}
          >
            <Sidebar />
          </SheetContent>
        </Sheet>
        {/* --- NUEVO: Dropdown Menu Trigger (Tres Puntos) --- */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* Visible solo en pantallas < lg */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-black/20"
            >
              <MoreVertical className="h-6 w-6" />
              <span className="sr-only">Toggle Navigation Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {' '}
            {/* Alineado al inicio, ancho fijo */}
            <DropdownMenuItem asChild>
              {/* Usamos asChild para que Link funcione correctamente */}
              <Link
                href="/main/dashboard"
                className={getDropdownItemClasses('/main/dashboard')}
              >
                <MdOutlineDashboard className="h-5 w-5 mr-2" />
                <span>Dash</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/main/leads"
                className={getDropdownItemClasses('/main/leads')}
              >
                <MdFormatListBulletedAdd className="h-5 w-5 mr-2" />
                <span>Leads/Cust</span>
              </Link>
            </DropdownMenuItem>
            {canAccessConfig && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={`/main/company/${user.companyId}`}
                    className={getDropdownItemClasses(
                      `/main/company/${user.companyId}`
                    )}
                  >
                    <FiSettings className="h-5 w-5 mr-2" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* --- FIN NUEVO DROPDOWN --- */}
        {/* Links de Navegación Desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link
            href="/main/dashboard"
            className={getDesktopLinkClasses('/main/dashboard')}
          >
            <MdOutlineDashboard size={18} /> <p>Dash</p>
          </Link>
          <Link
            href="/main/leads"
            className={getDesktopLinkClasses('/main/leads')}
          >
            <MdFormatListBulletedAdd size={18} /> <p>Leads/Cust</p>
          </Link>
          {canAccessConfig && (
            <Link
              href={`/main/company/${user.companyId}`}
              className={getDesktopLinkClasses(
                `/main/company/${user.companyId}`
              )}
            >
              <FiSettings size={18} /> <p>Settings</p>
            </Link>
          )}
        </nav>
      </div>

      {/* === Centro: Logo (visible en desktop) === */}
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

      {/* === Lado Derecho: Logout === */}
      <div className="flex items-center shrink-0">
        <LogoutButton />
      </div>
    </header>
  );
};

export default Navbar;
