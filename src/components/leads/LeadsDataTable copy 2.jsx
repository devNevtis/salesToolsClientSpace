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
  Mail,
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
  const { getPaginatedBusinesses, visibleColumns, getContactsForBusiness } =
    useLeadsStore();

  const [openDropdowns, setOpenDropdowns] = useState(new Set());
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [pageSize, setPageSize] = useState(10);
  const businesses = getPaginatedBusinesses();

  const [phoneDialog, setPhoneDialog] = useState({
    open: false,
    business: null,
  });
  const [messageDialog, setMessageDialog] = useState({
    open: false,
    business: null,
  });

  const totalBusinesses = businesses.length;
  const totalPages = Math.ceil(totalBusinesses / pageSize);
  const [currentPage, setCurrentPage] = useState(1);

  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, totalBusinesses);
  const paginatedBusinesses = businesses.slice(start, end);

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

  const getRowStyles = (contacts) => {
    if (!contacts || contacts.length === 0) return '';

    const status = contacts[0].status; // Tomamos el status del primer contacto
    if (status === 'lost') {
      return 'bg-red-50 hover:bg-red-100 transition-colors';
    }

    return 'hover:bg-slate-100 transition-colors';
  };

  const renderCell = (business, column) => {
    const contacts = getContactsForBusiness(business._id);

    switch (column) {
      case 'companyName':
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
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
              className="font-medium text-[var(--theme-base2)] hover:underline"
            >
              {business.name}
            </Link>
          </div>
        );
      case 'email':
        return business.email ? (
          <Link
            href={`/main/email-compose/${encodeURIComponent(business.email)}`}
            className="flex items-center gap-2 text-[var(--theme-base2)] hover:underline"
          >
            {business.email}
          </Link>
        ) : /*           <a href={`mailto:${business.email}`} className="flex items-center gap-2 text-[var(--theme-base2)] hover:underline">
            <Mail className="h-4 w-4" />
            {business.email}
          </a> */
        null;
      case 'phone':
        return business.phone ? (
          <div className="flex items-center">
            <span>{business.phone}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openCallDialog(business)}
            >
              <Phone className="h-4 w-4 text-blue-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openMessageDialog(business)}
            >
              <MessageCircle className="h-4 w-4 text-green-500" />
            </Button>
          </div>
        ) : null;
      case 'location':
        return (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>
              {business.city}, {business.state}
            </span>
          </div>
        );
      case 'website':
        return business.website ? (
          <a
            href={business.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[var(--theme-base2)] hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            Visit
          </a>
        ) : null;
      case 'contacts':
        return (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span>
              {contacts.length} Contact{contacts.length !== 1 ? 's' : ''}
            </span>
          </div>
        );
      case 'actions':
        const businessContacts = getContactsForBusiness(business._id);
        return (
          <DropdownMenu
            open={openDropdowns.has(business._id)}
            onOpenChange={(open) => {
              const newOpenDropdowns = new Set(openDropdowns);
              if (open) {
                newOpenDropdowns.add(business._id);
              } else {
                newOpenDropdowns.delete(business._id);
              }
              setOpenDropdowns(newOpenDropdowns);
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  openQuickEditDialog(business);
                }}
              >
                <FileEdit className="h-4 w-4" />
                Quick Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-600 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteDialog(business, businessContacts);
                }}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      default:
        return null;
    }
  };
  console.log(paginatedBusinesses);
  return (
    <>
      <div className="rounded-md border">
        <div className="h-[52vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.map((column) => (
                  <TableHead key={column}>
                    {column.charAt(0).toUpperCase() +
                      column.slice(1).replace(/([A-Z])/g, ' $1')}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBusinesses
                .filter((business) => {
                  const contacts = getContactsForBusiness(business._id);
                  // No mostramos los WON en la vista de LEADS
                  return !contacts.length || contacts[0].status !== 'won';
                })
                .map((business) => (
                  <Fragment key={business._id}>
                    <TableRow
                      className={`group ${getRowStyles(
                        getContactsForBusiness(business._id)
                      )}`}
                    >
                      {visibleColumns.map((column) => (
                        <TableCell key={`${business._id}-${column}`}>
                          {renderCell(business, column)}
                        </TableCell>
                      ))}
                    </TableRow>
                    {expandedRows.has(business._id) && (
                      <TableRow className="bg-muted/50">
                        <TableCell
                          colSpan={visibleColumns.length}
                          className="p-0"
                        >
                          <div className="p-4">
                            {getContactsForBusiness(business._id).map(
                              (contact) => (
                                <div
                                  key={contact._id}
                                  className="flex items-center gap-4 p-2 hover:bg-muted rounded-md"
                                >
                                  <User className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">
                                    {contact.name}
                                  </span>
                                  {contact.email && (
                                    <>
                                      <span className="text-gray-500">•</span>
                                      <span className="text-gray-500">
                                        {contact.email}
                                      </span>
                                    </>
                                  )}
                                  {contact.phone && (
                                    <>
                                      <span className="text-gray-500">•</span>
                                      <span className="text-gray-500">
                                        {contact.phone}
                                      </span>
                                    </>
                                  )}
                                  <div className="ml-auto flex items-center gap-2">
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        contact.status === 'won'
                                          ? 'bg-green-100 text-green-700'
                                          : contact.status === 'lost'
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-blue-100 text-blue-700'
                                      }`}
                                    >
                                      {contact.status.charAt(0).toUpperCase() +
                                        contact.status.slice(1)}
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 px-2">
        <div className="text-sm text-muted-foreground">
          Showing {start + 1} to {end} of {totalBusinesses} entries
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Rows per page</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(Number(value))}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue>{pageSize}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <QuickEditDialog />
      <DeleteBusinessDialog />
      <CallDialog />
      <MessageDialog />
    </>
  );
}
