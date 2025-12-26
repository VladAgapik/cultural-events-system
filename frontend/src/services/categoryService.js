import api from './api';

export const categoryService = {
  // Получить все категории
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Получить категорию по ID
  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Создать категорию
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Обновить категорию
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Удалить категорию
  deleteCategory: async (id) => {
    await api.delete(`/categories/${id}`);
  }
};