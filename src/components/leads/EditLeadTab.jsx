// components/leads/EditLeadTab.jsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import useLeadsStore from "@/store/useLeadsStore2";
import useBusinessStore from "@/store/useBusinessStore";
import { businessSchema, STATUS_OPTIONS } from '@/components/schemas/formSchemas';
import AssociatedContactsSection from "./AssociatedContactsSection";
import { useAuth } from "@/components/AuthProvider";

export default function EditLeadTab({ business }) {
    const [isLoading, setIsLoading] = useState(false);
    const { updateBusiness, getBusinessContacts, fetchContacts, fetchBusinesses } = useBusinessStore();
    const { updateLead, fetchLeads } = useLeadsStore();
    const { user } = useAuth();
    const { toast } = useToast();
    
    // Obtener contacts y status inicial
    const associatedContacts = getBusinessContacts(business._id);
    const initialStatus = associatedContacts[0]?.status || "new";

    const form = useForm({
        resolver: zodResolver(businessSchema),
        defaultValues: {
            name: business?.name || "",
            email: business?.email || "",
            phone: business?.phone || "",
            website: business?.website || "",
            address: business?.address || "",
            city: business?.city || "",
            description: business?.description || "",
            state: business?.state || "",
            postalCode: business?.postalCode || "",
            country: business?.country || "",
            status: initialStatus, // Agregar status inicial
        },
    });

    const onSubmit = async (data) => {
        try {
          setIsLoading(true);
          // 1. Actualizar business
          const businessResult = await updateBusiness(business._id, data);
          // 2. Obtener todos los contactos asociados
          const contacts = getBusinessContacts(business._id);
          // 3. Actualizar cada contacto con el nuevo status
          const contactUpdates = contacts.map(async (contact) => {
            const updatedContact = {
              ...contact,
              status: data.status
            };
            return updateLead(updatedContact);
          });
          // 4. Esperar que todas las actualizaciones terminen
          await Promise.all(contactUpdates);
    
          if (businessResult.success) {
            toast({
              title: "Changes saved",
              description: "Business and contacts information updated successfully",
              variant: "success",
              className: "bg-green-50 border-green-200 text-green-900",
            });
            // 5. Refrescar los datos
            await Promise.all([
                fetchContacts(),
                fetchLeads(),
                fetchBusinesses(user)
            ]);
          }
        } catch (error) {
          toast({
            title: "Error",
            description: error.message || "Please try again",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4 h-[57vh] overflow-y-auto">
            <Card>
                <CardContent className="pt-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Status Section - Nuevo */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Lead Status</h3>
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Current Status</FormLabel>
                                            <Select 
                                                onValueChange={field.onChange} 
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {STATUS_OPTIONS.map((status) => (
                                                        <SelectItem 
                                                            key={status} 
                                                            value={status}
                                                            className="capitalize"
                                                        >
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {/* Basic Information Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Basic Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Company Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter company name" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="website"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Website</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter website URL" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Contact Information Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Contact Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="email" placeholder="Enter email" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter phone number" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Address</h3>
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Street Address</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter street address" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>City</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter city" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>State</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter state" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="postalCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Postal Code</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter postal code" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Country</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter country" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => form.reset()}
                                    disabled={isLoading}
                                >
                                    Reset
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Aquí irá la sección de Contacts Management que implementaremos después */}
            <AssociatedContactsSection 
                businessId={business._id}
                currentStatus={form.watch("status")} // Pasar el status actual a los contacts
            />
        </div>
    );
}