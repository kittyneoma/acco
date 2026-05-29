import axios from 'axios';

// crea instancia de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // el servidor responde con un codigo de error
      if (error.response.status === 401) {
        // token invalido o expirado
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // retorna el mensaje de error del servidor
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // la peticion se hizo pero no hubo respuesta
      return Promise.reject({
        success: false,
        message: 'Could not connect to the server. Please try again.'
      });
    } else {
      return Promise.reject({
        success: false,
        message: error.message || 'Unknown error occurred'
      });
    }
  }
);

export default api;