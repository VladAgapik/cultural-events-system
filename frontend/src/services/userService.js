import api from './api';

export const userService = {
  // Получить всех пользователей
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Получить пользователя по ID
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Обновить пользователя
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Удалить пользователя
  deleteUser: async (id) => {
    await api.delete(`/users/${id}`);
  },

  // Изменить роль пользователя
  changeUserRole: async (id, newRole) => {
    const user = await userService.getUserById(id);
    const updatedUser = {
      ...user,
      role: newRole
    };
    return await userService.updateUser(id, updatedUser);
  },

  // Получить пользователя по email
  getUserByEmail: async (email) => {
    const response = await api.get(`/users/email/${email}`);
    return response.data;
  },

  // Получить количество пользователей
  getUserCount: async () => {
    const response = await api.get('/users/count');
    return response.data;
  }
};