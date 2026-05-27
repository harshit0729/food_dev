import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://56.228.12.101:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.get('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  updatePassword: (data) => api.put('/auth/password', data),
  addAddress: (data) => api.post('/auth/address', data),
  deleteAddress: (id) => api.delete(`/auth/address/${id}`),
};

export const restaurantAPI = {
  getAll: (params) => api.get('/restaurants', { params }),
  getFeatured: () => api.get('/restaurants/featured'),
  getById: (id) => api.get(`/restaurants/${id}`),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  delete: (id) => api.delete(`/restaurants/${id}`),
};

export const foodAPI = {
  getAll: (params) => api.get('/food', { params }),
  getFeatured: () => api.get('/food/featured'),
  getById: (id) => api.get(`/food/${id}`),
  create: (data) => api.post('/food', data),
  update: (id, data) => api.put(`/food/${id}`, data),
  delete: (id) => api.delete(`/food/${id}`),
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  getAllOrders: (params) => api.get('/orders/all', { params }),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart', data),
  updateItem: (itemId, data) => api.put(`/cart/${itemId}`, data),
  removeItem: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart'),
};

export const reviewAPI = {
  getAll: (params) => api.get('/reviews', { params }),
  create: (data) => api.post('/reviews', data),
  summarize: (restaurantId, foodItemId) =>
    api.get(`/reviews/summarize/${restaurantId}${foodItemId ? `/${foodItemId}` : ''}`),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const aiAPI = {
  recommendByMood: (data) => api.post('/ai/recommend/mood', data),
  recommendByWeather: (data) => api.post('/ai/recommend/weather', data),
  recommendByBudget: (data) => api.post('/ai/recommend/budget', data),
  recommendHealthy: (data) => api.post('/ai/recommend/healthy', data),
  recommendTrending: () => api.post('/ai/recommend/trending'),
  smartSearch: (data) => api.post('/ai/search', data),
  getMealPlan: (data) => api.post('/ai/meal-plan', data),
  chat: (data) => api.post('/ai/chat', data),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;
