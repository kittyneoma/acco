import api from './api';

const projectService = {
  // obtiene todos los proyectos
  getProjects: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/projects?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // obtiene un proyecto por id
  getProject: async (id) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // crea un nuevo proyecto
  createProject: async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // actualiza un proyecto existente
  updateProject: async (id, projectData) => {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // elimina un proyecto
  deleteProject: async (id) => {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // archiva/desarchiva un proyecto
  toggleArchive: async (id) => {
    try {
      const response = await api.put(`/projects/${id}/archive`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // agrega un colaborador
  addCollaborator: async (projectId, userId) => {
    try {
      const response = await api.post(`/projects/${projectId}/collaborators`, { userId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // obtiene estadisticas del proyecto
  getProjectStats: async (id) => {
    try {
      const response = await api.get(`/projects/${id}/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default projectService;