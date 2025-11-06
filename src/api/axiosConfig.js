import axios from 'axios';

// Crea una instancia de Axios con una configuración base.
// La baseURL se toma de las variables de entorno, que cambian
// automáticamente entre desarrollo (http://localhost:5001) y producción.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Añadimos un interceptor de peticiones.
// Esta función se ejecutará ANTES de que cada petición sea enviada.
api.interceptors.request.use(
  (config) => {
    // 1. Intentamos obtener los tokens del localStorage.
    const authTokens = localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens'))
      : null;

    // 2. Si existen los tokens Y la petición no tiene ya un header de Authorization,
    //    añadimos el token de acceso.
    if (authTokens?.access && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${authTokens.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;