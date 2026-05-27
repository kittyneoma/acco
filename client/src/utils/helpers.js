/*funciones helper del cliente */

/* formatea una fecha para mostrar */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
};

/* formatea una fecha de forma corta */
export const formatDateShort = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES');
};

/* formatea fecha con hora */
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  
  return `${date.toLocaleDateString('es-ES', dateOptions)} a las ${date.toLocaleTimeString('es-ES', timeOptions)}`;
};

/* calcula los dias restantes hasta una fecha */
export const daysUntil = (dateString) => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/* obtiene un mensaje de fecha relativa */
export const getRelativeTime = (dateString) => {
  const days = daysUntil(dateString);
  
  if (days === null) return '';
  if (days < 0) return `Vencido hace ${Math.abs(days)} días`;
  if (days === 0) return 'Vence hoy';
  if (days === 1) return 'Vence mañana';
  if (days <= 7) return `Vence en ${days} días`;
  if (days <= 30) return `Vence en ${Math.ceil(days / 7)} semanas`;
  return `Vence en ${Math.ceil(days / 30)} meses`;
};

/* trunca un texto a cierta longitud */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/* capitaliza la primera letra de una cadena */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/* obtiene las iniciales de un nombre */
export const getInitials = (name) => {
  if (!name) return '';
  
  const names = name.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

/* genera un color aleatorio de la paleta */
export const randomColor = () => {
  const colors = [
    '#9C7CA5', '#896279', '#ADB2D3', '#594F3B', '#776258'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/* debounce function para optimizar busquedas */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/* formatea un numero como porcentaje */
export const formatPercentage = (value, decimals = 0) => {
  return `${Number(value).toFixed(decimals)}%`;
};

/* ordena un array de objetos por una propiedad */
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/* filtra objetos por busqueda en multiples campos */
export const searchInObject = (obj, searchTerm, fields) => {
  if (!searchTerm) return true;
  
  const term = searchTerm.toLowerCase();
  return fields.some(field => {
    const value = obj[field];
    return value && value.toString().toLowerCase().includes(term);
  });
};

/* genera un id unico temporal */
export const generateTempId = () => {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/* copia texto al portapapeles */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
    return false;
  }
};

/* descarga un archivo */
export const downloadFile = (data, filename, mimeType = 'application/json') => {
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/* obtiene un color de prioridad */
export const getPriorityColor = (priority) => {
  const colors = {
    low: '#42A5F5',
    medium: '#FFA726',
    high: '#9C7CA5',
    urgent: '#EF5350'
  };
  return colors[priority] || colors.medium;
};

/* obtiene un color de estado */
export const getStatusColor = (status) => {
  const colors = {
    todo: '#ADB2D3',
    'in-progress': '#9C7CA5',
    review: '#FFA726',
    completed: '#4CAF50',
    blocked: '#EF5350',
    active: '#42A5F5',
    archived: '#9E9E9E',
    'on-hold': '#FFA726'
  };
  return colors[status] || colors.todo;
};

export default {
  formatDate,
  formatDateShort,
  formatDateTime,
  daysUntil,
  getRelativeTime,
  truncateText,
  capitalize,
  getInitials,
  randomColor,
  debounce,
  formatPercentage,
  sortBy,
  searchInObject,
  generateTempId,
  copyToClipboard,
  downloadFile,
  getPriorityColor,
  getStatusColor
};