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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight, LucideFilterX } from "lucide-react";
import useCompanyTheme from '@/store/useCompanyTheme';
import useLeadsStore from "@/store/useLeadsStore";

export default function OpportunitiesDataTable() {
  const { theme } = useCompanyTheme();
  const { getPaginatedBusinesses, getContactsForBusiness } = useLeadsStore();
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [filterSeller, setFilterSeller] = useState('');
  const businesses = getPaginatedBusinesses();

  useEffect(() => {
    if (theme.base1) {
      document.documentElement.style.setProperty('--theme-base1', theme.base1);
    }
    if (theme.base2) {
      document.documentElement.style.setProperty('--theme-base2', theme.base2);
    }
    if (theme.highlighting) {
      document.documentElement.style.setProperty('--theme-highlighting', theme.highlighting);
    }
    if (theme.callToAction) {
      document.documentElement.style.setProperty('--theme-callToAction', theme.callToAction);
    }
  }, [theme]);

  console.log(theme.callToAction);

  const toggleRow = (businessId) => {
    const newExpanded = new Set(expandedRows);
    if (expandedRows.has(businessId)) {
      newExpanded.delete(businessId);
    } else {
      newExpanded.add(businessId);
    }
    setExpandedRows(newExpanded);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStage('');
    setFilterSeller('');
  };

  const calculateTotalValue = (contacts, stageFilter = null) => {
    if (!contacts || contacts.length === 0) return 0;

    return contacts.reduce((total, contact) => {
      const opportunities = contact.opportunities || [];
      return total + opportunities.reduce((sum, opp) => {
        if (stageFilter && opp.stage !== stageFilter) return sum;
        return sum + opp.value;
      }, 0);
    }, 0);
  };

  const getFilteredOpportunities = (contacts, stageFilter) => {
    if (!contacts || contacts.length === 0) return [];
    return contacts.flatMap(contact =>
      (contact.opportunities || []).filter(opportunity => !stageFilter || opportunity.stage === stageFilter)
    );
  };

  const getUniqueStages = (contacts, stageFilter = null) => {
    const stages = new Set();
    contacts.forEach(contact => {
      (contact.opportunities || []).forEach(opportunity => {
        if (!stageFilter || opportunity.stage === stageFilter) {
          stages.add(opportunity.stage);
        }
      });
    });
    return Array.from(stages);
  };

  const getStageBadge = (stage) => {
    const initials = stage
      .split(' ')
      .map(word => word[0].toUpperCase())
      .join('');
    const colorMap = {
      Demo: 'bg-blue-100 text-blue-600',
      Proposal: 'bg-green-100 text-green-600',
      Negotiation: 'bg-yellow-100 text-yellow-600',
      Closed: 'bg-purple-100 text-purple-600',
    };
    const badgeColor = colorMap[stage] || 'bg-gray-100 text-gray-600';

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${badgeColor}`}>
        {initials}
      </span>
    );
  };

  const filteredBusinesses = businesses.filter((business) => {
    const contacts = getContactsForBusiness(business._id);
    const totalOpportunities = contacts.reduce((count, contact) => count + (contact.opportunities || []).length, 0);

    // Filtrar por searchTerm
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtrar por stage
    const matchesStage = filterStage
      ? contacts.some(contact =>
          (contact.opportunities || []).some(opportunity => opportunity.stage === filterStage)
        )
      : true;

    // Filtrar por seller
    const matchesSeller = filterSeller
      ? business.createdBy?.name === filterSeller
      : true;

    return totalOpportunities > 0 && matchesSearch && matchesStage && matchesSeller;
  });

  const totalOpportunitiesValue = filteredBusinesses.reduce((total, business) => {
    const contacts = getContactsForBusiness(business._id);
    return total + calculateTotalValue(contacts, filterStage);
  }, 0);

  return (
    <div className="rounded-md border">
      <div className="px-4 py-2 border-b">
        <h2 className="text-xl font-semibold">Opportunities</h2>
      </div>
      <div className="p-4 flex justify-between items-center">
        <div className="flex gap-4">
          <Input
            placeholder="Search by company"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3"
          />
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">All Stages</option>
            {Array.from(new Set(
              businesses.flatMap(business =>
                getContactsForBusiness(business._id).flatMap(contact =>
                  (contact.opportunities || []).map(opp => opp.stage)
                )
              )
            )).map(stage => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
          <select
            value={filterSeller}
            onChange={(e) => setFilterSeller(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">All Sellers</option>
            {Array.from(new Set(
              businesses.map(business => business.createdBy?.name || "Unknown Seller")
            )).map(seller => (
              <option key={seller} value={seller}>
                {seller}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
          >
            <LucideFilterX className="h-4 w-4 text-[var(--theme-callToAction)]" />
          </Button>
          <div className="text-sm font-medium text-[var(--theme-base1)] bg-[var(--theme-highlighting)] py-0.5 px-1 rounded-lg border border-[var(--theme-base1)]">
            <span>Total: </span><span className="font-semibold">${totalOpportunitiesValue.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="h-[52vh] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead >Business Name</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Total Value</TableHead>
              <TableHead>Stages</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBusinesses.map((business) => {
              const contacts = getContactsForBusiness(business._id);
              const totalValue = calculateTotalValue(contacts, filterStage);
              const stages = getUniqueStages(contacts, filterStage);
              const seller = business.createdBy?.name || "Unknown Seller";
              const filteredOpportunities = getFilteredOpportunities(contacts, filterStage);

              return (
                <Fragment key={business._id}>
                  <TableRow>
                    <TableCell>
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
                        <span className="font-medium">{business.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{seller}</TableCell>
                    <TableCell>${totalValue.toFixed(2)}</TableCell>
                    <TableCell className="flex gap-2">
                      {stages.map(stage => (
                        <Fragment key={stage}>{getStageBadge(stage)}</Fragment>
                      ))}
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(business._id) && (
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={4} className="p-0">
                        <div className="p-4">
                          {filteredOpportunities.map((opportunity) => (
                            <div 
                              key={opportunity._id}
                              className="flex items-center gap-4 p-2 hover:bg-muted rounded-md"
                            >
                              <span className="font-medium">{opportunity.titles.join(', ')}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-500">
                                ${opportunity.value.toFixed(2)}
                              </span>
                              <span className="ml-auto text-sm text-blue-600">
                                {opportunity.stage}
                              </span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
