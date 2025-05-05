// src/app/v/[filename]/[videoFilename]/page.jsx
// *** SERVER COMPONENT - Final con Video.js + Logo Overlay ***

import React from 'react';
// Importamos el componente actualizado que usa Video.js
import VideoPlayerJS from '@/components/videoPlayer/VideoPlayerJS'; // Ajusta la ruta

// URLs Base
const LOGO_BASE_URL = 'https://api.nevtis.com/marketplace/files/list/';
const VIDEO_API_BASE_URL = 'https://api.nevtis.com/marketplace/files/video/';

// --- generateMetadata (SIN CAMBIOS - Mantenemos tu versión funcional) ---
export const generateMetadata = ({ params }) => {
  console.log('--- [generateMetadata Execution Start - Final Version] ---');
  // console.log('[Debug] Received params:', params); // Descomenta si necesitas

  const logoFilename = decodeURIComponent(params?.filename || '');
  const videoFilenameDecoded = decodeURIComponent(
    params?.videoFilename || 'default-video.mp4'
  );

  const videoUrl = `${VIDEO_API_BASE_URL}${videoFilenameDecoded}`;
  const fullLogoUrl = logoFilename ? `${LOGO_BASE_URL}${logoFilename}` : '';
  // El thumbnail se usa para los metatags 'og:image', 'twitter:image'
  const thumbnailUrl =
    fullLogoUrl ||
    `https://placehold.co/640x360/0d9488/ffffff?text=Video:${videoFilenameDecoded.substring(
      0,
      10
    )}...`;

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://app.salestoolspro.com';
  const pagePath = `/v/${params?.filename || ''}/${
    params?.videoFilename || ''
  }`;
  const absolutePageUrl = `${baseUrl}${pagePath}`;

  // console.log('[Debug] Constructed videoUrl:', videoUrl); // Descomenta si necesitas
  // console.log('[Debug] Constructed thumbnailUrl:', thumbnailUrl); // Descomenta si necesitas

  const metadata = {
    title: `Shared Video: ${videoFilenameDecoded}`,
    description: 'Watch this personalized video.',
    openGraph: {
      title: `Video: ${videoFilenameDecoded}`,
      description: 'Watch this video.',
      url: absolutePageUrl,
      siteName: 'SalesToolsPro',
      images: [
        { url: thumbnailUrl, width: 640, height: 360, alt: 'Video preview' },
      ],
      locale: 'en_US',
      type: 'video.other',
    },
    twitter: {
      card: 'player',
      title: `Video: ${videoFilenameDecoded}`,
      description: 'Watch this video.',
      image: { url: thumbnailUrl, alt: 'Video preview' },
    },
    other: {
      // Mantenemos los tags explícitos que funcionaron
      'og:video:url': videoUrl,
      'og:video:secure_url': videoUrl,
      'og:video:type': 'video/mp4',
      'og:video:width': '640',
      'og:video:height': '360',
      'twitter:player': videoUrl,
      'twitter:player:width': '640',
      'twitter:player:height': '360',
    },
  };
  // console.log('--- [generateMetadata Returning Object] ---');
  // console.log(JSON.stringify(metadata, null, 2)); // Descomenta si necesitas

  return metadata;
};

// --- Page Component (Server Component) ---
export default function VideoPage({ params }) {
  // Decodificar parámetros
  const logoFilename = decodeURIComponent(params?.filename || '');
  const videoFilenameDecoded = decodeURIComponent(
    params?.videoFilename || 'default-video.mp4'
  );

  // Reconstruir URLs necesarias para el cliente
  const videoUrl = `${VIDEO_API_BASE_URL}${videoFilenameDecoded}`;
  const fullLogoUrl = logoFilename ? `${LOGO_BASE_URL}${logoFilename}` : ''; // Para el logo overlay

  // Renderizar la estructura de la página
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-2xl text-white font-semibold mb-8">
        <span className="bg-teal-800 px-4 py-2 rounded-full shadow-md">
          Your Personalized Video
        </span>
      </h1>

      {/* Contenedor principal relativo para el video y el overlay */}
      <div className="relative w-full max-w-3xl mx-auto shadow-xl shadow-teal-900/30 rounded-lg overflow-hidden border-2 border-teal-700">
        {/* Renderiza el componente VideoPlayerJS */}
        {/* Solo necesita la URL del video ahora */}
        <VideoPlayerJS videoUrl={videoUrl} />

        {/* Logo Overlay (AHORA DESCOMENTADO) */}
        {/* Se muestra siempre en la esquina superior derecha */}
        {fullLogoUrl && (
          <img
            src={fullLogoUrl}
            alt="Company Logo Watermark"
            // Clases para posicionar el overlay sobre el video
            className="absolute top-4 right-4 w-16 h-auto md:w-24 opacity-70 pointer-events-none transition-opacity duration-300 hover:opacity-90 z-10"
          />
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-400 text-sm">
        <p>Powered by SalesToolsPro</p>
      </div>
    </main>
  );
}
