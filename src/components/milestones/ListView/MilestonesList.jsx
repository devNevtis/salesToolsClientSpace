// src/components/milestones/ListView/MilestonesList.jsx
'use client';

import MilestoneItem from './MilestoneItem';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import useMilestonesStore from '@/store/useMilestonesStore';
import AddMilestoneDialog from '../dialogs/AddMilestoneDialog';
import AddTaskDialog from '../dialogs/AddTaskDialog';
import EditTaskDialog from '../dialogs/EditTaskDialog';
import { Loader2 } from 'lucide-react'; // Importar Loader

export default function MilestonesList() {
  // Obtenemos todo del store
  const { milestones, selectedLeadId, isLoading, error } = useMilestonesStore();

  // Estados locales para controlar los diálogos
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null); // Para saber a qué milestone añadir tarea
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // Para saber qué tarea editar

  // Función para abrir el diálogo de añadir tarea
  const handleAddTask = (milestone) => {
    setSelectedMilestone(milestone);
    setIsAddTaskOpen(true);
  };

  // Función para abrir el diálogo de editar tarea
  const handleEditTask = (task, milestoneId) => {
    // console.log("Edit task triggered with:", { task, milestoneId }); // Debug
    setSelectedTask({ ...task, milestoneId }); // Guarda la tarea y el ID del milestone padre
    setIsEditTaskOpen(true);
  };

  // El filtrado ya no es necesario aquí si el store devuelve los milestones correctos
  // const filteredMilestones = milestones; // Asumiendo que el store ya filtra por selectedLeadId

  // console.log("desde list",milestones); // Debug

  return (
    <div className="space-y-4">
      {/* Encabezado: Título y Botón Añadir Milestone */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-foreground">Milestones</h2>
        {/* Botón para abrir diálogo de añadir milestone */}
        {/* Deshabilitar si no hay lead seleccionado */}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsAddDialogOpen(true)}
          className="text-primary hover:text-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedLeadId || isLoading} // Deshabilitar si carga o no hay lead
          title="Add New Milestone" // Tooltip
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Estado de Carga */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Estado de Error */}
      {error && !isLoading && (
        <div className="text-center py-8 text-destructive">
          Error loading milestones: {error.message || 'Please try again.'}
        </div>
      )}

      {/* Lista de Milestones o Mensaje si no hay */}
      {!isLoading && !error && milestones.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No milestones found for this lead/customer. Click the + button to add
          one.
        </div>
      )}

      {!isLoading &&
        !error &&
        milestones.length > 0 &&
        milestones
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate)) // Ordenar por fecha de inicio
          .map((milestone) => (
            <MilestoneItem
              key={milestone._id}
              milestone={milestone}
              onAddTask={handleAddTask} // Pasa la función para añadir tarea
              onEditTask={handleEditTask} // Pasa la función para editar tarea
              // onToggleExpand ya no es necesaria si el estado es interno de MilestoneItem
            />
          ))}

      {/* Diálogos */}
      <AddMilestoneDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        // Podrías pasar selectedLeadId si es necesario dentro del diálogo
      />
      <AddTaskDialog
        open={isAddTaskOpen}
        milestone={selectedMilestone} // Pasamos el milestone seleccionado
        onOpenChange={(open) => {
          setIsAddTaskOpen(open);
          if (!open) setSelectedMilestone(null); // Limpiar al cerrar
        }}
      />
      <EditTaskDialog
        open={isEditTaskOpen}
        task={selectedTask} // Pasamos la tarea seleccionada
        milestoneId={selectedTask?.milestoneId} // Pasamos el milestoneId asociado
        onOpenChange={(open) => {
          setIsEditTaskOpen(open);
          if (!open) setSelectedTask(null); // Limpiar al cerrar
        }}
      />
    </div>
  );
}
