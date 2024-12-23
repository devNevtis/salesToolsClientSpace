// src/components/leads/QuickEditDialog.jsx
'use client';

import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import useQuickEditStore from '@/store/useQuickEditStore';
import { Loader2 } from "lucide-react";
import useLeadsStore from "@/store/useLeadsStore";
import { useAuth } from "@/components/AuthProvider";

export default function QuickEditDialog() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { fetchBusinesses } = useLeadsStore();
  const {
    isOpen,
    closeDialog,
    businessData,
    setBusinessData,
    saveChanges,
    isLoading,
    error
  } = useQuickEditStore();

  useEffect(() => {
    if (!isOpen) {
      document.body.style.pointerEvents = 'auto';
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setBusinessData(null);
    }
  }, [isOpen, setBusinessData]);

  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      await saveChanges();
      await fetchBusinesses(user);
      
      toast({
        title: "Changes saved",
        description: "Business information has been updated successfully.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error saving changes",
        description: err.message || "There was a problem updating the business information."
      });
    }
  };

  if (!businessData) return null;

  return (
    <Dialog 
  open={isOpen} 
  onOpenChange={(open) => {
    console.log('Dialog state changing:', open);
    console.log('Current DOM state:', document.body.style.pointerEvents);
    closeDialog();
  }}
>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quick Edit Business</DialogTitle>
          <DialogDescription>
            Make quick changes to the essential business information.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSave} className="grid gap-4 py-4">
          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Business Name</Label>
            <Input
              id="name"
              value={businessData.name}
              onChange={(e) => setBusinessData({ name: e.target.value })}
              placeholder="Enter business name"
              required
            />
          </div>
          
          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={businessData.email}
                onChange={(e) => setBusinessData({ email: e.target.value })}
                placeholder="Enter email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={businessData.phone}
                onChange={(e) => setBusinessData({ phone: e.target.value })}
                placeholder="Enter phone"
                required
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={businessData.address}
              onChange={(e) => setBusinessData({ address: e.target.value })}
              placeholder="Enter address"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={businessData.city}
                onChange={(e) => setBusinessData({ city: e.target.value })}
                placeholder="Enter city"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={businessData.state}
                onChange={(e) => setBusinessData({ state: e.target.value })}
                placeholder="Enter state"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-500 mt-2">
              {error}
            </div>
          )}
          
          <div className="flex justify-end gap-4 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}