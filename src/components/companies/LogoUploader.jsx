// src/components/companies/LogoUploader.jsx
'use client';
import { useState, useEffect } from 'react'; // Añadimos useEffect
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { useLogoUploader } from '@/hooks/use-logo-uploader';
import useCompanyTheme from '@/store/useCompanyTheme';

export const LogoUploader = () => {
  const { theme, setTheme } = useCompanyTheme();
  const [preview, setPreview] = useState(null);
  const { uploadLogo, isUploading } = useLogoUploader();

  // Sincronizamos el preview con el logo del theme
  useEffect(() => {
    if (theme.logo) {
      setPreview(theme.logo);
    }
  }, [theme.logo]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    const fileUrl = await uploadLogo(file);
    if (fileUrl) {
      setTheme({ ...theme, logo: fileUrl });
    }
  };

  const handleRemoveLogo = () => {
    setTheme({ ...theme, logo: '' });
    setPreview(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-gray-700">Company Logo</h3>
        <span className="text-sm text-gray-500">
          Upload your company logo here
        </span>
      </div>

      <div className="mt-2">
        {preview ? (
          <div className="relative w-full bg-white rounded-lg border-2 border-dashed border-gray-300 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Logo preview"
              className="max-h-[100px] w-auto mx-auto object-contain"
            />
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
            {/* Añadimos la opción de cambiar el logo debajo de la imagen */}
            <label
              htmlFor="logo-upload"
              className="block w-full text-center mt-4 text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                className="sr-only"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              Change logo
            </label>
          </div>
        ) : (
          <label
            htmlFor="logo-upload"
            className="w-full h-[200px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <input
              type="file"
              id="logo-upload"
              accept="image/*"
              className="sr-only"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <Upload className="h-10 w-10 text-gray-400 mb-4" />
            <div className="text-center">
              <p className="text-base">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500">
                SVG, PNG, JPG or GIF (MAX. 800×400px)
              </p>
            </div>
          </label>
        )}
      </div>

      {/* Debug info en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500">
          <p>Current logo URL: {theme.logo || 'None'}</p>
        </div>
      )}
    </div>
  );
};
