// src/app/main/leads/page.jsx
'use client';
import useCompanyTheme from '@/store/useCompanyTheme';

const LeadsPage = () => {
  const { theme } = useCompanyTheme();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Datos del Tema de la Compañía:</h1>
      <div className="space-y-4">
        {/* Mostrar los colores con muestras visuales */}
        <div>
          <h2 className="font-semibold mb-2">Color Base 1:</h2>
          <div className="flex items-center gap-4">
            <div 
              className="w-20 h-20 rounded" 
              style={{ backgroundColor: theme.base1 }}
            />
            <span>{theme.base1}</span>
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Color Base 2:</h2>
          <div className="flex items-center gap-4">
            <div 
              className="w-20 h-20 rounded" 
              style={{ backgroundColor: theme.base2 }}
            />
            <span>{theme.base2}</span>
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Color Highlighting:</h2>
          <div className="flex items-center gap-4">
            <div 
              className="w-20 h-20 rounded" 
              style={{ backgroundColor: theme.highlighting }}
            />
            <span>{theme.highlighting}</span>
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Color Call to Action:</h2>
          <div className="flex items-center gap-4">
            <div 
              className="w-20 h-20 rounded" 
              style={{ backgroundColor: theme.callToAction }}
            />
            <span>{theme.callToAction}</span>
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Logo URL:</h2>
          <span className="break-all">{theme.logo}</span>
        </div>
      </div>

      {/* Datos en formato JSON para verificación */}
      <div className="mt-8">
        <h2 className="font-semibold mb-2">Datos completos (JSON):</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(theme, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default LeadsPage;