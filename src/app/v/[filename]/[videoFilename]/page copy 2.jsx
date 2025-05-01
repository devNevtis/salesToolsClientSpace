// src/app/v/[filename]/[videoFilename]/page.jsx
// *** SERVER COMPONENT CON DEPURACIÓN Y URL ABSOLUTA ***

import React from 'react';
import VideoPlayerWithOverlay from '@/components/videoPlayer/VideoPlayerWithOverlay';

// Base URL para reconstruir la URL del logo (Asegúrate que esta URL sea correcta)
const LOGO_BASE_URL = 'https://api.nevtis.com/marketplace/files/list/';

// --- METADATA CON DEPURACIÓN ---
export const generateMetadata = ({ params }) => {
  // --- Inicio de Depuración ---
  console.log('--- [generateMetadata Execution Start] ---');
  console.log('[Debug] Received params:', params);
  // --- Fin de Depuración ---

  // Leer los parámetros y decodificar
  const logoFilename = decodeURIComponent(params?.filename || '');
  const videoFilename = decodeURIComponent(
    params?.videoFilename || 'default-video.mp4' // Usar un video por defecto si no viene
  );

  // --- Depuración de Parámetros Decodificados ---
  console.log('[Debug] Decoded logoFilename:', logoFilename);
  console.log('[Debug] Decoded videoFilename:', videoFilename);
  // --- Fin de Depuración ---

  // Reconstruir URLs para metadata y componente
  // Asegúrate que la URL base de Supabase y la estructura sean correctas
  const videoUrl = `https://nnvacoezmfrxapmljcaq.supabase.co/storage/v1/object/public/videos/${videoFilename}`;
  const fullLogoUrl = logoFilename ? `${LOGO_BASE_URL}${logoFilename}` : '';

  // Determinar la URL de la miniatura (thumbnail)
  // Si hay logo, usa el logo. Si no, usa placeholder.
  // Considera reemplazar esto con un thumbnail/GIF real del video más adelante.
  const thumbnailUrl =
    fullLogoUrl || // Prioriza el logo si existe
    `https://placehold.co/640x360/0d9488/ffffff?text=Video:${videoFilename.substring(
      0,
      10
    )}...`; // Placeholder si no hay logo

  // --- Depuración de URLs Construidas ---
  console.log('[Debug] Constructed videoUrl:', videoUrl);
  console.log('[Debug] Constructed fullLogoUrl:', fullLogoUrl);
  console.log('[Debug] Constructed thumbnailUrl:', thumbnailUrl);
  // --- Fin de Depuración ---

  // --- Construcción de URL Absoluta para la Página ---
  // Mejor práctica: Usa una variable de entorno (ej: process.env.NEXT_PUBLIC_APP_URL)
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://app.salestoolspro.com';
  const pagePath = `/v/${params?.filename || ''}/${
    params?.videoFilename || ''
  }`;
  const absolutePageUrl = `${baseUrl}${pagePath}`;

  console.log('[Debug] Constructed absolutePageUrl:', absolutePageUrl);
  // --- Fin de Construcción ---

  // Construir el objeto de metadatos completo
  const metadata = {
    // Título principal de la página HTML
    title: `Video Compartido: ${videoFilename}`, // Puedes ajustar este título
    description: 'Mira este video personalizado.', // Puedes ajustar esta descripción

    // Metatags Open Graph (para Facebook, iMessage, LinkedIn, etc.)
    openGraph: {
      title: `Video: ${videoFilename}`, // Título para la previsualización
      description: 'Mira este video.', // Descripción para la previsualización
      url: absolutePageUrl, // <-- URL Canónica ABSOLUTA de esta página
      siteName: 'SalesToolsPro', // Nombre de tu sitio/aplicación
      images: [
        {
          url: thumbnailUrl, // URL de la imagen de previsualización (logo o placeholder)
          width: 640, // Ancho de la imagen (ajusta si es necesario)
          height: 360, // Alto de la imagen (ajusta si es necesario)
          alt: 'Vista previa del video', // Texto alternativo para la imagen
        },
      ],
      locale: 'es_CO', // Opcional: especifica el idioma/región
      type: 'video.other', // Indica que el contenido principal es un video

      // Metadatos específicos del video para Open Graph
      video: {
        url: videoUrl, // <-- URL directa al archivo de video MP4
        secure_url: videoUrl, // <-- Misma URL pero asegurando HTTPS (si aplica)
        type: 'video/mp4', // Tipo MIME del video
        width: 640, // Ancho del video (ajusta a las dimensiones reales si es diferente)
        height: 360, // Alto del video (ajusta a las dimensiones reales si es diferente)
      },
    },

    // Metatags Twitter Card (para previsualizaciones en Twitter)
    twitter: {
      card: 'player', // Tipo de tarjeta: reproductor de video
      title: `Video: ${videoFilename}`, // Título para Twitter
      description: 'Mira este video.', // Descripción para Twitter
      image: {
        url: thumbnailUrl, // Imagen de previsualización para Twitter
        alt: 'Vista previa del video', // Texto alternativo
      },
      player: {
        url: videoUrl, // <-- URL directa al archivo de video MP4 para el reproductor de Twitter
        width: 640, // Ancho del reproductor
        height: 360, // Alto del reproductor
      },
      // Opcional: puedes añadir @tuUsuarioDeTwitter via 'site' o 'creator'
      // site: '@tuUsuarioSitio',
      // creator: '@tuUsuarioCreador',
    },

    // Opcional: Control de indexación por robots
    // robots: { index: false, follow: false } // Descomenta si NO quieres que Google indexe estas páginas
  };

  // --- Depuración del Objeto Final de Metadatos ---
  console.log('--- [generateMetadata Returning Object] ---');
  // Usamos JSON.stringify para ver claramente la estructura completa en la consola
  console.log(JSON.stringify(metadata, null, 2));
  // --- Fin de Depuración ---

  return metadata; // Retorna el objeto completo para que Next.js genere los tags
};

// --- Componente de Página (Server Component) ---
export default function VideoPage({ params }) {
  // Leer y decodificar los parámetros OTRA VEZ para pasarlos al cliente
  // (generateMetadata y el componente se ejecutan separadamente en el servidor)
  const logoFilename = decodeURIComponent(params?.filename || '');
  const videoFilename = decodeURIComponent(
    params?.videoFilename || 'default-video.mp4'
  );

  // Reconstruir URLs para pasar al componente cliente VideoPlayerWithOverlay
  // (Esta lógica se repite un poco, podrías refactorizarla a una función helper si quieres)
  const videoUrl = `https://nnvacoezmfrxapmljcaq.supabase.co/storage/v1/object/public/videos/${videoFilename}`;
  const fullLogoUrl = logoFilename ? `${LOGO_BASE_URL}${logoFilename}` : '';

  // Renderizar la estructura de la página
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-2xl text-white font-semibold mb-8">
        <span className="bg-teal-800 px-4 py-2 rounded-full shadow-md">
          Tu Video Personalizado
        </span>
      </h1>

      {/* Renderiza el componente cliente pasándole las URLs necesarias */}
      <VideoPlayerWithOverlay videoUrl={videoUrl} logoUrl={fullLogoUrl} />

      {/* Puedes añadir más elementos a tu página aquí si lo necesitas */}
      {/* <div className="mt-8 text-center text-gray-400">
        <p>Compartido usando SalesToolsPro</p>
      </div> */}
    </main>
  );
}
