// src/components/leads/LeadsDataTable.jsx
'use client';

import { useState, useEffect, Fragment } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  ChevronRight, 
  MoreHorizontal, 
  Copy, 
  FileEdit, 
  Trash2,
  ExternalLink,
  User,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import useLeadsStore from "@/store/useLeadsStore";
import QuickEditDialog from './QuickEditDialog';
import useQuickEditStore from '@/store/useQuickEditStore';
import DeleteBusinessDialog from './DeleteBusinessDialog';
import useDeleteBusinessStore from '@/store/useDeleteBusinessStore';

export default function LeadsDataTable() {
  const { openDialog:openQuickEditDialog } = useQuickEditStore();
  const { openDialog: openDeleteDialog } = useDeleteBusinessStore();
  const { 
    getPaginatedBusinesses, 
    visibleColumns,
    getContactsForBusiness,
  } = useLeadsStore();
  const [openDropdowns, setOpenDropdowns] = useState(new Set());

  const [expandedRows, setExpandedRows] = useState(new Set());

/*   useEffect(() => {
    const handleClick = (e) => {
      console.log('Click event:', e.target);
      console.log('Event propagation:', e.bubbles);
      console.log('Z-index stack:', getComputedStyle(e.target).zIndex);
    };
  
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []); */

  // Handle row expansion
  const toggleRow = (businessId) => {
    const newExpanded = new Set(expandedRows);
    if (expandedRows.has(businessId)) {
      newExpanded.delete(businessId);
    } else {
      newExpanded.add(businessId);
    }
    setExpandedRows(newExpanded);
  };

  // Cell renderers
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
            <span className="font-medium text-blue-600 hover:underline cursor-pointer">
              {business.name}
            </span>
          </div>
        );
      case 'email':
        return business.email ? (
          <a href={`mailto:${business.email}`} className="flex items-center gap-2 text-blue-600 hover:underline">
            <Mail className="h-4 w-4" />
            {business.email}
          </a>
        ) : null;
      case 'phone':
        return business.phone ? (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            {business.phone}
          </div>
        ) : null;
      case 'location':
        return (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{business.city}, {business.state}</span>
          </div>
        );
      case 'website':
        return business.website ? (
          <a
            href={business.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            Visit
          </a>
        ) : null;
      case 'contacts':
        return (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span>{contacts.length} Contact{contacts.length !== 1 ? 's' : ''}</span>
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
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableHead key={column}>
                  {column.charAt(0).toUpperCase() + column.slice(1).replace(/([A-Z])/g, ' $1')}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {getPaginatedBusinesses().map((business) => (
              <Fragment key={business._id}>
                <TableRow className="group">
                  {visibleColumns.map((column) => (
                    <TableCell key={`${business._id}-${column}`}>
                      {renderCell(business, column)}
                    </TableCell>
                  ))}
                </TableRow>
                {expandedRows.has(business._id) && (
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={visibleColumns.length} className="p-0">
                      <div className="p-4">
                        {getContactsForBusiness(business._id).map((contact) => (
                          <div 
                            key={contact._id}
                            className="flex items-center gap-4 p-2 hover:bg-muted rounded-md"
                          >
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{contact.name}</span>
                            {contact.email && (
                              <>
                                <span className="text-gray-500">•</span>
                                <span className="text-gray-500">{contact.email}</span>
                              </>
                            )}
                            {contact.phone && (
                              <>
                                <span className="text-gray-500">•</span>
                                <span className="text-gray-500">{contact.phone}</span>
                              </>
                            )}
                            <div className="ml-auto flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                contact.status === 'won' 
                                  ? 'bg-green-100 text-green-700'
                                  : contact.status === 'lost'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
      <QuickEditDialog/>
      <DeleteBusinessDialog/>
    </>
  );
}