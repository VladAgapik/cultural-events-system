import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [stats, setStats] = useState({ events: 0 });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadUpcomingEvents();
    loadStats();
  }, []);

  const loadUpcomingEvents = async () => {
    try {
      const events = await eventService.getUpcomingEvents();
      setUpcomingEvents(events.slice(0, 3));
    } catch (error) {
      console.error('Ошибка загрузки мероприятий:', error);
    }
  };

  const loadStats = async () => {
    try {
      const eventsCount = await eventService.getEventCount();
      setStats({ events: eventsCount });
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
  };

  return (
    <div className="home-page">
      {/* Hero */}
      <div className="hero-section text-white fade-in-up">
        <div className="container">
          <h1 className="fw-bold mb-3">
            Культурные мероприятия вашего города
          </h1>
          <p className="lead">
            Концерты, выставки, фестивали — всё в одном месте
          </p>
          <Link to="/events" className="btn btn-light btn-lg mt-3">
            Смотреть все мероприятия
          </Link>
        </div>
      </div>

      <div className="container">

        {/* Статистика */}
        <div className="row mb-5 text-center">
          <div className="col-md-4">
            <div className="card border-0 bg-light">
              <div className="card-body">
                <h2>{stats.events}+</h2>
                <p>Мероприятий</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 bg-light">
              <div className="card-body">
                <h2>Категории</h2>
                <p>По интересам</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 bg-light">
              <div className="card-body">
                <h2>24/7</h2>
                <p>Доступ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ближайшие мероприятия */}
        {upcomingEvents.length > 0 && (
          <div className="mb-5">
            <div className="d-flex justify-content-between mb-3">
              <h2>Ближайшие мероприятия</h2>
              <Link to="/events">Все →</Link>
            </div>

            <div className="row">
              {upcomingEvents.map(event => (
                <div key={event.id} className="col-md-4 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5>{event.title}</h5>
                      <p>{event.description}</p>
                      <small>
                        📅 {new Date(event.date).toLocaleDateString('ru-RU')}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Категории */}
        <div className="mb-5">
          <h2 className="mb-4">Категории</h2>

          <div className="row">
            <div className="col-md-4 mb-3">
              <Link
                to="/category/Концерты"
                className="card h-100 text-decoration-none text-dark"
              >
                <div className="card-body text-center">
                  <h4>Концерты</h4>
                  <p>Живые выступления и музыка</p>
                </div>
              </Link>
            </div>

            <div className="col-md-4 mb-3">
              <Link
                to="/category/Выставки"
                className="card h-100 text-decoration-none text-dark"
              >
                <div className="card-body text-center">
                  <h4>Выставки</h4>
                  <p>Искусство и фотография</p>
                </div>
              </Link>
            </div>

            <div className="col-md-4 mb-3">
              <Link
                to="/category/Фестивали"
                className="card h-100 text-decoration-none text-dark"
              >
                <div className="card-body text-center">
                  <h4>Фестивали</h4>
                  <p>Городские события и праздники</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* CTA */}
        {!isAuthenticated() && (
          <div className="card bg-light text-center p-4">
            <h3>Присоединяйтесь к сообществу</h3>
            <p>Сохраняйте события и оставляйте отзывы</p>
            <Link to="/register" className="btn btn-primary">
              Регистрация
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
