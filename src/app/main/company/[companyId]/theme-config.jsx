// src/app/main/company/[companyId]/theme-config.jsx
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useCompanyTheme from '@/store/useCompanyTheme';
import { LogoUploader } from "@/components/companies/LogoUploader";
import { ThemeSkeleton } from "@/components/skeletons/ThemeSkeleton";
import axios from '@/lib/axios';
import { env } from '@/config/env';
import { MdColorLens } from "react-icons/md";
import { Loader2 } from "lucide-react";

const ColorInput = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between mb-6 gap-4">
    <div className="flex items-center gap-2">
      <span className="font-medium text-gray-700">{label}</span>
    </div>
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded border shadow-sm"
        style={{ backgroundColor: value }}
      />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-28 text-sm"
        placeholder="#000000"
      />
      <Input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-8 p-0 overflow-hidden"
      />
    </div>
  </div>
);

export default function ThemeConfig({ companyId }) {
  const { theme, setTheme } = useCompanyTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulamos un tiempo mínimo de carga para evitar flasheos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [theme]);

  const handleColorChange = (colorKey, value) => {
    setTheme({
      ...theme,
      [colorKey]: value
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Primero obtenemos los datos actuales
      const response = await axios.get(`${env.endpoints.company.getById(companyId)}`);
      const currentConfiguration = response.data.configuration;
  
      await axios.put(`${env.endpoints.company.getById(companyId)}`, {
        configuration: {
          ...currentConfiguration,  // Mantenemos stages y cualquier otra config
          theme: theme             // Actualizamos solo el theme
        }
      });
      
      toast({
        title: "Theme updated successfully",
        description: "Your theme changes have been saved.",
      });
    } catch (error) {
      console.error('Error saving theme:', error);
      toast({
        variant: "destructive",
        title: "Error saving theme",
        description: "There was a problem saving your changes. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <ThemeSkeleton />;
  }

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <div className="flex items-center gap-2 mb-4">
        <MdColorLens className="text-2xl text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-700">Theme Customization</h2>
        <span className="text-sm text-gray-500 ml-2">Personalize your app's look and feel</span>
      </div>

      <Card className="shadow-md mb-6">
        <CardContent className="pt-4">
          <h3 className="text-lg font-semibold mb-4">Company Logo</h3>
          <LogoUploader />
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardContent className="pt-4">
          <h3 className="text-lg font-semibold mb-4">Color Scheme</h3>
          <div className="grid grid-cols-2 gap-x-12">
            <div>
              <ColorInput
                label="Base 1"
                value={theme.base1}
                onChange={(value) => handleColorChange('base1', value)}
              />
              <ColorInput
                label="Highlighting"
                value={theme.highlighting}
                onChange={(value) => handleColorChange('highlighting', value)}
              />
            </div>
            <div>
              <ColorInput
                label="Base 2"
                value={theme.base2}
                onChange={(value) => handleColorChange('base2', value)}
              />
              <ColorInput
                label="Call to Action"
                value={theme.callToAction}
                onChange={(value) => handleColorChange('callToAction', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving changes
            </>
          ) : (
            'Save look'
          )}
        </Button>
      </div>
    </div>
  );
}