import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import { userService } from '../services/userService';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const { user, isAdmin } = useAuth();

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    date: '',
    location: '',
    organizer: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (isAdmin()) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsData, usersData, categoriesData] = await Promise.all([
        eventService.getAllEvents(),
        userService.getAllUsers(),
        categoryService.getAllCategories()
      ]);
      setEvents(eventsData);
      setUsers(usersData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

 const handleEventSubmit = async (e) => {
   e.preventDefault();
   try {
     if (editingEvent) {
       await eventService.updateEvent(editingEvent.id, {
         ...eventForm,
         category: { id: Number(eventForm.categoryId) }
       });
       alert('Мероприятие обновлено!');
     } else {
       await eventService.createEvent({
         ...eventForm,
         category: { id: Number(eventForm.categoryId) }
       });
       alert('Мероприятие создано!');
     }
   } catch (error) {
     console.error("Ошибка сохранения мероприятия:", error);
     const msg =
       error?.response?.data?.message ||
       error?.message ||
       "Ошибка на сервере";
     alert("Не удалось сохранить мероприятие: " + msg);
   }
 };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description || '',
      categoryId: event.category?.id || '',
      date: event.date,
      location: event.location || '',
      organizer: event.organizer || '',
      imageUrl: event.imageUrl || ''
    });
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Вы уверены, что хотите удалить это мероприятие?')) {
      try {
        await eventService.deleteEvent(eventId);
        alert('Мероприятие удалено!');
        loadData();
      } catch (error) {
        console.error('Ошибка удаления мероприятия:', error);
        alert('Ошибка при удалении мероприятия');
      }
    }
  };

  const handleChangeUserRole = async (userId, newRole) => {
    try {
      await userService.changeUserRole(userId, newRole);
      alert(`Роль пользователя изменена на ${newRole}`);
      loadData();
    } catch (error) {
      console.error('Ошибка изменения роли:', error);
      alert('Ошибка при изменении роли пользователя');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        await userService.deleteUser(userId);
        alert('Пользователь удален!');
        loadData();
      } catch (error) {
        console.error('Ошибка удаления пользователя:', error);
        alert('Ошибка при удалении пользователя');
      }
    }
  };

  // Статистика для админа
  // Пользователи
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const regularUsers = users.filter(u => u.role === 'USER').length;

  // Мероприятия
  const totalEvents = events.length;
  const eventsWithoutCategory = events.filter(e => !e.category).length;

  // Категории
  const totalCategories = categories.length;

  // Среднее количество мероприятий на категорию
  const avgEventsPerCategory =
    totalCategories > 0
      ? (totalEvents / totalCategories).toFixed(2)
      : 0;

  // Самая популярная категория
  const categoryStats = {};

  events.forEach(event => {
    const name = event.category?.name;
    if (name) {
      categoryStats[name] = (categoryStats[name] || 0) + 1;
    }
  });

  const mostPopularCategory = Object.entries(categoryStats)
    .sort((a, b) => b[1] - a[1])[0];


  // Если пользователь не админ
  if (!isAdmin()) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4>🚫 Доступ запрещен</h4>
          <p>У вас нет прав для доступа к панели администратора.</p>
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
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1>👨‍💼 Панель администратора</h1>
          <p className="text-muted">Добро пожаловать, {user?.username}!</p>

          {/* Навигация по вкладкам */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'events' ? 'active' : ''}`}
                onClick={() => setActiveTab('events')}
              >
                🎭 Мероприятия ({events.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                👥 Пользователи ({users.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`}
                onClick={() => setActiveTab('stats')}
              >
                📊 Статистика
              </button>
            </li>
          </ul>

          {/* Содержимое вкладок */}
          <div className="tab-content">
            {/* Вкладка мероприятий */}
            {activeTab === 'events' && (
              <div className="tab-pane fade show active">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4>Управление мероприятиями</h4>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setEditingEvent(null);
                      setEventForm({
                        title: '', description: '', categoryId: '', date: '', location: '', organizer: '', imageUrl: ''
                      });
                      setShowEventForm(true);
                    }}
                  >
                    ➕ Добавить мероприятие
                  </button>
                </div>

                {/* Форма добавления/редактирования мероприятия */}
                {showEventForm && (
                  <div className="card mb-4">
                    <div className="card-body">
                      <h5>{editingEvent ? '✏️ Редактирование мероприятия' : '➕ Добавление мероприятия'}</h5>
                      <form onSubmit={handleEventSubmit}>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Название *</label>
                              <input
                                type="text"
                                className="form-control"
                                value={eventForm.title}
                                onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Категория *</label>
                              <select
                                className="form-select"
                                value={eventForm.categoryId}
                                onChange={(e) => setEventForm({...eventForm, categoryId: e.target.value})}
                                required
                              >
                                <option value="">Выберите категорию</option>
                                {categories.map(cat => (
                                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Описание</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={eventForm.description}
                            onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                          />
                        </div>

                        <div className="row">
                          <div className="col-md-4">
                            <div className="mb-3">
                              <label className="form-label">Дата *</label>
                              <input
                                type="date"
                                className="form-control"
                                value={eventForm.date}
                                onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <label className="form-label">Место</label>
                              <input
                                type="text"
                                className="form-control"
                                value={eventForm.location}
                                onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <label className="form-label">Организатор</label>
                              <input
                                type="text"
                                className="form-control"
                                value={eventForm.organizer}
                                onChange={(e) => setEventForm({...eventForm, organizer: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">URL изображения</label>
                          <input
                            type="url"
                            className="form-control"
                            value={eventForm.imageUrl}
                            onChange={(e) => setEventForm({...eventForm, imageUrl: e.target.value})}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>

                        <div className="d-flex gap-2">
                          <button type="submit" className="btn btn-success">
                            {editingEvent ? '💾 Сохранить изменения' : '✅ Создать мероприятие'}
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                              setShowEventForm(false);
                              setEditingEvent(null);
                            }}
                          >
                            ❌ Отмена
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Таблица мероприятий */}
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Категория</th>
                        <th>Дата</th>
                        <th>Место</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map(event => (
                        <tr key={event.id}>
                          <td>{event.id}</td>
                          <td>
                            <strong>{event.title}</strong>
                            <br/>
                            <small className="text-muted">{event.organizer}</small>
                          </td>
                          <td>
                            <span className="badge bg-info">{event.category?.name}</span>
                          </td>
                          <td>{new Date(event.date).toLocaleDateString('ru-RU')}</td>
                          <td>{event.location}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleEditEvent(event)}
                              >
                                ✏️
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDeleteEvent(event.id)}
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Вкладка пользователей */}
            {activeTab === 'users' && (
              <div className="tab-pane fade show active">
                <h4>Управление пользователями</h4>

                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Имя пользователя</th>
                        <th>Email</th>
                        <th>Роль</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(userItem => (
                        <tr key={userItem.id}>
                          <td>{userItem.id}</td>
                          <td>
                            <strong>{userItem.username}</strong>
                            {userItem.role === 'ADMIN' && (
                              <span className="badge bg-warning ms-1">ADMIN</span>
                            )}
                          </td>
                          <td>{userItem.email}</td>
                          <td>
                            <span className={`badge ${userItem.role === 'ADMIN' ? 'bg-warning' : 'bg-secondary'}`}>
                              {userItem.role}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              {userItem.role === 'USER' ? (
                                <button
                                  className="btn btn-outline-warning"
                                  onClick={() => handleChangeUserRole(userItem.id, 'ADMIN')}
                                  title="Сделать администратором"
                                >
                                  👑 Назначить админом
                                </button>
                              ) : userItem.id !== user.id ? ( // Не позволяем снять админку с себя
                                <button
                                  className="btn btn-outline-secondary"
                                  onClick={() => handleChangeUserRole(userItem.id, 'USER')}
                                  title="Сделать пользователем"
                                >
                                  👤 Снять админку
                                </button>
                              ) : (
                                <span className="text-muted">Это вы</span>
                              )}
                              {userItem.id !== user.id && ( // Не позволяем удалить себя
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => handleDeleteUser(userItem.id)}
                                >
                                  🗑️
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Вкладка статистики */}
            {activeTab === 'stats' && (
              <div className="tab-pane fade show active">
                <h4>Статистика системы</h4>

                {/* Пользователи */}
                <div className="card mb-3">
                  <div className="card-body">
                    <h5>Пользователи</h5>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">
                        Всего пользователей: <strong>{totalUsers}</strong>
                      </li>
                      <li className="list-group-item">
                        Администраторов: <strong>{adminCount}</strong>
                      </li>
                      <li className="list-group-item">
                        Обычных пользователей: <strong>{regularUsers}</strong>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Мероприятия */}
                <div className="card mb-3">
                  <div className="card-body">
                    <h5>Мероприятия</h5>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">
                        Всего мероприятий: <strong>{totalEvents}</strong>
                      </li>
                      <li className="list-group-item">
                        Без категории: <strong>{eventsWithoutCategory}</strong>
                      </li>
                      <li className="list-group-item">
                        Среднее мероприятий на категорию:{' '}
                        <strong>{avgEventsPerCategory}</strong>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Категории */}
                <div className="card mb-3">
                  <div className="card-body">
                    <h5>Категории</h5>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">
                        Всего категорий: <strong>{totalCategories}</strong>
                      </li>
                      <li className="list-group-item">
                        Самая популярная категория:{' '}
                        <strong>
                          {mostPopularCategory
                            ? `${mostPopularCategory[0]} (${mostPopularCategory[1]})`
                            : 'Нет данных'}
                        </strong>
                      </li>
                    </ul>
                  </div>
                </div>

                <small className="text-muted">
                  Последнее обновление: {new Date().toLocaleString('ru-RU')}
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;