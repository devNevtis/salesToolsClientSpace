// components/business/schemas/formSchemas.js
import * as z from 'zod';

export const businessSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
    email: z.string().email("Invalid email address"),
    website: z.string().regex(/^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+/, "Invalid URL format").optional().or(z.literal('')),
    address: z.string().min(5, "Address must be at least 5 characters long"),
    city: z.string().min(2, "City must be at least 2 characters long"),
    description: z.string().optional(),
    state: z.string().min(2, "State must be at least 2 characters long"),
    postalCode: z.string().min(5, "Invalid postal code"),
    country: z.string().min(2, "Country must be at least 2 characters long"),
});

export const contactSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(5, "Phone must be at least 5 characters"),
    source: z.string().optional(),
    dndSettings: z.object({
        Call: z.object({ status: z.string() }),
        Email: z.object({ status: z.string() }),
        SMS: z.object({ status: z.string() }),
        WhatsApp: z.object({ status: z.string() }),
        GMB: z.object({ status: z.string() }),
        FB: z.object({ status: z.string() })
    })
});