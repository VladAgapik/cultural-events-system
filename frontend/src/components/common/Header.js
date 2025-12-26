import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          🎭 Культурные мероприятия
        </Link>

        <div className="navbar-nav">
          <Link className="nav-link" to="/">
            Главная
          </Link>
          <Link className="nav-link" to="/events">
            Мероприятия
          </Link>

          {isAuthenticated() ? (
            <>
              <span className="nav-link">Привет, {user.username}!</span>
              <Link className="nav-link" to="/favorites">
                ❤️ Избранное
              </Link>
              {isAdmin() && (
                <Link className="nav-link" to="/admin">
                  👨‍💼 Админка
                </Link>
              )}
              <button className="nav-link btn btn-link" onClick={handleLogout}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">
                Войти
              </Link>
              <Link className="nav-link" to="/register">
                Регистрация
              </Link>
            </>
          )}

          <Link className="nav-link" to="/about">
            Об авторе
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;