import api from './api';

const taskService = {
  // obtiene tareas de un proyecto
  getTasks: async (projectId, filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/projects/${projectId}/tasks?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // obtiene las tareas del usuario actual
  getMyTasks: async () => {
    try {
      const response = await api.get('/tasks/my-tasks');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // obtiene una tarea por id
  getTask: async (id) => {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // crea una nueva tarea
  createTask: async (projectId, taskData) => {
    try {
      const response = await api.post(`/projects/${projectId}/tasks`, taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // actualiza una tarea existente
  updateTask: async (id, taskData) => {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // elimina una tarea
  deleteTask: async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // agrega un comentario
  addComment: async (taskId, text) => {
    try {
      const response = await api.post(`/tasks/${taskId}/comments`, { text });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // actualiza posicion de tarea
  updatePosition: async (id, positionData) => {
    try {
      const response = await api.put(`/tasks/${id}/position`, positionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default taskService;