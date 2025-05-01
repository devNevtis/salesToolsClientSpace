// src/app/v/[filename]/[videoFilename]/page.jsx
// *** SERVER COMPONENT (CORREGIDO) ***

import React from 'react';
import VideoPlayerWithOverlay from '@/components/videoPlayer/VideoPlayerWithOverlay';

// Base URL para reconstruir la URL del logo
const LOGO_BASE_URL = 'https://api.nevtis.com/marketplace/files/list/';

// --- METADATA (CORREGIDO) ---
export const generateMetadata = ({ params }) => {
  console.log('--- generateMetadata ---'); // <-- Log de inicio
  console.log('Received params:', params); // <-- Verifica los parámetros recibidos
  // Leer los parámetros CORRECTOS y decodificar
  const logoFilename = decodeURIComponent(params?.filename || ''); // <-- 'filename' es para el logo
  const videoFilename = decodeURIComponent(
    params?.videoFilename || 'default-video.mp4'
  );

  console.log('Decoded logoFilename:', logoFilename); // <-- Verifica el nombre del logo
  console.log('Decoded videoFilename:', videoFilename); // <-- Verifica el nombre del video

  // Reconstruir URLs para metadata
  const videoUrl = `https://nnvacoezmfrxapmljcaq.supabase.co/storage/v1/object/public/videos/${videoFilename}`;
  const fullLogoUrl = logoFilename ? `${LOGO_BASE_URL}${logoFilename}` : '';

  const thumbnailUrl =
    fullLogoUrl ||
    `https://placehold.co/640x360/0d9488/ffffff?text=Video:${videoFilename.substring(
      0,
      10
    )}...`;

  return {
    title: `Video: ${videoFilename}`,
    description: 'Watch this video.',
    openGraph: {
      title: `Video: ${videoFilename}`,
      description: 'Watch this video.',
      images: [
        { url: thumbnailUrl, width: 640, height: 360, alt: 'Video Thumbnail' },
      ],
      video: { url: videoUrl, type: 'video/mp4', width: 640, height: 360 },
      type: 'video.other',
      url: `/v/${params?.filename || ''}/${params?.videoFilename || ''}`,
      siteName: 'SalesToolsPro',
    },
    twitter: {
      card: 'player',
      title: `Video: ${videoFilename}`,
      description: 'Watch this video.',
      image: thumbnailUrl,
      player: videoUrl,
      playerWidth: 640,
      playerHeight: 360,
    },
  };
};

// --- Componente de Página ---
export default function VideoPage({ params }) {
  // Leer y decodificar los parámetros CORRECTOS
  const logoFilename = decodeURIComponent(params?.filename || '');
  const videoFilename = decodeURIComponent(
    params?.videoFilename || 'default-video.mp4'
  );

  // Reconstruir URLs para pasar al cliente
  const videoUrl = `https://nnvacoezmfrxapmljcaq.supabase.co/storage/v1/object/public/videos/${videoFilename}`;
  const fullLogoUrl = logoFilename ? `${LOGO_BASE_URL}${logoFilename}` : '';

  // Verificar las URLs construidas en la consola del servidor
  //console.log('Server - Video URL:', videoUrl);
  //console.log('Server - Logo URL:', fullLogoUrl);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-2xl text-white font-semibold mb-8">
        <span className="bg-teal-800 px-4 py-2 rounded-full shadow-md">
          Your Video
        </span>
      </h1>

      {/* Pasar ambas URLs reconstruidas (ahora correctas) al Componente Cliente */}
      <VideoPlayerWithOverlay videoUrl={videoUrl} logoUrl={fullLogoUrl} />
    </main>
  );
}
