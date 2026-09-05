import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Memakai Proxy Internal Vite
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tangani 401 secara global
    if (error.response && error.response.status === 401) {
      // Jangan redirect jika user sedang berada di halaman publik
      const publicPaths = ['/login', '/register', '/catalog', '/traceability', '/partners', '/impact', '/terms', '/privacy', '/contact', '/'];
      const currentPath = window.location.pathname;
      
      const isPublicPath = publicPaths.some(path => currentPath === path || currentPath.startsWith(path + '/'));
      
      if (!isPublicPath) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
