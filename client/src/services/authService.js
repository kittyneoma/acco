import api from './api';

const authService = {
  // registra un nuevo usuario
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // login
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // obtiene el usuario actual
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // actualiza el perfil
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // cambia la contraseña
  changePassword: async (passwords) => {
    try {
      const response = await api.put('/auth/password', passwords);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // verifica si esta autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // obtiene el usuario del localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // obtiene token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;