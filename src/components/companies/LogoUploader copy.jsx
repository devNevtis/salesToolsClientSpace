// src/components/companies/LogoUploader.jsx
"use client";
import { useState } from "react";
import { Upload, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { useLogoUploader } from "@/hooks/use-logo-uploader";
import useCompanyTheme from '@/store/useCompanyTheme';
import { cn } from "@/lib/utils";

export const LogoUploader = () => {
  const { theme, setTheme } = useCompanyTheme();
  const [preview, setPreview] = useState(theme.logo || null);
  const { uploadLogo, isUploading } = useLogoUploader();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Crear preview temporal
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    const fileUrl = await uploadLogo(file);
    if (fileUrl) {
      setTheme({ ...theme, logo: fileUrl });
    }
  };

  const handleRemoveLogo = () => {
    setTheme({ ...theme, logo: "" });
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
        <div className="flex flex-col items-center justify-center gap-2">
          {preview ? (
            <div className="relative">
              <img 
                src={preview} 
                alt="Logo preview" 
                className="max-h-[100px] w-auto object-contain"
              />
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="p-4 rounded-full bg-gray-100">
                <ImageIcon className="h-8 w-8 text-gray-600" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium">Upload your company logo</p>
                <p className="text-xs text-gray-500">
                  SVG, PNG, JPG or GIF (MAX. 800×400px)
                </p>
              </div>
            </>
          )}
          
          <input
            type="file"
            id="logo-upload"
            accept="image/*"
            className="sr-only"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <label
            htmlFor="logo-upload"
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium",
              "bg-blue-500 text-white hover:bg-blue-600",
              "cursor-pointer transition-colors",
              isUploading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {isUploading ? "Uploading..." : preview ? "Change logo" : "Select file"}
          </label>
        </div>
      </div>
    </div>
  );
};