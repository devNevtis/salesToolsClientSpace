// src/components/ui/DialogPortal.jsx
'use client';

export function DialogPortal({ children }) {
  return (
    <div id="dialog-portal" className="relative z-50">
      {children}
    </div>
  );
}