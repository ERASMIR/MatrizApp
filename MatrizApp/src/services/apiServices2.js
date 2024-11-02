import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/matriz-legal-ar';

// Obtener todas las categorías
export const getCategorias = () => {
  return axios.get(`${API_BASE_URL}/categorias`);
};

// Obtener todas las normas
export const getNormas = () => {
  return axios.get(`${API_BASE_URL}/normas`);
};

// Obtener detalles de los artículos de una norma específica por su ID
export const getNormaById = (id) => {
  return axios.get(`${API_BASE_URL}/articulos/norma/${id}`);
};

// Obtener normas filtradas por categoría
export const getNormasByCategoria = (id) => {
  return axios.get(`${API_BASE_URL}/normas/categorias/${id}`);
};

// Obtener normas filtradas por jurisdicción
export const getNormasByJurisdiccion = (id) => {
  return axios.get(`${API_BASE_URL}/normas/jurisdicciones/${id}`);
};

// Obtener normas filtradas por jurisdicción
export const getJurisdicciones= (id) => {
  return axios.get(`${API_BASE_URL}/jurisdicciones`);
};


