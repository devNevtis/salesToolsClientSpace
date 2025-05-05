// src/components/videoPlayer/VideoPlayerJS.jsx
// *** CLIENT COMPONENT - CORREGIDO para evitar duplicados en Dev/Strict Mode ***
'use client';

import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayerJS = ({ videoUrl }) => {
  const videoContainerRef = useRef(null); // Ref para el DIV contenedor
  const playerRef = useRef(null); // Ref para la INSTANCIA del reproductor VJS
  const videoElementRef = useRef(null); // Ref para el ELEMENTO <video-js> que creamos

  useEffect(() => {
    // --- Opciones de Video.js (sin cambios) ---
    const videoJsOptions = {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
      playsinline: true,
      preload: 'auto', // Intentar mostrar primer frame
      sources: [
        {
          src: videoUrl,
          type: 'video/mp4',
        },
      ],
    };

    // --- Lógica de Inicialización ---
    // Solo proceder si el contenedor existe y no hay ya un reproductor activo
    if (videoContainerRef.current && !playerRef.current) {
      console.log(
        '[VideoPlayerJS Corrected] Container ready. Preparing to init...'
      );

      // **PRECAUCIÓN Anti-Duplicados:** Vaciar el contenedor por si acaso (útil en dev)
      while (videoContainerRef.current.firstChild) {
        console.log(
          '[VideoPlayerJS Corrected] Removing existing child before append...'
        );
        videoContainerRef.current.removeChild(
          videoContainerRef.current.firstChild
        );
      }

      // Crear el elemento de video dinámicamente
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered');
      videoElementRef.current = videoElement; // Guardar referencia al elemento DOM

      // Añadir el elemento al contenedor
      videoContainerRef.current.appendChild(videoElement);
      console.log('[VideoPlayerJS Corrected] Appended <video-js> element.');

      // Inicializar Video.js sobre el elemento recién creado
      const player = videojs(videoElement, videoJsOptions, () => {
        console.log('Video.js Player is ready');
        // Guardar la referencia a la instancia del reproductor SOLO cuando esté listo
        playerRef.current = player;
      });
    } else if (playerRef.current) {
      // Si el reproductor ya existe, solo actualizamos la fuente
      console.log('[VideoPlayerJS Corrected] Player exists. Updating source.');
      playerRef.current.src([{ src: videoUrl, type: 'video/mp4' }]);
    }

    // --- Función de Limpieza (MUY IMPORTANTE) ---
    return () => {
      const player = playerRef.current;
      const videoEl = videoElementRef.current; // Referencia al elemento <video-js>

      console.log('[VideoPlayerJS Corrected] Cleanup initiated...');

      // 1. Destruir la instancia del reproductor Video.js
      if (player && !player.isDisposed()) {
        console.log('[VideoPlayerJS Corrected] Disposing player instance...');
        player.dispose();
        playerRef.current = null;
      } else {
        console.log(
          '[VideoPlayerJS Corrected] Player instance already disposed or null.'
        );
      }

      // 2. Eliminar el elemento <video-js> que creamos del DOM
      //    Verificamos que el elemento exista y que su padre sea nuestro contenedor
      if (videoEl && videoEl.parentNode === videoContainerRef.current) {
        console.log(
          '[VideoPlayerJS Corrected] Removing video element from DOM...'
        );
        videoContainerRef.current.removeChild(videoEl);
        videoElementRef.current = null; // Limpiar la referencia al elemento DOM
      } else if (videoEl) {
        console.warn(
          '[VideoPlayerJS Corrected] Video element found, but parent mismatch or already removed.'
        );
      } else {
        console.log(
          '[VideoPlayerJS Corrected] No video element reference found to remove.'
        );
      }
      console.log('[VideoPlayerJS Corrected] Cleanup finished.');
    };
  }, [videoUrl]); // Dependencia: URL del video

  // El componente solo renderiza el div contenedor. useEffect se encarga del resto.
  return (
    <div data-vjs-player>
      <div ref={videoContainerRef} />
    </div>
  );
};

export default VideoPlayerJS;
