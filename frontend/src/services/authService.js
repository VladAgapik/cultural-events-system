import api from './api';

export const authService = {
  // Регистрация
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Вход
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Выход
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
};