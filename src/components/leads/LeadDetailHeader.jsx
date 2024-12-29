//components/leads/LeadDetailHeader.jsx
"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Building2, ChevronLeft } from "lucide-react";

export default function LeadDetailHeader({ business, contactsCount }) {
    const router = useRouter();

    return (
        <div className="space-y-6">
            {/* Back Button and Breadcrumb Row */}
            <div className="flex items-center justify-between">
                <Button 
                    variant="outline" 
                    onClick={() => router.push('/main/leads')}
                    className="gap-2"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Leads
                </Button>
                <Breadcrumb>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/main/leads">Leads</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink>{business.name}</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </div>

            {/* Lead Header */}
            <div className="flex items-center gap-3 border-b pb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                    <Building2 className="h-8 w-8 text-orange-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-orange-500">
                        {business.name}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{contactsCount} {contactsCount === 1 ? 'Contact' : 'Contacts'}</span>
                        <span>•</span>
                        <span className="font-mono">ID: {business._id}</span>
                        {business.city && (
                            <>
                                <span>•</span>
                                <span>{business.city}, {business.state}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}