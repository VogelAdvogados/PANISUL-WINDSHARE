import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to show loading state
api.interceptors.request.use(
  (config) => {
    // You can add loading state here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      toast.error(`Erro: ${error.response.data.detail || error.response.statusText}`);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('Erro de conexão com o servidor');
      return Promise.reject({ message: 'Erro de conexão com o servidor' });
    } else {
      // Something happened in setting up the request that triggered an Error
      toast.error('Erro ao processar a requisição');
      return Promise.reject({ message: 'Erro ao processar a requisição' });
    }
  }
);

export default api;
