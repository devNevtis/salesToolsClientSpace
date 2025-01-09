// src/store/useMilestonesStore.js
import useLeadsStore from '@/store/useLeadsStore';
import Cookies from 'js-cookie';
import { create } from 'zustand';
import { format, addDays } from 'date-fns';

const generateInitialMilestonesForLead = (leadId) => {
  const today = new Date();
  
  return [
    {
      id: `m-${leadId}-1`,
      leadId: leadId,
      title: 'Licencia de Constructor California',
      description: 'Proceso de obtención de licencia',
      startDate: today,
      dueDate: addDays(today, 90),
      progress: 60,
      status: 'in-progress',
      tasks: [
        {
          id: `t-${leadId}-1`,
          title: 'Llenar Formulario A',
          description: 'Completar documentación inicial',
          startDate: today,
          dueDate: addDays(today, 15),
          completedDate: addDays(today, 14),
          progress: 100,
          status: 'completed',
          assignedTo: {
            id: 'user1',
            type: 'user',
            name: 'John Doe'
          },
          dependencies: [],
          subtasks: [
            {
              id: `st-${leadId}-1`,
              title: 'Recopilar documentos personales',
              description: 'DNI, pasaporte, etc',
              completed: true,
              completedDate: addDays(today, 10)
            }
          ]
        },
        {
          id: `t-${leadId}-2`,
          title: 'Certificación de Seguridad',
          description: 'Obtener certificación de seguridad laboral',
          startDate: addDays(today, 15),
          dueDate: addDays(today, 45),
          progress: 30,
          status: 'in-progress',
          assignedTo: {
            id: 'user2',
            type: 'user',
            name: 'Jane Smith'
          },
          dependencies: [`t-${leadId}-1`],
          subtasks: [
            {
              id: `st-${leadId}-2`,
              title: 'Completar curso online',
              description: 'Curso básico de seguridad',
              completed: false
            }
          ]
        }
      ],
      notifications: true
    }
  ];
};

