import api from './api';

export const eventService = {
  // Получить все мероприятия
  getAllEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },

  // Получить мероприятие по ID
  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Создать мероприятие
  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  // Обновить мероприятие
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  // Удалить мероприятие
  deleteEvent: async (id) => {
    await api.delete(`/events/${id}`);
  },

  // Получить будущие мероприятия
  getUpcomingEvents: async () => {
    const response = await api.get('/events/upcoming');
    return response.data;
  },

  // Получить прошедшие мероприятия
  getPastEvents: async () => {
    const response = await api.get('/events/past');
    return response.data;
  },

  // Поиск мероприятий по названию
  searchEvents: async (title) => {
    const response = await api.get(`/events/search/title?title=${title}`);
    return response.data;
  },

  // Поиск мероприятий по локации
  searchEventsByLocation: async (location) => {
    const response = await api.get(`/events/search/location?location=${location}`);
    return response.data;
  },

  // Расширенный поиск с фильтрами
  searchEventsWithFilters: async (title, categoryId, date, location) => {
    const response = await api.get(`/events/search/filter`, {
      params: { title, categoryId, date, location }
    });
    return response.data;
  },

  // Получить мероприятия с сортировкой по дате
  getEventsSortedByDateAsc: async () => {
    const response = await api.get('/events/sorted/date-asc');
    return response.data;
  },

  getEventsSortedByDateDesc: async () => {
    const response = await api.get('/events/sorted/date-desc');
    return response.data;
  },

  // Получить количество мероприятий
  getEventCount: async () => {
    const response = await api.get('/events/count');
    return response.data;
  }
};