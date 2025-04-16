// src/components/milestones/ListView/MilestoneItem.jsx
'use client';

import { useEffect, useState } from 'react'; // useState importado aquí
import {
  ChevronDown,
  ChevronRight,
  Calendar,
  Plus,
  Edit3,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskItem from './TaskItem'; // Asumiendo que este componente existe y recibe props
// import { useState } from "react"; // Ya importado arriba
import { format, isValid } from 'date-fns'; // Importar isValid
import EditMilestoneDialog from '../dialogs/EditMilestoneDialog';
import DeleteMilestoneDialog from '../dialogs/DeleteMilestoneDialog';
import useCompanyTheme from '@/store/useCompanyTheme'; // Para colores

// Componente recibe onEditTask para manejar la edición de tareas hijas
export default function MilestoneItem({ milestone, onAddTask, onEditTask }) {
  const { theme } = useCompanyTheme();
  const [expanded, setExpanded] = useState(false); // Estado interno para expandir/colapsar tareas
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // Estado para diálogo editar milestone
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Estado para diálogo borrar milestone

  const toggleExpand = () => {
    setExpanded(!expanded);
    // Ya no llamamos a onToggleExpand si el estado es interno
  };

  // useEffect para aplicar tema (sin cambios funcionales)
  useEffect(() => {
    if (theme.base1)
      document.documentElement.style.setProperty('--theme-base1', theme.base1);
    if (theme.base2)
      document.documentElement.style.setProperty('--theme-base2', theme.base2);
    if (theme.highlighting)
      document.documentElement.style.setProperty(
        '--theme-highlighting',
        theme.highlighting
      );
    if (theme.callToAction)
      document.documentElement.style.setProperty(
        '--theme-callToAction',
        theme.callToAction
      );
  }, [theme]);

  // Formatear fechas con validación
  const formatDateSafe = (dateString) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'MMM d, yyyy') : 'Invalid Date';
  };
  const formattedStartDate = formatDateSafe(milestone?.startDate);
  const formattedDueDate = formatDateSafe(milestone?.dueDate);

  // Calcula el progreso asegurándose que sea un número entre 0 y 100
  const progress = Math.min(100, Math.max(0, Number(milestone?.progress) || 0));

  // console.log(milestone); // Debug

  return (
    <div className="border rounded-lg hover:border-primary/50 transition-colors bg-background shadow-sm">
      {/* Encabezado Clickeable */}
      <div
        className="p-3 sm:p-4 cursor-pointer" // Padding ajustado
        onClick={toggleExpand} // Toggle expande/colapsa tareas
        role="button" // Accesibilidad
        tabIndex={0} // Accesibilidad
        onKeyDown={(e) =>
          (e.key === 'Enter' || e.key === ' ') && toggleExpand()
        } // Accesibilidad
      >
        {/* --- AJUSTE RESPONSIVO LAYOUT HEADER --- */}
        {/* Apilado en móvil (<sm), fila en sm+ */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          {/* Sección Izquierda: Icono, Título, Descripción, Fechas */}
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {' '}
            {/* flex-1 y min-w-0 para que el texto se ajuste */}
            {/* Icono Expandir/Colapsar */}
            <div className="mt-0.5 shrink-0">
              {' '}
              {/* Ajuste de margen */}
              {expanded ? (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            {/* Contenido Texto */}
            <div className="flex-1">
              <h3
                className="font-medium text-foreground truncate"
                title={milestone?.title}
              >
                {milestone?.title || 'No Title'}
              </h3>
              <p
                className="text-sm text-muted-foreground mt-0.5 line-clamp-2"
                title={milestone?.description}
              >
                {milestone?.description}
              </p>{' '}
              {/* line-clamp limita a 2 líneas */}
              {/* Fechas */}
              <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                {' '}
                {/* reducido mt, gap y text-xs */}
                <Calendar className="h-3.5 w-3.5" />
                <span>{formattedStartDate}</span>
                <span>-</span>
                <span>{formattedDueDate}</span>
              </div>
            </div>
          </div>

          {/* Sección Derecha: Progreso y Botones de Acción */}
          {/* Alineado a la izquierda en móvil (<sm), a la derecha en sm+ */}
          <div className="flex flex-col items-start gap-2 sm:items-end sm:gap-2 pl-7 sm:pl-0 shrink-0">
            {' '}
            {/* Padding izquierdo solo en móvil para alinear con texto */}
            {/* Progreso */}
            <div className="flex flex-col items-end gap-1 w-full sm:w-auto">
              <div className="relative w-full sm:w-28 md:w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                {' '}
                {/* Barra redondeada */}
                <div
                  className="absolute top-0 left-0 h-full bg-[var(--theme-base2)] rounded-full" // Color tema, redondeada
                  style={{ width: `${progress}%` }} // Usa progress validado
                ></div>
              </div>
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                {progress}%
              </span>
            </div>
            {/* Botones de Acción (Editar/Eliminar Milestone) */}
            {/* Este flex NO causa overflow por sí mismo */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditDialogOpen(true);
                }} // Evita propagación
                className="h-7 w-7 sm:h-8 sm:w-8" // Tamaño responsivo
                title="Edit Milestone" // Tooltip
              >
                <Edit3 className="w-3.5 h-3.5 sm:w-4 text-[var(--theme-base1)]" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteDialogOpen(true);
                }} // Evita propagación
                className="h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10" // Clases hover directas
                title="Delete Milestone" // Tooltip
              >
                {/* Usando Trash2 de lucide */}
                <Trash2 className="w-3.5 h-3.5 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>
        {/* --- FIN AJUSTE LAYOUT HEADER --- */}
      </div>

      {/* Sección Expandida de Tareas */}
      {expanded && (
        <div className="border-t border-border px-4 py-3 bg-muted/30">
          {' '}
          {/* Fondo más sutil */}
          {/* Encabezado de Tareas */}
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium text-foreground">Tasks</h4>
            {/* Botón Añadir Tarea */}
            <Button
              size="icon"
              variant="ghost"
              // Llama a onAddTask pasando el milestone actual
              onClick={(e) => {
                e.stopPropagation();
                onAddTask(milestone);
              }}
              className="text-primary hover:text-primary/90 h-7 w-7" // Tamaño ajustado
              title="Add Task to this Milestone" // Tooltip
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {/* Lista de Tareas */}
          <div className="space-y-2">
            {/* Verifica si milestone.tasks existe y es un array antes de mapear */}
            {milestone?.tasks &&
            Array.isArray(milestone.tasks) &&
            milestone.tasks.length > 0 ? (
              milestone.tasks
                .sort((a, b) => a.order - b.order) // Opcional: ordenar tareas
                .map((task) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    milestoneId={milestone._id} // Pasa el ID del milestone padre
                    // Pasa la función onEditTask recibida como prop
                    onEditTask={() => onEditTask(task, milestone._id)}
                  />
                ))
            ) : (
              <p className="text-xs text-center text-muted-foreground py-2">
                No tasks added yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Diálogos para editar/borrar ESTE milestone */}
      <EditMilestoneDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        milestone={milestone} // Pasamos el milestone actual
      />
      <DeleteMilestoneDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        milestone={milestone} // Pasamos el milestone actual
      />
    </div>
  );
}
