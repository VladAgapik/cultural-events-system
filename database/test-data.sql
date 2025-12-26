-- Очистка таблиц (опционально)
TRUNCATE TABLE favorites, reviews, events, categories, users RESTART IDENTITY CASCADE;

-- Вставляем тестовые категории
INSERT INTO categories (name) VALUES
('Концерты'),
('Выставки'),
('Фестивали'),
('Театр'),
('Кино');

-- Вставляем тестовых пользователей
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@example.com', 'admin123', 'ADMIN'),
('user1', 'user1@example.com', 'user123', 'USER'),
('user2', 'user2@example.com', 'user123', 'USER');

-- Вставляем тестовые мероприятия
INSERT INTO events (title, description, category_id, date, location, organizer, image_url) VALUES
('Рок-фестиваль 2024', 'Крупнейший рок-фестиваль года с участием мировых звезд', 3, '2024-06-15', 'Центральный парк', 'Rock Productions', 'https://example.com/rock-festival.jpg'),
('Выставка современного искусства', 'Работы современных художников со всего мира', 2, '2024-05-20', 'Галерея искусств', 'Art Gallery', 'https://example.com/art-exhibition.jpg'),
('Джазовый концерт', 'Вечер джазовой музыки с известными исполнителями', 1, '2024-04-10', 'Концертный зал', 'Jazz Club', 'https://example.com/jazz-concert.jpg'),
('Театральная премьера', 'Премьера новой пьесы известного драматурга', 4, '2024-07-01', 'Городской театр', 'Театр драмы', 'https://example.com/theater-premiere.jpg'),
('Кинофестиваль', 'Показ независимого кино', 5, '2024-08-20', 'Кинотеатр "Мир"', 'Film Society', 'https://example.com/film-festival.jpg');

-- Вставляем тестовые отзывы
INSERT INTO reviews (user_id, event_id, rating, comment, created_at) VALUES
(2, 1, 5, 'Отличный фестиваль! Музыка на высшем уровне.', NOW()),
(3, 1, 4, 'Хорошая организация, но мало места.', NOW()),
(2, 2, 5, 'Великолепные работы! Обязательно к посещению.', NOW()),
(3, 3, 5, 'Невероятный джаз! Получил огромное удовольствие.', NOW());

-- Вставляем тестовые избранные
INSERT INTO favorites (user_id, event_id) VALUES
(2, 1),
(2, 3),
(3, 2);