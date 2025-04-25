// src/components/videoPlayer/VideoPlayerWithOverlay.jsx
'use client';

import React, { useState, useEffect } from 'react';

// Recibe ambas URLs como props
export default function VideoPlayerWithOverlay({ videoUrl, logoUrl }) {
  const [logoError, setLogoError] = useState(false);

  // Resetear error si la URL del logo cambia
  useEffect(() => {
    setLogoError(false);
    console.log('Received Logo URL Prop:', logoUrl);
  }, [logoUrl]);

  if (!videoUrl) {
    return <p className="text-red-500">Error: Video URL is missing.</p>;
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto shadow-xl shadow-teal-900/30 rounded-lg overflow-hidden border-2 border-teal-700">
      <video
        key={videoUrl}
        src={videoUrl}
        controls
        className="w-full h-auto aspect-video block bg-black"
        preload="metadata"
        onError={(e) => console.error('Error loading video:', e)}
      >
        Your browser doesnt support the video tag.
      </video>

      {/* Logo Overlay */}
      {typeof logoUrl === 'string' && logoUrl.trim() !== '' && !logoError && (
        <img
          key={logoUrl}
          src={logoUrl}
          alt="Company Logo Watermark"
          className="
            absolute top-4 right-4
            w-16 h-auto md:w-24
            opacity-70
            pointer-events-none
            transition-opacity duration-300 hover:opacity-90
          "
          onError={() => {
            console.warn(`Failed to load logo image from prop: ${logoUrl}`);
            setLogoError(true);
          }}
          onLoad={() => {
            console.log(`Logo image loaded successfully from prop: ${logoUrl}`);
          }}
        />
      )}
      {/* Mensaje de Debug si el logo no se muestra */}
      {(!logoUrl || typeof logoUrl !== 'string' || logoUrl.trim() === '') && (
        <p className="absolute top-2 left-2 bg-orange-600 text-white text-xs p-1 rounded">
          Debug: No valid logoUrl prop received.
        </p>
      )}
      {logoError && (
        <p className="absolute top-2 left-2 bg-red-700 text-white text-xs p-1 rounded">
          Debug: Logo prop failed to load.
        </p>
      )}
    </div>
  );
}
