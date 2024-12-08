import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Asegúrate de que coincide con tu back-end
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // El token se guarda al iniciar sesión
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
