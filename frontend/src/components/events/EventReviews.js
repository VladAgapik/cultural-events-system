import React, { useState, useEffect } from 'react';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';

const EventReviews = ({ eventId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    loadReviews();
  }, [eventId]);

  const loadReviews = async () => {
    try {
      const reviewsData = await reviewService.getReviewsByEvent(eventId);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Ошибка загрузки отзывов:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      alert('Для добавления отзыва необходимо войти в систему');
      return;
    }

    try {
      setLoading(true);
      await reviewService.createReview({
        rating: parseInt(newReview.rating),
        comment: newReview.comment,
        user: { id: user.id },
        event: { id: eventId }
      });

      setNewReview({ rating: 5, comment: '' });
      await loadReviews(); // Перезагружаем отзывы
      alert('Отзыв успешно добавлен!');
    } catch (error) {
      console.error('Ошибка добавления отзыва:', error);
      alert('Ошибка при добавлении отзыва');
    } finally {
      setLoading(false);
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="mt-4">
      <h5>💬 Отзывы о мероприятии</h5>

      {/* Статистика отзывов */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h3 className="text-warning">{getAverageRating()}</h3>
              <p className="mb-0">Средняя оценка</p>
              <small className="text-muted">на основе {reviews.length} отзывов</small>
            </div>
          </div>
        </div>
      </div>

      {/* Форма добавления отзыва */}
      {isAuthenticated() && (
        <div className="card mb-4">
          <div className="card-body">
            <h6>Добавить отзыв</h6>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-3">
                <label className="form-label">Оценка:</label>
                <select
                  className="form-select"
                  value={newReview.rating}
                  onChange={(e) => setNewReview({...newReview, rating: e.target.value})}
                  required
                >
                  <option value="5">⭐️⭐️⭐️⭐️⭐️ (5)</option>
                  <option value="4">⭐️⭐️⭐️⭐️ (4)</option>
                  <option value="3">⭐️⭐️⭐️ (3)</option>
                  <option value="2">⭐️⭐️ (2)</option>
                  <option value="1">⭐️ (1)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Комментарий:</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  placeholder="Поделитесь впечатлениями о мероприятии..."
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Добавление...' : '📝 Добавить отзыв'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Список отзывов */}
      <div className="reviews-list">
        <h6>Отзывы пользователей:</h6>
        {reviews.length === 0 ? (
          <p className="text-muted">Пока нет отзывов. Будьте первым!</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="card mb-2">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <strong>{review.user?.username || 'Пользователь'}</strong>
                    <div className="text-warning">
                      {'⭐'.repeat(review.rating)}
                    </div>
                  </div>
                  <small className="text-muted">
                    {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                  </small>
                </div>
                <p className="mt-2 mb-0">{review.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventReviews;