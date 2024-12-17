//src/components/logout/LogoutButton.jsx
"use client";

import React, { useState } from "react";
import { TbLogout } from "react-icons/tb";
import { useAuth } from "../AuthProvider";
import { useRouter } from "next/navigation";
/* import useThemeStore from "@/store/useThemeStore"; */

const LogoutButton = () => {
  const { logout } = useAuth();
  const router = useRouter();
 /*  const { theme } = useThemeStore(); */
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const iconStyle = {
    color: isHovered ? 'white' : 'white',
    transition: 'color 0.3s ease',
  };

  return (
    <button 
      onClick={handleLogout}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="mr-4"
    >
      <TbLogout size={25} style={iconStyle} />
    </button>
  );
};

export default LogoutButton;
