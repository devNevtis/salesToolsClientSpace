// components/leads/dialogs/EditContactDialog.jsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { contactSchema } from "@/components/business/schemas/formSchemas";
import useLeadsStore from "@/store/useLeadsStore2";
import { useAuth } from "@/components/AuthProvider";

export default function EditContactDialog({ 
    open, 
    onOpenChange, 
    contact,
    business,
    currentStatus, // Nueva prop
    onSuccess 
}) {
    const [isLoading, setIsLoading] = useState(false);
    const { updateLead } = useLeadsStore();
    const { user } = useAuth();
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address1: "",
            city: "",
            state: "",
            country: "",
            postalCode: "",
            source: "",
            dndSettings: {
                Call: { status: "false" },
                Email: { status: "false" },
                SMS: { status: "false" },
                WhatsApp: { status: "false" },
                GMB: { status: "false" },
                FB: { status: "false" }
            }
        }
    });

    // Actualizar el formulario cuando el contacto cambia
    useEffect(() => {
        if (contact && open) {
            form.reset({
                firstName: contact.firstName || "",
                lastName: contact.lastName || "",
                email: contact.email || "",
                phone: contact.phone || "",
                address1: contact.address1 || "",
                city: contact.city || "",
                state: contact.state || "",
                country: contact.country || "",
                postalCode: contact.postalCode || "",
                source: contact.source || "",
                dndSettings: contact.dndSettings || {
                    Call: { status: "false" },
                    Email: { status: "false" },
                    SMS: { status: "false" },
                    WhatsApp: { status: "false" },
                    GMB: { status: "false" },
                    FB: { status: "false" }
                }
            });
        }
    }, [contact, open, form]);

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            
            // Preparar los datos actualizados
            const updatedData = {
                ...contact,
                ...data,
                name: `${data.firstName} ${data.lastName}`,
                status: currentStatus, // Usar el status actual del business
                // Mantener la referencia al business
                business: {
                    _id: business._id,
                    name: business.name
                },
                // Mantener la referencia al usuario
                user: {
                    _id: user._id,
                    name: user.name
                }
            };

            const result = await updateLead(updatedData);

            if (result.success) {
                toast({
                    title: "Success",
                    description: "Contact updated successfully",
                    variant: "success",
                });
                onSuccess?.();
                onOpenChange(false);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to update contact",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Obtener el estilo del badge según el status
    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case 'new':
                return 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20';
            case 'qualified':
                return 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20';
            case 'discussion':
                return 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20';
            case 'negotiation':
                return 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20';
            case 'won':
                return 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20';
            case 'lost':
                return 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20';
            default:
                return 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20';
        }
    };

    return (
<Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[900px] max-h-[95vh]"> {/* Aumentamos el ancho y alto máximo */}
        <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>
                Edit contact information for {contact?.firstName} {contact?.lastName}.
            </DialogDescription>
        </DialogHeader>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Status Badge */}
                <div className="space-y-2">
                    <FormLabel>Status</FormLabel>
                    <div>
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusBadgeStyle(currentStatus)}`}>
                            {currentStatus}
                        </span>
                    </div>
                </div>

                {/* Basic Information - 3 columnas */}
                <div className="grid grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="source"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Source</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Contact Information - 2 columnas */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" {...field} />
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
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Address Fields - 2 filas, distribución optimizada */}
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="address1"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-4 gap-4">
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
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
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="postalCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Postal Code</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
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
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* DND Settings - 3 columnas */}
                <div className="space-y-2">
                    <FormLabel>Communication Preferences</FormLabel>
                    <div className="grid grid-cols-3 gap-4">
                        {Object.keys(form.getValues("dndSettings")).map((channel) => (
                            <FormField
                                key={channel}
                                control={form.control}
                                name={`dndSettings.${channel}.status`}
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value === "true"}
                                                onCheckedChange={(checked) => {
                                                    field.onChange(checked ? "true" : "false");
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal">
                                            Allow {channel}
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancel
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
                </DialogFooter>
            </form>
        </Form>
    </DialogContent>
</Dialog>
    );
}