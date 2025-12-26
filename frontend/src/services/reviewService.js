import api from './api';

export const reviewService = {
  // Получить все отзывы
  getAllReviews: async () => {
    const response = await api.get('/reviews');
    return response.data;
  },

  // Получить отзывы для мероприятия
  getReviewsByEvent: async (eventId) => {
    const response = await api.get(`/reviews/event/${eventId}`);
    return response.data;
  },

  // Получить отзывы пользователя
  getReviewsByUser: async (userId) => {
    const response = await api.get(`/reviews/user/${userId}`);
    return response.data;
  },

  // Создать отзыв
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // Обновить отзыв
  updateReview: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data;
  },

  // Удалить отзыв
  deleteReview: async (id) => {
    await api.delete(`/reviews/${id}`);
  },

  // Получить средний рейтинг
  getAverageRating: async (eventId) => {
    const response = await api.get(`/reviews/event/${eventId}/average-rating`);
    return response.data;
  }
};