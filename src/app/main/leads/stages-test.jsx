// src/app/main/leads/stages-test.jsx
'use client';
import useCompanyStages from '@/store/useCompanyStages';
import useCompanyTheme from '@/store/useCompanyTheme';

const StagesTest = () => {
  const { stages } = useCompanyStages();
  const { theme } = useCompanyTheme();

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6" style={{ color: theme.base1 }}>
        Stages de la Compañía
      </h2>
      
      <div className="grid gap-4">
        {stages.map((stage) => (
          <div 
            key={stage._id}
            className="p-4 rounded-lg shadow-md"
            style={{ 
              borderLeft: `4px solid ${theme.base2}`,
              backgroundColor: 'white'
            }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold" style={{ color: theme.base1 }}>
                  {stage.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Order: {stage.order}
                </p>
              </div>
              <span 
                className="px-2 py-1 rounded text-xs"
                style={{ 
                  backgroundColor: theme.highlighting,
                  color: 'white'
                }}
              >
                Active
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Datos en formato JSON para verificación */}
      <div className="mt-8">
        <h3 className="font-semibold mb-2">Datos completos (JSON):</h3>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(stages, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default StagesTest;