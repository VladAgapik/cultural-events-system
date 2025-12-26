import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { favoriteService } from '../services/favoriteService';
import { useAuth } from '../context/AuthContext';
import EventReviews from '../components/events/EventReviews';

const EventDetailsPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadEvent();
    if (isAuthenticated()) {
      checkFavorite();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const data = await eventService.getEventById(id);
      setEvent(data);
    } catch (err) {
      setError('Не удалось загрузить мероприятие');
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const favorites = await favoriteService.getUserFavorites(user.id);
      setIsFavorite(favorites.some(f => f.event.id === Number(id)));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated()) {
      alert('Войдите, чтобы добавить в избранное');
      return;
    }

    try {
      if (isFavorite) {
        await favoriteService.removeFromFavorites(user.id, id);
        setIsFavorite(false);
      } else {
        await favoriteService.addToFavorites({
          user: { id: user.id },
          event: { id }
        });
        setIsFavorite(true);
      }
    } catch (err) {
      alert('Ошибка при работе с избранным');
    }
  };

  if (loading) {
    return <div className="container mt-4">Загрузка...</div>;
  }

  if (error || !event) {
    return <div className="container mt-4 alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <Link to="/events" className="btn btn-secondary mb-3">
        ← К списку мероприятий
      </Link>

      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <h2>{event.title}</h2>
            {isAuthenticated() && (
              <button
                className={`btn btn-sm ${isFavorite ? 'btn-danger' : 'btn-outline-primary'}`}
                onClick={toggleFavorite}
              >
                {isFavorite ? '💔 Удалить' : '❤️ В избранное'}
              </button>
            )}
          </div>

          <p className="text-muted mt-2">
            📅 {new Date(event.date).toLocaleDateString('ru-RU')}
            {event.location && ` | 📍 ${event.location}`}
            {event.organizer && ` | 🎭 ${event.organizer}`}
          </p>

          <p className="mt-3">{event.description}</p>

          <hr />

          <EventReviews eventId={event.id} />
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
