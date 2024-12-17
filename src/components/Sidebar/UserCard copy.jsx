//src/components/Sidebar/UserCard.jsx
"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import useCompanyTheme from '@/store/useCompanyTheme';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const UserCard = () => {
  const { user } = useAuth();
  const { theme } = useCompanyTheme();

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase() || 'U';
  };

  return (
    <Card 
      className="w-full overflow-hidden"
      style={{ backgroundColor: theme.base1 }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar y botón de edición */}
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-white">
              <AvatarImage src={user?.profilePhoto} alt={user?.name} />
              <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
            <Dialog>
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
                  {/* <Pencil className="h-1 w-1 text-white" /> */}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-gray-500">Edit profile functionality coming soon...</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Información del usuario */}
          <div className="flex-1 text-white">
            <h3 className="font-semibold leading-none">{user?.name || 'User Name'}</h3>
            <p className="text-sm opacity-90">{user?.role || 'Role'}</p>
            <div className="mt-2 flex items-center gap-1 text-sm opacity-75">
              <span>{user?.leads || 0}</span>
              <span>leads</span>
            </div>
          </div>
        </div>

        {/* Email centrado */}
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