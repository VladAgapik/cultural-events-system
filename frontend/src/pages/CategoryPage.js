import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { favoriteService } from '../services/favoriteService';
import { useAuth } from '../context/AuthContext';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState({});
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    loadEvents();
  }, [categoryName]);

  useEffect(() => {
    if (isAuthenticated()) loadFavorites();
  }, [isAuthenticated]);

  const loadEvents = async () => {
    const all = await eventService.getAllEvents();
    setEvents(
      all.filter(e =>
        e.category?.name.toLowerCase() === categoryName.toLowerCase()
      )
    );
  };

  const loadFavorites = async () => {
    const favs = await favoriteService.getUserFavorites(user.id);
    const map = {};
    favs.forEach(f => (map[f.event.id] = true));
    setFavorites(map);
  };

  const toggleFavorite = async (eventId) => {
    if (!isAuthenticated()) return alert('Войдите');

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
  };

  return (
    <div className="container mt-4">
      <h1>{categoryName}</h1>

      <div className="row">
        {events.map(event => (
          <div key={event.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5>{event.title}</h5>

                  {isAuthenticated() && (
                    <button
                      className={`btn btn-sm ${favorites[event.id] ? 'btn-danger' : 'btn-outline-primary'}`}
                      onClick={() => toggleFavorite(event.id)}
                    >
                      {favorites[event.id] ? '💔' : '❤️'}
                    </button>
                  )}
                </div>

                <p className="text-muted">{event.description}</p>

                <Link
                  to={`/events/${event.id}`}
                  className="btn btn-outline-primary btn-sm mt-2"
                >
                  Подробнее
                </Link>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
