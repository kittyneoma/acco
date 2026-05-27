/* validadores del lado del cliente */

/* valida formato de email */
export const isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/* valida longitud minima de contraseña */
export const isValidPassword = (password, minLength = 8) => {
  return password && password.length >= minLength;
};

/* valida que las contraseñas coincidan */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/* valida nombre con minimo 2 caracteres) */
export const isValidName = (name) => {
  return name && name.trim().length >= 2;
};

/* valida codigo hexadecimal de color */
export const isValidHexColor = (color) => {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
};

/* valida formato de fecha ISO */
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/* valida que la fecha sea futura */
export const isFutureDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  return date > now;
};

/* valida longitud de texto */
export const isValidLength = (text, minLength, maxLength) => {
  const length = text ? text.trim().length : 0;
  return length >= minLength && length <= maxLength;
};

/* valida numero positivo */
export const isPositiveNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num >= 0;
};

/* sanitiza entrada de texto */
export const sanitizeText = (text) => {
  if (!text) return '';
  return text.trim().replace(/<[^>]*>/g, '');
};

/* valida URL */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

export default {
  isValidEmail,
  isValidPassword,
  passwordsMatch,
  isValidName,
  isValidHexColor,
  isValidDate,
  isFutureDate,
  isValidLength,
  isPositiveNumber,
  sanitizeText,
  isValidUrl
};