import api from './api';

export const favoriteService = {
  // Получить все избранные пользователя
  getUserFavorites: async (userId) => {
    const response = await api.get(`/favorites/user/${userId}`);
    return response.data;
  },

  // Добавить в избранное
  addToFavorites: async (favoriteData) => {
    const response = await api.post('/favorites', favoriteData);
    return response.data;
  },

  // Удалить из избранного
  removeFromFavorites: async (userId, eventId) => {
    await api.delete(`/favorites/user/${userId}/event/${eventId}`);
  },

  // Проверить, есть ли в избранном
  isEventInFavorites: async (userId, eventId) => {
    const response = await api.get(`/favorites/user/${userId}/event/${eventId}/check`);
    return response.data.isFavorite;
  },

  // Получить количество избранных
  getUserFavoriteCount: async (userId) => {
    const response = await api.get(`/favorites/user/${userId}/count`);
    return response.data.favoriteCount;
  }
};