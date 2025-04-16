// src/components/milestones/MilestonesTab.jsx
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import LeadSelector from './LeadSelector'; // Importa el componente hijo
import MilestonesList from './ListView/MilestonesList'; // Importa el componente hijo
import useMilestonesStore from '@/store/useMilestonesStore';
import useLeadsStore from '@/store/useLeadsStore'; // Asegúrate que la data `businesses` viene de aquí

export default function MilestonesTab() {
  const {
    milestones,
    selectedLeadId,
    setSelectedLead, // Renombrado si aplica, verifica tu store
    fetchMilestonesByBusiness,
  } = useMilestonesStore();

  // Asegúrate que obtienes `businesses` correctamente para LeadSelector
  const { businesses } = useLeadsStore();

  useEffect(() => {
    if (selectedLeadId) {
      fetchMilestonesByBusiness(selectedLeadId);
    }
    // Considera limpiar milestones si selectedLeadId se vuelve null
    // else { clearMilestones(); } // Si tienes una acción clearMilestones
  }, [selectedLeadId, fetchMilestonesByBusiness]); // Dependencias correctas

  // Manejo del estado de carga de businesses si es necesario
  if (!businesses) {
    // Podrías mostrar un loader más específico o usar isLoading de useLeadsStore si existe
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading businesses...
      </div>
    );
  }
  // console.log(milestones) // Mantenido para debug si lo necesitas
  // console.log(selectedLeadId) // Mantenido para debug si lo necesitas

  return (
    // Mantenemos space-y-4. El padding general viene de <main> en el layout.
    <div className="space-y-4">
      {/* Card para el selector */}
      <Card className="p-4 shadow-sm border">
        {' '}
        {/* Añadido shadow y border */}
        <LeadSelector
        // businesses se obtiene de useLeadsStore, no necesita pasarse como prop
        // selectedLeadId={selectedLeadId} // Lo obtiene del store useMilestonesStore
        // onSelectLead={setSelectedLead} // Lo obtiene del store useMilestonesStore
        />
      </Card>
      {/* Card para la lista de milestones */}
      <Card className="p-4 shadow-sm border">
        {' '}
        {/* Añadido shadow y border */}
        {!selectedLeadId ? (
          <div className="text-center py-8 text-muted-foreground">
            Please select a business/lead above to view its milestones.
          </div>
        ) : (
          // MilestonesList obtiene milestones y selectedLeadId del store directamente
          <MilestonesList />
        )}
      </Card>
    </div>
  );
}
