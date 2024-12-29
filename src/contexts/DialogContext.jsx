// src/contexts/DialogContext.jsx
'use client';

import { createContext, useContext } from 'react';
import { useOverlayManager } from '@/hooks/useOverlayManager';
import { DialogPortal } from '@/components/ui/DialogPortal';

const DialogContext = createContext(null);

export function DialogProvider({ children }) {
  const overlayManager = useOverlayManager();
  
  return (
    <DialogContext.Provider value={overlayManager}>
      <DialogPortal>
        {children}
      </DialogPortal>
    </DialogContext.Provider>
  );
}

export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialogContext must be used within a DialogProvider');
  }
  return context;
};