const useMilestonesStore = create((set, get) => ({
  // Estado
  milestones: [],
  selectedLeadId: null,
  contacts: [], // Contactos asociados al lead
  user: null, // Usuario logueado

  // Acciones principales
  setSelectedLead: (leadId) => {
    const state = get();
    const leadsStore = useLeadsStore.getState(); // Obtener contactos desde LeadsStore
    const contacts = leadsStore.getContactsForBusiness(leadId) || []; // Método para obtener contactos por Lead
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;

    const existingMilestones = state.milestones.some((m) => m.leadId === leadId);

    if (!existingMilestones) {
      // Generar milestone de prueba si no existen
      const newMilestones = generateInitialMilestonesForLead(leadId);
      set({
        selectedLeadId: leadId,
        milestones: [...state.milestones, ...newMilestones],
        contacts: [...contacts, ...(user ? [user] : [])],
      });
    } else {
      set({
        selectedLeadId: leadId,
        contacts: [...contacts, ...(user ? [user] : [])],
      });
    }
  },

  // CRUD Milestones
  addMilestone: (milestone) => 
    set((state) => ({
      milestones: [...state.milestones, milestone]
    })),

  updateMilestone: (id, data) =>
    set((state) => ({
      milestones: state.milestones.map((m) =>
        m.id === id ? { ...m, ...data } : m
      )
    })),

  deleteMilestone: (id) =>
    set((state) => ({
      milestones: state.milestones.filter((m) => m.id !== id)
    })),

  // CRUD Tasks
  addTask: (milestoneId, task) =>
    set((state) => ({
      milestones: state.milestones.map((m) =>
        m.id === milestoneId
          ? { ...m, tasks: [...m.tasks, task] }
          : m
      )
    })),

    updateTask: (milestoneId, taskId, data) =>
      set((state) => ({
        milestones: state.milestones.map((milestone) =>
          milestone.id === milestoneId
            ? {
                ...milestone,
                tasks: milestone.tasks.map((task) =>
                  task.id === taskId ? { ...task, ...data } : task
                ),
              }
            : milestone
        ),
      })),
    

/*     updateTask: (milestoneId, taskId, data) => {
      set((state) => {
        const updatedMilestones = state.milestones.map((milestone) => {
          if (milestone.id === milestoneId) {
            const updatedTasks = milestone.tasks.map((task) =>
              task.id === taskId ? { ...task, ...data } : task
            );
            const progress = get().calculateMilestoneProgress(milestoneId);
            return { ...milestone, tasks: updatedTasks, progress };
          }
          return milestone;
        });
    
        return { milestones: updatedMilestones };
      });
    }, */

  deleteTask: (milestoneId, taskId) =>
    set((state) => ({
      milestones: state.milestones.map((m) =>
        m.id === milestoneId
          ? { ...m, tasks: m.tasks.filter((t) => t.id !== taskId) }
          : m
      )
    })),

  // CRUD Subtasks
  addSubtask: (milestoneId, taskId, subtask) =>
    set((state) => ({
      milestones: state.milestones.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              tasks: m.tasks.map((t) =>
                t.id === taskId
                  ? { ...t, subtasks: [...t.subtasks, subtask] }
                  : t
              )
            }
          : m
      )
    })),

// src/store/useMilestonesStore.js
/* updateSubtask: (milestoneId, taskId, subtaskId, data) =>
  set((state) => ({
    milestones: state.milestones.map((milestone) =>
      milestone.id === milestoneId
        ? {
            ...milestone,
            tasks: milestone.tasks.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    subtasks: task.subtasks.map((subtask) =>
                      subtask.id === subtaskId ? { ...subtask, ...data } : subtask
                    ),
                  }
                : task
            ),
          }
        : milestone
    ),
  })), */

  updateSubtask: (milestoneId, taskId, subtaskId, data) =>
    set((state) => {
      const updatedMilestones = state.milestones.map((milestone) => {
        if (milestone.id === milestoneId) {
          const updatedTasks = milestone.tasks.map((task) => {
            if (task.id === taskId) {
              const updatedSubtasks = task.subtasks.map((subtask) =>
                subtask.id === subtaskId ? { ...subtask, ...data } : subtask
              );
  
              // Recalcular progreso
              const totalSubtasks = updatedSubtasks.length;
              const completedSubtasks = updatedSubtasks.filter(
                (st) => st.completed
              ).length;
              const progress = totalSubtasks
                ? Math.round((completedSubtasks / totalSubtasks) * 100)
                : 0;
  
              // Actualizar status de la tarea basado en progreso
              const status =
                progress === 100
                  ? "completed"
                  : progress > 0
                  ? "in-progress"
                  : "planned";
  
              return { ...task, subtasks: updatedSubtasks, progress, status };
            }
            return task;
          });
  
          return { ...milestone, tasks: updatedTasks };
        }
        return milestone;
      });
  
      return { milestones: updatedMilestones };
    }),
  
  
deleteSubtask: (milestoneId, taskId, subtaskId) =>
  set((state) => ({
    milestones: state.milestones.map((milestone) =>
      milestone.id === milestoneId
        ? {
            ...milestone,
            tasks: milestone.tasks.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    subtasks: task.subtasks.filter(
                      (subtask) => subtask.id !== subtaskId
                    ),
                  }
                : task
            ),
          }
        : milestone
    ),
  })),


  // Utilidades
  getMilestonesByLead: (leadId) => {
    const state = get();
    return state.milestones.filter(m => m.leadId === leadId);
  },

  calculateMilestoneProgress: (milestoneId) => {
    const state = get();
    const milestone = state.milestones.find(m => m.id === milestoneId);
    if (!milestone || !milestone.tasks.length) return 0;
  
    const totalTasks = milestone.tasks.length;
    const completedTasks = milestone.tasks.filter(t => t.status === "completed").length;
  
    return Math.round((completedTasks / totalTasks) * 100);
  },
  
}));

export default useMilestonesStore;