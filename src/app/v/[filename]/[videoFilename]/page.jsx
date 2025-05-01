// src/app/v/[filename]/[videoFilename]/page.jsx
// *** SERVER COMPONENT - PRUEBA CON TAGS EXPLÍCITOS EN 'other' ***

import React from 'react';
import VideoPlayerWithOverlay from '@/components/videoPlayer/VideoPlayerWithOverlay';

// Base URL para reconstruir la URL del logo (Asegúrate que esta URL sea correcta)
const LOGO_BASE_URL = 'https://api.nevtis.com/marketplace/files/list/';

// --- METADATA CON PRUEBA 'other' ---
export const generateMetadata = ({ params }) => {
  console.log('--- [generateMetadata Execution Start - Testing OTHER] ---');
  console.log('[Debug] Received params:', params);

  // --- Cálculo de Nombres de Archivo ---
  const logoFilename = decodeURIComponent(params?.filename || '');
  const videoFilename = decodeURIComponent(
    params?.videoFilename || 'default-video.mp4'
  );
  console.log('[Debug] Decoded logoFilename:', logoFilename);
  console.log('[Debug] Decoded videoFilename:', videoFilename);

  // --- Construcción de URLs ---
  const videoUrl = `https://nnvacoezmfrxapmljcaq.supabase.co/storage/v1/object/public/videos/${videoFilename}`;
  const fullLogoUrl = logoFilename ? `${LOGO_BASE_URL}${logoFilename}` : '';
  const thumbnailUrl =
    fullLogoUrl ||
    `https://placehold.co/640x360/0d9488/ffffff?text=Video:${videoFilename.substring(
      0,
      10
    )}...`;

  // --- URL Absoluta de la Página (Corregida) ---
  // Asegúrate que el dominio base sea el correcto para tu aplicación
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://app.salestoolspro.com';
  // Usamos template literals correctamente para construir la ruta
  const pagePath = `/v/${params?.filename || ''}/${
    params?.videoFilename || ''
  }`;
  // Concatenamos correctamente para la URL absoluta
  const absolutePageUrl = `${baseUrl}${pagePath}`;

  console.log('[Debug] Constructed videoUrl:', videoUrl);
  console.log('[Debug] Constructed fullLogoUrl:', fullLogoUrl);
  console.log('[Debug] Constructed thumbnailUrl:', thumbnailUrl);
  console.log('[Debug] Constructed absolutePageUrl:', absolutePageUrl); // Verifica esta URL

  // --- Construcción del Objeto Metadata ---
  const metadata = {
    // Metadatos básicos
    title: `Video Compartido: ${videoFilename}`,
    description: 'Mira este video personalizado.',

    // OpenGraph básico (sin el objeto 'video' anidado)
    openGraph: {
      title: `Video: ${videoFilename}`,
      description: 'Mira este video.',
      url: absolutePageUrl, // URL Absoluta correcta
      siteName: 'SalesToolsPro',
      images: [
        {
          url: thumbnailUrl,
          width: 640,
          height: 360,
          alt: 'Vista previa del video',
        },
      ],
      locale: 'es_CO',
      type: 'video.other', // Tipo sigue siendo importante
    },

    // Twitter Card básico (sin el objeto 'player' anidado)
    twitter: {
      card: 'player', // Tipo de tarjeta
      title: `Video: ${videoFilename}`,
      description: 'Mira este video.',
      image: {
        url: thumbnailUrl,
        alt: 'Vista previa del video',
      },
    },

    // --- Propiedad 'other' para Tags Explícitos ---
    // Aquí definimos los tags de video/player directamente
    other: {
      // Open Graph Video Tags (Explícitos)
      // Los valores deben ser strings para 'other'
      'og:video:url': videoUrl,
      'og:video:secure_url': videoUrl,
      'og:video:type': 'video/mp4',
      'og:video:width': '640', // Como string
      'og:video:height': '360', // Como string

      // Twitter Player Tags (Explícitos)
      // 'twitter:player' es el tag para la URL del video en la tarjeta de reproductor
      'twitter:player': videoUrl,
      'twitter:player:width': '640', // Como string
      'twitter:player:height': '360', // Como string

      // Puedes añadir otros tags que necesites aquí:
      // 'mi-tag-personalizado': 'valor'
    },
    // --- Fin Propiedad 'other' ---
  };

  console.log(
    '--- [generateMetadata Returning Object with OTHER property] ---'
  );
  console.log(JSON.stringify(metadata, null, 2));

  return metadata; // Retorna el objeto para que Next.js lo procese
};

// --- Componente de Página (Server Component) ---
// Este componente no necesita cambios respecto a tu versión anterior
export default function VideoPage({ params }) {
  // Leer y decodificar los parámetros para el componente cliente
  const logoFilename = decodeURIComponent(params?.filename || '');
  const videoFilename = decodeURIComponent(
    params?.videoFilename || 'default-video.mp4'
  );

  // Reconstruir URLs para pasar al componente cliente
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

      {/* Footer o información adicional opcional */}
      {/* <div className="mt-8 text-center text-gray-400 text-sm">
           <p>Powered by SalesToolsPro</p>
         </div> */}
    </main>
  );
}
