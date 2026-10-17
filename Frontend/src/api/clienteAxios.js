import axios from 'axios';
import { obtenerToken, limpiarSesion } from '../utilidades/almacenamiento';

export const BASE_URL = '';

const clienteAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


clienteAxios.interceptors.request.use(
  async (config) => {
    const token = await obtenerToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


clienteAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    
    if (error.response?.status === 401) {
      await limpiarSesion();
    }


    if (!error.response) {
      const errorRed = new Error('Error de conexión');
      errorRed.esErrorDeRed = true;
      errorRed.response = {
        data: {
          mensaje:
            'No se pudo conectar. Verifica tu conexión a internet o intenta más tarde.',
        },
      };
      return Promise.reject(errorRed);
    }

    return Promise.reject(error);
  }
);

export default clienteAxios;