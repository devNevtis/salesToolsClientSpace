// src/store/useMilestonesStore.js
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
  isLoading: false,
  error: null,

  // Acciones principales
  setSelectedLead: (leadId) => {
    const state = get();
    const existingMilestones = state.milestones.some(m => m.leadId === leadId);

    if (!existingMilestones) {
      // Si el lead no tiene milestones, generamos algunos de prueba
      const newMilestones = generateInitialMilestonesForLead(leadId);
      set({
        selectedLeadId: leadId,
        milestones: [...state.milestones, ...newMilestones]
      });
    } else {
      set({ selectedLeadId: leadId });
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
      milestones: state.milestones.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              tasks: m.tasks.map((t) =>
                t.id === taskId ? { ...t, ...data } : t
              )
            }
          : m
      )
    })),

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

  updateSubtask: (milestoneId, taskId, subtaskId, data) =>
    set((state) => ({
      milestones: state.milestones.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              tasks: m.tasks.map((t) =>
                t.id === taskId
                  ? {
                      ...t,
                      subtasks: t.subtasks.map((st) =>
                        st.id === subtaskId ? { ...st, ...data } : st
                      )
                    }
                  : t
              )
            }
          : m
      )
    })),

  deleteSubtask: (milestoneId, taskId, subtaskId) =>
    set((state) => ({
      milestones: state.milestones.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              tasks: m.tasks.map((t) =>
                t.id === taskId
                  ? {
                      ...t,
                      subtasks: t.subtasks.filter((st) => st.id !== subtaskId)
                    }
                  : t
              )
            }
          : m
      )
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
    const completedTasks = milestone.tasks.filter(t => t.status === 'completed').length;
    return Math.round((completedTasks / totalTasks) * 100);
  }
}));

export default useMilestonesStore;