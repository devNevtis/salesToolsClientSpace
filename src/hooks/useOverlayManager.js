// src/hooks/useOverlayManager.js
'use client';
import { useState, useCallback } from 'react';

export function useOverlayManager() {
  const [activeOverlays, setActiveOverlays] = useState(new Set());

  const registerOverlay = useCallback((id) => {
    setActiveOverlays(prev => new Set(prev).add(id));
    document.body.style.pointerEvents = 'none';
  }, []);

  const unregisterOverlay = useCallback((id) => {
    setActiveOverlays(prev => {
      const next = new Set(prev);
      next.delete(id);
      if (next.size === 0) {
        document.body.style.pointerEvents = 'auto';
      }
      return next;
    });
  }, []);

  return { registerOverlay, unregisterOverlay, activeOverlays };
}