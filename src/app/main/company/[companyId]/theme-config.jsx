// src/app/main/company/[companyId]/theme-config.jsx
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import useCompanyTheme from '@/store/useCompanyTheme';
import { LogoUploader } from '@/components/companies/LogoUploader';
import { ThemeSkeleton } from '@/components/skeletons/ThemeSkeleton';
import axios from '@/lib/axios';
import { env } from '@/config/env';
import { MdColorLens } from 'react-icons/md';
import { Loader2 } from 'lucide-react';

const ColorInput = ({ label, value = '', onChange }) => {
  const isValidHex = typeof value === 'string' && /^#[0-9A-F]{6}$/i.test(value);
  const safeValue = isValidHex ? value : '#000000';

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
      <span className="font-medium text-gray-700 shrink-0">{label}</span>
      <div className="flex items-center gap-2 sm:gap-3 justify-start">
        {' '}
        <div
          className="w-8 h-8 rounded border shadow-sm shrink-0"
          style={{ backgroundColor: safeValue }}
        />
        <Input
          type="text"
          value={safeValue}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          className="w-full sm:w-28 text-sm"
          placeholder="#RRGGBB"
          maxLength={7}
        />
        <Input
          type="color"
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 p-0 border-0 rounded cursor-pointer overflow-hidden appearance-none shrink-0 bg-transparent"
          title="Select Color"
        />
      </div>
    </div>
  );
};

export default function ThemeConfig({ companyId }) {
  const { theme, setTheme, fetchTheme } = useCompanyTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadTheme = async () => {
      setIsLoading(true);
      try {
        if (fetchTheme) {
          await fetchTheme(companyId);
        } else {
          console.warn(
            'fetchTheme function not found in useCompanyTheme store.'
          );
        }
      } catch (error) {
        console.error('Error loading initial theme:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };
    if (companyId) {
      loadTheme();
    } else {
      setIsLoading(false);
    }
  }, [companyId, fetchTheme]);

  const handleColorChange = (colorKey, value) => {
    if (/^#([0-9A-F]{3}){1,2}$/i.test(value) || value === '') {
      setTheme({
        ...theme,
        [colorKey]: value,
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const themeToSave = { ...theme };
      let isValid = true;
      Object.keys(themeToSave).forEach((key) => {
        if (
          key !== 'logo' &&
          (typeof themeToSave[key] !== 'string' ||
            !/^#[0-9A-F]{6}$/i.test(themeToSave[key]))
        ) {
          isValid = false;
          toast({
            variant: 'destructive',
            title: 'Invalid Color',
            description: `Please enter a valid hex color for ${key}.`,
          });
        }
      });

      if (!isValid) {
        setIsSaving(false);
        return;
      }
      await axios.put(`${env.endpoints.company.getById(companyId)}`, {
        'configuration.theme': themeToSave,
      });

      toast({
        title: 'Theme updated successfully',
        description: 'Your theme changes have been saved.',
      });
    } catch (error) {
      console.error('Error saving theme:', error);
      toast({
        variant: 'destructive',
        title: 'Error saving theme',
        description: error.response?.data?.message || 'Failed to save changes.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <ThemeSkeleton />;
  }

  return (
    <div className="mt-0">
      {' '}
      <div className="flex items-center gap-2 mb-4">
        <MdColorLens className="text-2xl text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-700">
          Theme Customization
        </h2>
        <span className="text-sm text-gray-500 ml-2 hidden sm:inline">
          Personalize your app&#34;s look and feel
        </span>
      </div>
      {/* Card para el Logo */}
      <Card className="shadow-md mb-6 border">
        <CardContent className="pt-6 pb-4">
          {' '}
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Company Logo
          </h3>
          <LogoUploader />
        </CardContent>
      </Card>
      <Card className="shadow-md border">
        <CardContent className="pt-6 pb-4">
          {' '}
          <h3 className="text-lg font-semibold mb-6 text-gray-800">
            Color Scheme
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-10 gap-y-2 md:gap-y-0">
            {' '}
            <div>
              <ColorInput
                label="Base 1 (Primary)"
                value={theme?.base1}
                onChange={(value) => handleColorChange('base1', value)}
              />
              <ColorInput
                label="Highlighting (Accent)"
                value={theme?.highlighting}
                onChange={(value) => handleColorChange('highlighting', value)}
              />
            </div>
            <div>
              <ColorInput
                label="Base 2 (Secondary)"
                value={theme?.base2}
                onChange={(value) => handleColorChange('base2', value)}
              />
              <ColorInput
                label="Call to Action"
                value={theme?.callToAction}
                onChange={(value) => handleColorChange('callToAction', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end mt-6">
        <Button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            'Save Theme'
          )}
        </Button>
      </div>
    </div>
  );
}
