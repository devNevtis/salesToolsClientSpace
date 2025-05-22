// src/components/leads/LeadsDataTable.jsx
'use client';

import { useState, useEffect, Fragment } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  FileEdit,
  Trash2,
  ExternalLink,
  User,
  MessageCircle,
  Phone,
  MapPin,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ChevronsRight,
} from 'lucide-react';
import useLeadsStore from '@/store/useLeadsStore';
import QuickEditDialog from './QuickEditDialog';
import useQuickEditStore from '@/store/useQuickEditStore';
import DeleteBusinessDialog from './DeleteBusinessDialog';
import useDeleteBusinessStore from '@/store/useDeleteBusinessStore';
import { useCallDialogStore } from '@/store/useCallDialogStore';
import { useMessageDialogStore } from '@/store/useMessageDialogStore';
import CallDialog from '@/components/leads/dialogs/CallDialog';
import MessageDialog from '@/components/leads/dialogs/MessageDialog';
import useCompanyTheme from '@/store/useCompanyTheme';
import Link from 'next/link';

export default function LeadsDataTable() {
  const { theme } = useCompanyTheme();
  const { openDialog: openQuickEditDialog } = useQuickEditStore();
  const { openDialog: openDeleteDialog } = useDeleteBusinessStore();
  const { openDialog: openCallDialog } = useCallDialogStore();
  const { openDialog: openMessageDialog } = useMessageDialogStore();

  const {
    getPaginatedBusinesses,
    getFilteredBusinesses,
    visibleColumns,
    getContactsForBusiness,
    pagination,
    setPage,
    setPageSize,
  } = useLeadsStore();

  const [openDropdowns, setOpenDropdowns] = useState(new Set());
  const [expandedRows, setExpandedRows] = useState(new Set());

  const businesses = getPaginatedBusinesses();
  const totalBusinesses = getFilteredBusinesses().length;
  const currentPage = pagination.currentPage;
  const pageSizeStore = pagination.pageSize;
  const totalPages = Math.ceil(totalBusinesses / pageSizeStore);
  const start = (currentPage - 1) * pageSizeStore;
  const end = Math.min(start + pageSizeStore, totalBusinesses);

  // Aplicar tema (se mantiene igual)
  useEffect(() => {
    if (theme.base2) {
      document.documentElement.style.setProperty('--theme-base2', theme.base2);
    }
    if (theme.highlighting) {
      document.documentElement.style.setProperty(
        '--theme-highlighting',
        theme.highlighting
      );
    }
  }, [theme]);

  const toggleRow = (businessId) => {
    const newExpanded = new Set(expandedRows);
    if (expandedRows.has(businessId)) {
      newExpanded.delete(businessId);
    } else {
      newExpanded.add(businessId);
    }
    setExpandedRows(newExpanded);
  };

  // Estilos de fila (se mantiene igual)
  const getRowStyles = (contacts) => {
    if (!contacts || contacts.length === 0) return '';
    const status = contacts[0]?.status; // Añadir optional chaining
    if (status === 'lost') {
      return 'bg-red-50 hover:bg-red-100 transition-colors';
    }
    // Podrías añadir más estilos para 'won', 'active', etc. si quieres
    return 'hover:bg-slate-100 transition-colors';
  };

  console.log(businesses);

  // Renderizado de celdas (se mantiene igual en lógica, ajusta estilos si es necesario)
  const renderCell = (business, column) => {
    const contacts = getContactsForBusiness(business._id);
    switch (column) {
      case 'companyName':
        return (
          <div className="flex items-center gap-1">
            {' '}
            {/* Reducido gap */}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0" // shrink-0 evita que se encoja
              onClick={() => toggleRow(business._id)}
            >
              {expandedRows.has(business._id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <Link
              href={`/main/leads/${business._id}`}
              className="font-medium text-[var(--theme-base2)] hover:underline truncate" // Añadido truncate
              title={business.name} // Añade tooltip para nombre largo
            >
              {business.name}
            </Link>
          </div>
        );
      case 'email':
        return business.email ? (
          <Link
            href={`mailto:${business.email}`} // Usar mailto para abrir cliente de correo
            className="flex items-center gap-2 text-[var(--theme-base2)] hover:underline truncate" // Añadido truncate
            title={business.email}
          >
            {business.email}
          </Link>
        ) : (
          <span className="text-muted-foreground text-xs">N/A</span>
        ); // Placeholder si no hay email
      case 'phone':
        return business.phone ? (
          <div className="flex items-center whitespace-nowrap">
            {' '}
            {/* Evita que el teléfono se parta */}
            <span>{business.phone}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-blue-500 hover:text-blue-700" // Tamaño consistente
              onClick={() => openCallDialog(business)}
              title="Call" // Tooltip
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-green-500 hover:text-green-700" // Tamaño consistente
              onClick={() => openMessageDialog(business)}
              title="Message" // Tooltip
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">N/A</span>
        );
      case 'location':
        const addressParts = [
          business.address,
          business.city,
          business.state,
          business.postalCode,
        ].filter(Boolean);
        // Corregido URL de Google Maps
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          addressParts.join(', ')
        )}`;
        const locationText = `${business.city || 'City'}, ${
          business.state || 'State'
        }`;
        return addressParts.length > 1 ? ( // Solo muestra si hay ciudad y estado al menos
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
            <button
              onClick={() => window.open(googleMapsUrl, '_blank')}
              className="text-blue-500 hover:underline truncate"
              title={`View ${locationText} on Google Maps`} // Tooltip descriptivo
            >
              {locationText}
            </button>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">N/A</span>
        );
      case 'website':
        if (!business.website)
          return <span className="text-muted-foreground text-xs">N/A</span>;
        const websiteUrl = business.website.startsWith('http')
          ? business.website
          : `https://${business.website}`;
        return (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[var(--theme-base2)] hover:underline"
            title={`Visit ${business.website}`}
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            Visit
          </a>
        );
      case 'contacts':
        const numContacts = getContactsForBusiness(business._id).length;
        return (
          <div className="flex items-center gap-1 whitespace-nowrap">
            <User className="h-4 w-4 text-gray-400 shrink-0" />
            <span>
              {numContacts} Contact{numContacts !== 1 ? 's' : ''}
            </span>
          </div>
        );
      case 'actions':
        const businessContacts = getContactsForBusiness(business._id);
        // DropdownMenu se mantiene igual
        return (
          <DropdownMenu
            open={openDropdowns.has(business._id)}
            onOpenChange={(open) => {
              const newOpenDropdowns = new Set(openDropdowns);
              if (open) newOpenDropdowns.add(business._id);
              else newOpenDropdowns.delete(business._id);
              setOpenDropdowns(newOpenDropdowns);
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onSelect={(e) => {
                  openQuickEditDialog(business);
                }}
              >
                <FileEdit className="h-4 w-4" /> Quick Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700"
                onSelect={(e) => {
                  openDeleteDialog(business, businessContacts);
                }}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      default:
        // Renderiza otros campos directamente (si los hubiera)
        return (
          <span className="truncate" title={business[column]}>
            {business[column]}
          </span>
        );
    }
  };

  // --- ESTRUCTURA PRINCIPAL Y CAMBIOS DE SCROLL ---
  return (
    // Usamos flex flex-col y h-full para que ocupe el espacio vertical disponible
    // dado por el contenedor padre (que debería ser flex-1 overflow-y-auto)
    <div className="flex flex-col h-full">
      {/* Contenedor de la Tabla: flex-1 para ocupar espacio, overflow-y para scroll vertical */}
      <div className="flex-1 overflow-y-auto border rounded-md">
        {/* Contenedor Interno para Scroll Horizontal */}
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            {' '}
            {/* min-w-full ayuda al scroll horizontal */}
            <TableHeader className="sticky top-0 bg-background z-10">
              {' '}
              {/* Header pegajoso */}
              <TableRow>
                {visibleColumns.map((column) => (
                  <TableHead
                    key={column}
                    className="whitespace-nowrap px-3 py-2 text-sm font-medium text-muted-foreground"
                  >
                    {' '}
                    {/* Estilos de header */}
                    {/* Lógica simple para convertir camelCase a Title Case */}
                    {column
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {businesses.length > 0 ? (
                businesses.map((business) => (
                  <Fragment key={business._id}>
                    <TableRow
                      className={`group ${getRowStyles(
                        getContactsForBusiness(business._id)
                      )}`}
                    >
                      {visibleColumns.map((column) => (
                        <TableCell
                          key={`${business._id}-${column}`}
                          className="px-3 py-1.5 text-sm"
                        >
                          {' '}
                          {/* Padding ajustado */}
                          {renderCell(business, column)}
                        </TableCell>
                      ))}
                    </TableRow>
                    {/* Fila Expandida (sin cambios) */}
                    {expandedRows.has(business._id) && (
                      <TableRow className="bg-muted/30 hover:bg-muted/50">
                        <TableCell
                          colSpan={visibleColumns.length}
                          className="p-0"
                        >
                          <div className="p-3 space-y-1">
                            {' '}
                            {/* Espaciado interno */}
                            {getContactsForBusiness(business._id).map(
                              (contact) => (
                                <div
                                  key={contact._id}
                                  className="flex items-center gap-3 p-1.5 text-xs rounded hover:bg-background"
                                >
                                  <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                  <span
                                    className="font-medium truncate shrink min-w-0"
                                    title={contact.name}
                                  >
                                    {contact.name}
                                  </span>
                                  {contact.email && (
                                    <span className="text-muted-foreground truncate hidden sm:inline">
                                      • {contact.email}
                                    </span>
                                  )}
                                  {contact.phone && (
                                    <span className="text-muted-foreground whitespace-nowrap hidden md:inline">
                                      • {contact.phone}
                                    </span>
                                  )}
                                  {/* Status a la derecha */}
                                  <div className="ml-auto pl-2">
                                    <span
                                      className={`px-1.5 py-0.5 rounded-full font-medium ${
                                        contact.status === 'won'
                                          ? 'bg-green-100 text-green-700'
                                          : contact.status === 'lost'
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-blue-100 text-blue-700'
                                      }`}
                                    >
                                      {contact.status?.charAt(0).toUpperCase() +
                                        contact.status?.slice(1)}
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                            {getContactsForBusiness(business._id).length ===
                              0 && (
                              <div className="text-center text-xs text-muted-foreground py-2">
                                No contacts found.
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))
              ) : (
                // Mensaje si no hay datos
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No leads found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Controles de Paginación - Fuera del div de scroll, shrink-0 para no ocupar espacio extra */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-3 px-1 shrink-0">
        {' '}
        {/* Clases responsivas y gap */}
        <div className="text-sm text-muted-foreground">
          Showing {totalBusinesses > 0 ? start + 1 : 0} to {end} of{' '}
          {totalBusinesses} entries
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {' '}
          {/* Clases responsivas y gap */}
          {/* Rows per page (sin cambios) */}
          <div className="flex items-center gap-2">
            <span className="text-sm">Rows per page</span>
            <Select
              value={pageSizeStore.toString()}
              onValueChange={(value) => setPageSize(Number(value))}
            >
              <SelectTrigger className="w-[70px] h-8 text-sm">
                {' '}
                {/* Ajuste de tamaño/fuente */}
                <SelectValue>{pageSizeStore}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50, 100].map((size) => (
                  <SelectItem
                    key={size}
                    value={size.toString()}
                    className="text-sm"
                  >
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Botones de Paginación (sin cambios lógicos, solo layout) */}
          <div className="flex gap-1">
            {' '}
            {/* Reducido gap entre botones */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => setPage(1)}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center px-2 h-8 text-sm">
              {' '}
              Page {currentPage} of {totalPages}{' '}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages}
              onClick={() => setPage(totalPages)}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Diálogos (sin cambios) */}
      <QuickEditDialog />
      <DeleteBusinessDialog />
      <CallDialog />
      <MessageDialog />
    </div>
  );
}
