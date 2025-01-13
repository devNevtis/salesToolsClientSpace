//src/components/leads/ContactForm.jsx
'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/components/AuthProvider";
import useLeadCreationStore from "@/store/useLeadCreationStore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { 
  PhoneCall, 
  Mail, 
  MessageSquare, 
  MessageCircle,
  Globe,
  Facebook 
} from "lucide-react";
import useLeadsStore from "@/store/useLeadsStore";

export default function ContactForm({ onSuccess }) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    contactData, 
    setContactData, 
    createContact,
    setStep,
    isLoading,
    error 
  } = useLeadCreationStore();

  const fetchBusinesses = useLeadsStore((state) => state.fetchBusinesses);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createContact(user._id, user.name);
      // Refrescar los datos
      await fetchBusinesses(user);
      toast({
        title: "Success",
        description: "Lead created successfully"
      });
      onSuccess?.();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Something went wrong"
      });
    }
  };
  
  const handleBack = () => {
    setStep(1);
  };

  const toggleDndSetting = (setting) => {
    setContactData({
      dndSettings: {
        ...contactData.dndSettings,
        [setting]: {
          status: !contactData.dndSettings[setting].status
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* First Name & Last Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={contactData.firstName}
            onChange={(e) => setContactData({ firstName: e.target.value })}
            placeholder="First Name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={contactData.lastName}
            onChange={(e) => setContactData({ lastName: e.target.value })}
            placeholder="Last Name"
            required
          />
        </div>

        {/* Email & Phone */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={contactData.email}
            onChange={(e) => setContactData({ email: e.target.value })}
            placeholder="Email"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={contactData.phone}
            onChange={(e) => setContactData({ phone: e.target.value })}
            placeholder="Phone Number"
            required
          />
        </div>

        {/* Address */}
        <div className="col-span-2 space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={contactData.address}
            onChange={(e) => setContactData({ address: e.target.value })}
            placeholder="Address"
            required
          />
        </div>

        {/* City, State, ZIP */}
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={contactData.city}
            onChange={(e) => setContactData({ city: e.target.value })}
            placeholder="City"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={contactData.state}
            onChange={(e) => setContactData({ state: e.target.value })}
            placeholder="State"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            value={contactData.postalCode}
            onChange={(e) => setContactData({ postalCode: e.target.value })}
            placeholder="Postal Code"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={contactData.country}
            onChange={(e) => setContactData({ country: e.target.value })}
            placeholder="Country"
            required
          />
        </div>

        {/* Source */}
        <div className="col-span-2 space-y-2">
          <Label htmlFor="source">Source</Label>
          <Input
            id="source"
            value={contactData.source}
            onChange={(e) => setContactData({ source: e.target.value })}
            placeholder="Lead Source"
            required
          />
        </div>

        {/* DND Settings */}
        <div className="col-span-2 space-y-4">
          <Label>DND Settings</Label>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dnd-call"
                checked={contactData.dndSettings.Call.status}
                onCheckedChange={() => toggleDndSetting('Call')}
              />
              <Label htmlFor="dnd-call" className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4" />
                Call
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dnd-email"
                checked={contactData.dndSettings.Email.status}
                onCheckedChange={() => toggleDndSetting('Email')}
              />
              <Label htmlFor="dnd-email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dnd-sms"
                checked={contactData.dndSettings.SMS.status}
                onCheckedChange={() => toggleDndSetting('SMS')}
              />
              <Label htmlFor="dnd-sms" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                SMS
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dnd-whatsapp"
                checked={contactData.dndSettings.WhatsApp.status}
                onCheckedChange={() => toggleDndSetting('WhatsApp')}
              />
              <Label htmlFor="dnd-whatsapp" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dnd-gmb"
                checked={contactData.dndSettings.GMB.status}
                onCheckedChange={() => toggleDndSetting('GMB')}
              />
              <Label htmlFor="dnd-gmb" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                GMB
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dnd-fb"
                checked={contactData.dndSettings.FB.status}
                onCheckedChange={() => toggleDndSetting('FB')}
              />
              <Label htmlFor="dnd-fb" className="flex items-center gap-2">
                <Facebook className="h-4 w-4" />
                FB
              </Label>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <div className="flex justify-between gap-4">
        <Button 
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button 
          type="submit"
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Lead & Contact"}
        </Button>
      </div>
    </form>
  );
}