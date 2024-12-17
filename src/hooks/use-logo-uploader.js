// src/hooks/use-logo-uploader.js
import { useState } from 'react';
import axios from 'axios';
import { useToast } from './use-toast';

export const useLogoUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadLogo = async (file) => {
    if (!file) return null;

    // Validaciones básicas
    if (!file.type.includes('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file (SVG, PNG, JPG or GIF)"
      });
      return null;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        'https://api.nevtis.com/marketplace/files/create', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const fileUrl = `https://api.nevtis.com/marketplace/files/list/${response.data.key}`;
      
      toast({
        title: "Logo uploaded successfully",
        description: "The logo has been uploaded and saved",
      });

      return fileUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.response?.data?.message || "Failed to upload image. Please try again."
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadLogo,
    isUploading
  };
};