//src/components/Sidebar/UserCard.jsx
"use client";
import { useState,useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Upload, X, Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import useCompanyTheme from '@/store/useCompanyTheme';
import { useLogoUploader } from "@/hooks/use-logo-uploader";
import { useToast } from "@/hooks/use-toast";
import { env } from '@/config/env';
import axios from "@/lib/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

const UserCard = () => {
  const { user, updateUserData } = useAuth();
  const { theme } = useCompanyTheme();
  const { toast } = useToast();
  const { uploadLogo: uploadImage, isUploading } = useLogoUploader();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.name?.split(' ')[1] || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.profilePhoto || '');
  const [tempFile, setTempFile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatarPreview: ''
  });

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase() || 'U';
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target.result);
    reader.readAsDataURL(file);
    setTempFile(file);
  };

  // Efecto para cargar datos cuando se abre el dialog
useEffect(() => {
    if (isOpen) {
      const names = user?.name?.split(' ') || ['', ''];
      setFormData({
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        email: user?.email || '',
        avatarPreview: user?.profilePhoto || ''
      });
    }
  }, [isOpen, user]);

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please fill in all required fields.",
      });
      return;
    }
  
    setIsSaving(true);
    try {
      console.log('Starting update process...');
      let profilePhoto = user?.profilePhoto;
  
      if (tempFile) {
        console.log('Uploading new image...');
        const imageUrl = await uploadImage(tempFile);
        console.log('Image upload response:', imageUrl);
        if (imageUrl) {
          profilePhoto = imageUrl;
        }
      }
  
      const fullName = `${formData.firstName} ${formData.lastName}`;
  
      const updateData = {
        _id: user._id,
        name: fullName,
        email: formData.email,
        profilePhoto,
        phone: user.phone, // Mantenemos el teléfono existente
      };
      
      const response = await axios.put(
        env.endpoints.users.update(user.role),
        updateData
      );
  
      console.log('Update response:', response.data);
  
      updateUserData({
        ...user,
        name: fullName,
        email: formData.email,
        profilePhoto,
      });
  
      setIsOpen(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.response?.data?.message || 
                    error.message || 
                    "Failed to update profile. Check console for details.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  //console.log(user)
  return (
    <Card 
      className="w-full overflow-hidden"
      style={{ backgroundColor: theme.base1 }}
    >
      <div className="px-2 py-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-white">
              <AvatarImage src={user?.profilePhoto} alt={user?.name} />
              <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="absolute -right-2 bottom-0 h-5 w-5 rounded-full"
                  style={{ backgroundColor: theme.base2 }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="white"
                        className="h-3 w-3"
                    >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                    </svg>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={avatarPreview} />
                      <AvatarFallback>{getInitials(`${firstName} ${lastName}`)}</AvatarFallback>
                    </Avatar>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageSelect}
                        disabled={isUploading}
                      />
                      <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                        <Upload className="h-4 w-4" />
                        <span>Change Avatar</span>
                      </div>
                    </label>
                  </div>

                  {/* Name Inputs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Input
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                    </div>
                    <div>
                        <Input
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <Input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || isUploading}
                  >
                    {isSaving || isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex-1 text-white">
            <h3 className="font-semibold leading-none">{user?.name || 'User Name'}</h3>
            <p className="text-sm opacity-90">{user?.role || 'Role'}</p>
            <div className="mt-2 flex items-center gap-1 text-sm opacity-75">
              <span>{user?.leads || 0}</span>
              <span>leads</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-2">
          <p className="text-xs text-white opacity-75 truncate">
            {user?.email || 'user@email.com'}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default UserCard;