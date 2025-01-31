// src/store/useMilestonesStore.js
import useLeadsStore from '@/store/useLeadsStore';
import Cookies from 'js-cookie';
import { create } from 'zustand';
import axios from 'axios';

const useMilestonesStore = create((set, get) => ({
  milestones: [],
  selectedLeadId: null,


    // 🔹 Nuevo estado para manejar la eliminación de subtareas
    subtaskToDelete: null,

    setSubtaskToDelete: (milestoneId, taskId, subtaskId) => {
      set({ subtaskToDelete: { milestoneId, taskId, subtaskId } });
    },
  
    clearSubtaskToDelete: () => {
      set({ subtaskToDelete: null });
    },
  
    // 🔹 Función para eliminar la subtask (Usamos el endpoint de update)
    deleteSubtask: async () => {
      const { subtaskToDelete, milestones, updateMilestone } = get();
      if (!subtaskToDelete) return;
  
      const { milestoneId, taskId, subtaskId } = subtaskToDelete;
  
      const updatedMilestones = milestones.map((milestone) => {
        if (milestone._id === milestoneId) {
          return {
            ...milestone,
            tasks: milestone.tasks.map((task) => {
              if (task._id === taskId) {
                const updatedSubtasks = task.subtasks.filter(
                  (subtask) => subtask._id !== subtaskId
                );
  
                // 📌 Si eliminamos la última subtask, eliminamos la tarea también
                if (updatedSubtasks.length === 0) {
                  return null; // Eliminamos la tarea
                }
  
                return {
                  ...task,
                  subtasks: updatedSubtasks,
                };
              }
              return task;
            }).filter(Boolean), // Filtramos para quitar las tareas vacías
          };
        }
        return milestone;
      });
  
      // 📌 Hacemos el PUT al backend con la nueva data
      await updateMilestone(milestoneId, updatedMilestones.find(m => m._id === milestoneId));
  
      set({ milestones: updatedMilestones, subtaskToDelete: null });
    },

    updateTask: async (milestoneId, taskId, updatedTaskData) => {
      try {
        const response = await axios.put(`https://api.nevtis.com/dialtools/milestones/update/${milestoneId}`, updatedTaskData);
        
        set((state) => ({
          milestones: state.milestones.map((milestone) =>
            milestone._id === milestoneId
              ? {
                  ...milestone,
                  tasks: milestone.tasks.map((task) =>
                    task._id === taskId ? { ...task, ...updatedTaskData } : task
                  ),
                }
              : milestone
          ),
        }));
    
        return response.data;
      } catch (error) {
        console.error("Error updating task:", error);
        throw error;
      }
    },    

    
  // Fetch all milestones
  fetchMilestones: async () => {
    try {
      //console.log('Fetching all milestones...');
      const response = await axios.get('https://api.nevtis.com/dialtools/milestones/getAll');
      //console.log('All milestones fetched:', response.data);
      set({ milestones: response.data });
    } catch (error) {
      console.error('Error fetching milestones:', error);
    }
  },

  // Fetch milestones by business
  fetchMilestonesByBusiness: async (businessId) => {
    try {
      //console.log(`Fetching milestones for businessId: ${businessId}`);
      const response = await axios.get(`https://api.nevtis.com/dialtools/milestones/business/${businessId}`);
      //console.log(`Milestones fetched for businessId ${businessId}:`, response.data);
      set({ milestones: response.data, selectedLeadId: businessId });
    } catch (error) {
      if (error.response?.status === 404 && error.response?.data?.message === 'No milestones found for this businessId') {
        //console.warn(`No milestones found for businessId: ${businessId}`);
        set({ milestones: [], selectedLeadId: businessId });
      } else {
        console.error('Error fetching milestones by business:', error);
      }
    }
  },

  // Set the selected lead
  setSelectedLead: (leadId) => {
    //console.log(`Selected leadId set to: ${leadId}`);
    const leadsStore = useLeadsStore.getState(); // Obtener contactos desde LeadsStore
    const contacts = leadsStore.getContactsForBusiness(leadId) || []; // Método para obtener contactos por Lead
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
    set({ 
      selectedLeadId: leadId,
      contacts: [...contacts, ...(user ? [user] : [])], 
    });
    const fetchMilestonesByBusiness = get().fetchMilestonesByBusiness;
    if (leadId) {
      fetchMilestonesByBusiness(leadId);
    }
  },

  // Create a new milestone
  createMilestone: async (milestoneData) => {
    try {
      //console.log('Creating milestone with data:', milestoneData);
      const response = await axios.post('https://api.nevtis.com/dialtools/milestones/create', milestoneData);
      //console.log('Milestone created:', response.data);
      set((state) => ({ milestones: [...state.milestones, response.data] }));
      return response.data;
    } catch (error) {
      console.error('Error creating milestone:', error);
      throw error;
    }
  },

  // Update an existing milestone (includes tasks and subtasks)
  updateMilestone: async (milestoneId, updatedData) => {
    //console.log("✅ Store - updateMilestone ejecutado con:", { milestoneId, updatedData });
    try {
      //console.log(`Updating milestone with id ${milestoneId} and data:`, updatedData);
      const response = await axios.put(`https://api.nevtis.com/dialtools/milestones/update/${milestoneId}`, updatedData);
      //console.log('Milestone updated:', response.data);
      set((state) => ({
        milestones: state.milestones.map((milestone) =>
          milestone._id === milestoneId ? response.data : milestone
        ),
      }));
      return response.data;
    } catch (error) {
      console.error('Error updating milestone:', error);
      throw error;
    }
  },

  // Delete a milestone
  deleteMilestone: async (milestoneId) => {
    try {
      //console.log(`Deleting milestone with id: ${milestoneId}`);
      await axios.delete(`https://api.nevtis.com/dialtools/milestones/delete/${milestoneId}`);
      //console.log(`Milestone with id ${milestoneId} deleted.`);
      set((state) => ({
        milestones: state.milestones.filter((milestone) => milestone._id !== milestoneId),
      }));
    } catch (error) {
      console.error('Error deleting milestone:', error);
      throw error;
    }
  },

  // Utility function to get milestone by ID
  getMilestoneById: (id) => {
    //console.log(`Fetching milestone by id: ${id}`);
    return get().milestones.find((milestone) => milestone._id === id);
  },

    // Delete subtask
    deleteSubtask: async (milestoneId, taskId, subtaskId) => {
      //console.log("✅ Store - deleteSubtask ejecutado con:", { milestoneId, taskId, subtaskId });
      if (!milestoneId || !taskId || !subtaskId) {
        //console.error("❌ ERROR: Faltan parámetros en deleteSubtask");
        return;
      }
      try {
        const state = get();
        const milestone = state.milestones.find((m) => m._id === milestoneId);
        if (!milestone) return;
  
        const updatedTasks = milestone.tasks.map((task) => {
          if (task._id === taskId) {
            const updatedSubtasks = task.subtasks.filter((subtask) => subtask._id !== subtaskId);
            return { ...task, subtasks: updatedSubtasks };
          }
          return task;
        }).filter((task) => task.subtasks.length > 0); // Eliminar tareas sin subtareas
  
        const updatedMilestone = { ...milestone, tasks: updatedTasks };
        await axios.put(`https://api.nevtis.com/dialtools/milestones/update/${milestoneId}`, updatedMilestone);
  
        set((state) => ({
          milestones: state.milestones.map((m) => (m._id === milestoneId ? updatedMilestone : m)),
        }));
      } catch (error) {
        console.error('Error deleting subtask:', error);
      }
    },

    deleteTask: async (milestoneId, taskId) => {
      try {
        //console.log("Deleting task:", { milestoneId, taskId });
        const milestone = get().milestones.find(m => m._id === milestoneId);
        if (!milestone) {
          console.error("Milestone not found");
          return;
        }
  
        const updatedTasks = milestone.tasks.filter(task => task._id !== taskId);
        const updatedMilestone = { ...milestone, tasks: updatedTasks };
        
        console.log("Updated milestone before sending to backend:", updatedMilestone);
  
        const response = await axios.put(`https://api.nevtis.com/dialtools/milestones/update/${milestoneId}`, updatedMilestone);
        console.log("Task deleted successfully, updated milestone from backend:", response.data);
  
        set((state) => ({
          milestones: state.milestones.map(m => m._id === milestoneId ? response.data : m)
        }));
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    },
    updateSubtask: async (milestoneId, taskId, subtaskId, data) => {
      try {
        const state = get();
        const milestone = state.milestones.find(m => m._id === milestoneId);
        if (!milestone) return;
    
        // Buscar la tarea correcta
        const updatedTasks = milestone.tasks.map(task => {
          if (task._id === taskId) {
            // Actualizar la subtask
            const updatedSubtasks = task.subtasks.map(subtask =>
              subtask._id === subtaskId ? { ...subtask, ...data } : subtask
            );
    
            // Calcular progreso de la tarea
            const totalSubtasks = updatedSubtasks.length;
            const completedSubtasks = updatedSubtasks.filter(st => st.completed).length;
            const taskProgress = totalSubtasks ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
            const status = taskProgress === 100 ? "completed" : taskProgress > 0 ? "in-progress" : "planned";
    
            return { ...task, subtasks: updatedSubtasks, progress: taskProgress, status };
          }
          return task;
        });
    
        // ✅ CORRECCIÓN: Calcular progreso real del milestone basado en subtareas
        const totalSubtasksAcrossTasks = updatedTasks.reduce((sum, task) => sum + task.subtasks.length, 0);
        const completedSubtasksAcrossTasks = updatedTasks.reduce(
          (sum, task) => sum + task.subtasks.filter(st => st.completed).length,
          0
        );
        const milestoneProgress = totalSubtasksAcrossTasks
          ? Math.round((completedSubtasksAcrossTasks / totalSubtasksAcrossTasks) * 100)
          : 0;
    
        const updatedMilestone = { ...milestone, tasks: updatedTasks, progress: milestoneProgress };
    
        // Enviar actualización al backend
        await axios.put(`https://api.nevtis.com/dialtools/milestones/update/${milestoneId}`, updatedMilestone);
    
        // Actualizar estado en el store
        set(state => ({
          milestones: state.milestones.map(m => (m._id === milestoneId ? updatedMilestone : m))
        }));
      } catch (error) {
        console.error("Error updating subtask:", error);
      }
    },
    
    
}));

export default useMilestonesStore;



