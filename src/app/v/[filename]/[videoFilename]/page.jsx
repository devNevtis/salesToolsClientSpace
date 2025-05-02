// src/app/v/[filename]/[videoFilename]/page.jsx
// *** SERVER COMPONENT - PRUEBA CON TAGS EXPLÍCITOS EN 'other' ***
// *** SERVER COMPONENT - UI IN ENGLISH & LOCALE SET TO en_US ***

import React from 'react';
import VideoPlayerWithOverlay from '@/components/videoPlayer/VideoPlayerWithOverlay';

// Base URL for the logo (NO CHANGE)
const LOGO_BASE_URL = 'https://api.nevtis.com/marketplace/files/list/';
// Base URL for the video (NEW API)
const VIDEO_API_BASE_URL = 'https://api.nevtis.com/marketplace/files/video/';

// --- generateMetadata (UPDATED locale to en_US) ---
export const generateMetadata = ({ params }) => {
  console.log(
    '--- [generateMetadata Execution Start - UI English / Locale en_US] ---'
  );
  console.log('[Debug] Received params:', params);

  // --- Decode Filenames ---
  const logoFilename = decodeURIComponent(params?.filename || '');
  const videoFilenameDecoded = decodeURIComponent(
    params?.videoFilename || 'default-video.mp4'
  );
  console.log('[Debug] Decoded logoFilename:', logoFilename);
  console.log('[Debug] Decoded videoFilename:', videoFilenameDecoded);

  // --- Construct URLs (Using new VIDEO_API_BASE_URL) ---
  const videoUrl = `${VIDEO_API_BASE_URL}${videoFilenameDecoded}`; // Key change for video source
  const fullLogoUrl = logoFilename ? `${LOGO_BASE_URL}${logoFilename}` : '';
  const thumbnailUrl =
    fullLogoUrl ||
    `https://placehold.co/640x360/0d9488/ffffff?text=Video:${videoFilenameDecoded.substring(
      0,
      10
    )}...`;

  // --- Absolute Page URL (Ensure NEXT_PUBLIC_APP_URL is correct) ---
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://app.salestoolspro.com';
  const pagePath = `/v/${params?.filename || ''}/${
    params?.videoFilename || ''
  }`;
  const absolutePageUrl = `${baseUrl}${pagePath}`;

  console.log('[Debug] Constructed videoUrl (New API):', videoUrl);
  console.log('[Debug] Constructed fullLogoUrl:', fullLogoUrl);
  console.log('[Debug] Constructed thumbnailUrl:', thumbnailUrl);
  console.log('[Debug] Constructed absolutePageUrl:', absolutePageUrl);

  // --- Construct Metadata Object (Locale changed to en_US) ---
  const metadata = {
    // Basic metadata in English
    title: `Shared Video: ${videoFilenameDecoded}`, // English Title
    description: 'Watch this personalized video.', // English Description

    // OpenGraph with locale set to en_US
    openGraph: {
      title: `Video: ${videoFilenameDecoded}`, // English
      description: 'Watch this video.', // English
      url: absolutePageUrl,
      siteName: 'SalesToolsPro', // Keep site name consistent
      images: [
        {
          url: thumbnailUrl,
          width: 640,
          height: 360,
          alt: 'Video preview', // English Alt Text
        },
      ],
      locale: 'en_US', // <--- LOCALE CHANGED TO ENGLISH (US)
      type: 'video.other', // Type remains important
    },

    // Twitter Card (basic, player info in 'other')
    twitter: {
      card: 'player', // Player card type
      title: `Video: ${videoFilenameDecoded}`, // English
      description: 'Watch this video.', // English
      image: {
        url: thumbnailUrl,
        alt: 'Video preview', // English Alt Text
      },
      // Note: twitter:player details are handled via 'other'
    },

    // --- 'other' property for Explicit Tags (Using new videoUrl) ---
    // This remains critical for iMessage previews
    other: {
      // Open Graph Video Tags
      'og:video:url': videoUrl,
      'og:video:secure_url': videoUrl,
      'og:video:type': 'video/mp4',
      'og:video:width': '640',
      'og:video:height': '360',

      // Twitter Player Tags
      'twitter:player': videoUrl, // URL of the player (can be same as video)
      'twitter:player:width': '640',
      'twitter:player:height': '360',

      // You can add other custom tags here if needed
      // 'custom:tag': 'value'
    },
    // --- End 'other' property ---
  };

  console.log('--- [generateMetadata Returning Object - Locale en_US] ---');
  console.log(JSON.stringify(metadata, null, 2));

  return metadata; // Return the object for Next.js processing
};

// --- Page Component (Server Component - UPDATED UI TEXT) ---
export default function VideoPage({ params }) {
  // Read and decode parameters
  const logoFilename = decodeURIComponent(params?.filename || '');
  const videoFilenameDecoded = decodeURIComponent(
    params?.videoFilename || 'default-video.mp4'
  );

  // Reconstruct URLs to pass to the client component (using new bases)
  const videoUrl = `${VIDEO_API_BASE_URL}${videoFilenameDecoded}`; // Key change
  const fullLogoUrl = logoFilename ? `${LOGO_BASE_URL}${logoFilename}` : '';

  // Render the page structure (Headline changed to English)
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-2xl text-white font-semibold mb-8">
        {/* Text changed to English */}
        <span className="bg-teal-800 px-4 py-2 rounded-full shadow-md">
          Your Personalized Video
        </span>
      </h1>

      {/* Render the client component, passing the necessary URLs */}
      {/* The videoUrl passed here now points to your iDrive API */}
      <VideoPlayerWithOverlay videoUrl={videoUrl} logoUrl={fullLogoUrl} />

      {/* Optional Footer */}
      <div className="mt-8 text-center text-gray-400 text-sm">
        <p>Powered by SalesToolsPro</p>
      </div>
    </main>
  );
}
