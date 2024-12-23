//src/components/leads/BusinessForm.jsx
'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import useLeadCreationStore from "@/store/useLeadCreationStore";
import { useToast } from "@/hooks/use-toast";

export default function BusinessForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    businessData, 
    setBusinessData, 
    createBusiness,
    isLoading,
    error 
  } = useLeadCreationStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createBusiness(user._id);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Something went wrong"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
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

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={businessData.phone}
            onChange={(e) => setBusinessData({ phone: e.target.value })}
            placeholder="Enter phone number"
            required
          />
        </div>

        {/* Email */}
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

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={businessData.website}
            onChange={(e) => setBusinessData({ website: e.target.value })}
            placeholder="Enter website URL"
            required
          />
        </div>

        {/* Address */}
        <div className="col-span-2 space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={businessData.address}
            onChange={(e) => setBusinessData({ address: e.target.value })}
            placeholder="Enter address"
            required
          />
        </div>

        {/* City */}
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

        {/* State */}
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

        {/* Postal Code */}
        <div className="space-y-2">
          <Label htmlFor="postalCode">ZIP Code</Label>
          <Input
            id="postalCode"
            value={businessData.postalCode}
            onChange={(e) => setBusinessData({ postalCode: e.target.value })}
            placeholder="Enter ZIP code"
            required
          />
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={businessData.country}
            onChange={(e) => setBusinessData({ country: e.target.value })}
            placeholder="Enter country"
            required
          />
        </div>

        {/* Description */}
        <div className="col-span-2 space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={businessData.description}
            onChange={(e) => setBusinessData({ description: e.target.value })}
            placeholder="Enter business description"
            required
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Next"}
      </Button>
    </form>
  );
}