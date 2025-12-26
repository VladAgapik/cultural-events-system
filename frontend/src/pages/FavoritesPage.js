import React, { useState, useEffect } from 'react';
import { favoriteService } from '../services/favoriteService';
import { eventService } from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoritesData = await favoriteService.getUserFavorites(user.id);
      setFavorites(favoritesData);

      // Загружаем полную информацию о мероприятиях
      const eventPromises = favoritesData.map(fav =>
        eventService.getEventById(fav.event.id)
      );
      const eventsData = await Promise.all(eventPromises);
      setFavoriteEvents(eventsData);
    } catch (error) {
      console.error('Ошибка загрузки избранного:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (eventId) => {
    try {
      await favoriteService.removeFromFavorites(user.id, eventId);
      // Обновляем список после удаления
      setFavoriteEvents(prev => prev.filter(event => event.id !== eventId));
      setFavorites(prev => prev.filter(fav => fav.event.id !== eventId));
    } catch (error) {
      console.error('Ошибка удаления из избранного:', error);
      alert('Ошибка при удалении из избранного');
    }
  };

  // Если пользователь не авторизован
  if (!isAuthenticated()) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning text-center">
          <h4>🔒 Требуется авторизация</h4>
          <p>Для просмотра избранных мероприятий необходимо войти в систему.</p>
          <Link to="/login" className="btn btn-primary">
            Войти в систему
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
          <p className="mt-2">Загрузка избранных мероприятий...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>❤️ Избранные мероприятия</h1>
          <p className="text-muted">
            Здесь собраны все мероприятия, которые вы добавили в избранное
          </p>
        </div>
        <div className="text-end">
          <span className="badge bg-primary fs-6">
            {favoriteEvents.length} мероприятий
          </span>
        </div>
      </div>

      {favoriteEvents.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <span style={{ fontSize: '4rem' }}>❤️</span>
          </div>
          <h3>Пока пусто</h3>
          <p className="text-muted mb-4">
            Вы еще не добавили ни одного мероприятия в избранное.
          </p>
          <Link to="/events" className="btn btn-primary btn-lg">
            🎭 Перейти к мероприятиям
          </Link>
        </div>
      ) : (
        <div className="row">
          {favoriteEvents.map(event => (
            <div key={event.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 favorite-card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title">{event.title}</h5>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFromFavorites(event.id)}
                      title="Удалить из избранного"
                    >
                      💔
                    </button>
                  </div>

                  <p className="card-text">{event.description}</p>

                  <div className="event-details">
                    <p className="mb-1">
                      <small className="text-muted">
                        📅 {new Date(event.date).toLocaleDateString('ru-RU')}
                      </small>
                    </p>
                    <p className="mb-1">
                      <small className="text-muted">📍 {event.location}</small>
                    </p>
                    {event.organizer && (
                      <p className="mb-3">
                        <small className="text-muted">🎭 {event.organizer}</small>
                      </p>
                    )}
                  </div>

                  <div className="mt-auto">
                    <Link
                      to={`/events`}
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => window.location.href = '/events'} // Временное решение
                    >
                      📝 Смотреть отзывы
                    </Link>
                  </div>
                </div>

                <div className="card-footer bg-transparent">
                  <small className="text-muted">
                    Добавлено в избранное
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;