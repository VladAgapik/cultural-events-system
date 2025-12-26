import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { favoriteService } from '../services/favoriteService';
import { useAuth } from '../context/AuthContext';

const CATEGORY_TITLES = {
  concerts: 'Концерты',
  exhibitions: 'Выставки',
  festivals: 'Фестивали'
};

const CategoryEventsPage = () => {
  const { categoryKey } = useParams();
  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    loadEvents();
  }, [categoryKey]);

  useEffect(() => {
    if (isAuthenticated()) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const allEvents = await eventService.getAllEvents();

      const filtered = allEvents.filter(
        e => e.category?.name?.toLowerCase() === CATEGORY_TITLES[categoryKey]?.toLowerCase()
      );

      setEvents(filtered);
    } catch (error) {
      console.error('Ошибка загрузки мероприятий:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const favoritesData = await favoriteService.getUserFavorites(user.id);
      const map = {};
      favoritesData.forEach(f => {
        map[f.event.id] = true;
      });
      setFavorites(map);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleFavorite = async (eventId) => {
    if (!isAuthenticated()) {
      alert('Необходимо войти в систему');
      return;
    }

    try {
      if (favorites[eventId]) {
        await favoriteService.removeFromFavorites(user.id, eventId);
        setFavorites(prev => ({ ...prev, [eventId]: false }));
      } else {
        await favoriteService.addToFavorites({
          user: { id: user.id },
          event: { id: eventId }
        });
        setFavorites(prev => ({ ...prev, [eventId]: true }));
      }
    } catch (e) {
      alert('Ошибка обновления избранного');
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">{CATEGORY_TITLES[categoryKey]}</h1>

      <div className="row">
        {events.length === 0 ? (
          <div className="alert alert-info">
            В данной категории мероприятий пока нет
          </div>
        ) : (
          events.map(event => (
            <div key={event.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h5>{event.title}</h5>

                    {isAuthenticated() && (
                      <button
                        className={`btn btn-sm ${
                          favorites[event.id]
                            ? 'btn-danger'
                            : 'btn-outline-primary'
                        }`}
                        onClick={() => toggleFavorite(event.id)}
                      >
                        {favorites[event.id] ? '💔' : '❤️'}
                      </button>
                    )}
                  </div>

                  <p className="text-muted">{event.description}</p>

                  <p>
                    <small>📅 {new Date(event.date).toLocaleDateString('ru-RU')}</small>
                  </p>

                  <p>
                    <small>📍 {event.location}</small>
                  </p>

                  <Link
                    to={`/events/${event.id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Подробнее
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryEventsPage;
