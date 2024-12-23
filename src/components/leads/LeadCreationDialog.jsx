//src/components/leads/LeadCreationDialog.jsx
'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import BusinessForm from "./BusinessForm";
import ContactForm from "./ContactForm";
import useLeadCreationStore from "@/store/useLeadCreationStore";

export default function LeadCreationDialog({ onLeadCreated }) {
  const [open, setOpen] = useState(false);
  const { currentStep, reset } = useLeadCreationStore();

  // Reset form state when dialog closes
  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) reset();
  };

  // Handle successful lead creation
  const handleLeadCreated = () => {
    setOpen(false);
    onLeadCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>New Lead with Contact</DialogTitle>
          <DialogDescription>
            {currentStep === 1 
              ? "Fill in the Lead information first, then add a Contact."
              : "Now, let's add the Contact information."
            }
          </DialogDescription>
        </DialogHeader>

        {/* Indicador de pasos */}
        <div className="flex justify-center mb-4 flex-shrink-0">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              1
            </div>
            <div className="w-16 h-1 bg-muted mx-2" />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Contenedor con scroll para los formularios */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="py-4">
            {currentStep === 1 ? (
              <BusinessForm />
            ) : (
              <ContactForm onSuccess={handleLeadCreated} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}