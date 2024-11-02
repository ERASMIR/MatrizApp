import axios from 'axios';

const LEGAL_MATRIZ_API_BASE_URL = 'http://localhost:3000/matriz-legal-ar';
const EMPRESA_API_BASE_URL = 'http://localhost:3000/empresa';
const LOCACION_API_BASE_URL = 'http://localhost:3000/locacion';
const USER_API_BASE_URL = 'http://localhost:3000/users';
const CARGO_API_BASE_URL = 'http://localhost:3000/cargos';
const GESTLEGAL_API_BASE_URL = 'http://localhost:3000/gestion-legal';



// Obtener todas las categorías
export const getCategorias = () => {
  return axios.get(`${LEGAL_MATRIZ_API_BASE_URL}/categorias`);
};

// Obtener todas las normas
export const getNormas = () => {
  return axios.get(`${LEGAL_MATRIZ_API_BASE_URL}/normas`);
};

// Obtener detalles de los artículos de una norma específica por su ID
export const getNormaById = (id) => {
  return axios.get(`${LEGAL_MATRIZ_API_BASE_URL}/articulos/norma/${id}`);
};

// Obtener normas filtradas por categoría
export const getNormasByCategoria = (id) => {
  return axios.get(`${LEGAL_MATRIZ_API_BASE_URL}/normas/categorias/${id}`);
};

// Obtener normas filtradas por jurisdicción
export const getNormasByJurisdiccion = (id) => {
  return axios.get(`${LEGAL_MATRIZ_API_BASE_URL}/normas/jurisdicciones/${id}`);
};

// Obtener normas filtradas por jurisdicción
export const getJurisdicciones = (id) => {
  return axios.get(`${LEGAL_MATRIZ_API_BASE_URL}/jurisdicciones`);
};

// Crear una nueva empresa
export const createEmpresa = (formData) => {
  return axios.post(`${EMPRESA_API_BASE_URL}/crear-empresa`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Consultar empresas
export const getEmpresas = () => {
  return axios.get(`${EMPRESA_API_BASE_URL}/lista-empresas`);
};



export const createLocacion = (formData) => {
  return axios.post(`${LOCACION_API_BASE_URL}/crear-locacion`, formData, {
    headers: {
      'Content-Type': 'application/json'  // Cambia a application/json
    }
  });
};


// Crear una nueva locación
// export const createLocacion = (formData) => {
//   return axios.post(`${LOCACION_API_BASE_URL}/crear-locacion`, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   });
// };

// Consultar locaciones
export const getLocacion = () => {
  return axios.get(`${LOCACION_API_BASE_URL}/lista-locaciones`);
};


// Crear un nuevo usuario
export const createUser = (formData) => {
  return axios.post(`${USER_API_BASE_URL}/crear-usuarios`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Consultar usuarios
export const getUser = () => {
  return axios.get(`${USER_API_BASE_URL}/lista-usuarios`);
};

// Consultar tipos de usuario existentes
export const getClaseUser = () => {
  return axios.get(`${USER_API_BASE_URL}/clases-user`);
};


// Consultar cargos
export const getCargo = () => {
  return axios.get(`${CARGO_API_BASE_URL}/lista-cargos`);
};


// Consultar estados de aplica o no aplica e informativo de un artículo
export const getAplica = () => {
  return axios.get(`${GESTLEGAL_API_BASE_URL}/lista-aplica`);
};

// alta de si aplica o no un articulo
//export const updateAplicaArticulo = () => {
  //return axios.patch(`${GESTLEGAL_API_BASE_URL}/update-aplica-art`);
//};


// alta de si aplica o no un articulo
export const updateAplicaArticulo = (articuloId, empresaId, locacionId, fechaRegistro,  selectAplica ) => {
  return axios.patch(`${GESTLEGAL_API_BASE_URL}/update-aplica-art`, {
    articuloId,
    empresaId,
    locacionId,
    fechaRegistro,
    selectAplica
  });
};


// Función para obtener el valor de "Aplica" para un artículo específico, filtrado por empresa y locación
export const getValorAplica = async (articuloId, locacionId, empresaId) => {
  try {
    const response = await axios.get(`${GESTLEGAL_API_BASE_URL}/lista-valor-aplica/${articuloId}/${locacionId}/${empresaId}`);
    return response.data;  // Retorna los datos obtenidos de la API
  } catch (error) {
    console.error('Error al obtener el valor de aplica:', error);
    throw error;  // Lanza el error para manejarlo en el componente que llama esta función
  }
};
