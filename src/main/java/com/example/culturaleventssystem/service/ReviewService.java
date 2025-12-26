package com.example.culturaleventssystem.service;

import com.example.culturaleventssystem.entity.Review;
import com.example.culturaleventssystem.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    // Создать отзыв
    public Review createReview(Review review) {
        // Проверяем, не оставлял ли пользователь уже отзыв на это мероприятие
        if (reviewRepository.findByUserIdAndEventId(review.getUser().getId(), review.getEvent().getId()).isPresent()) {
            throw new RuntimeException("User has already reviewed this event");
        }
        return reviewRepository.save(review);
    }

    // Получить все отзывы
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // Найти отзыв по ID
    public Optional<Review> getReviewById(Long id) {
        return reviewRepository.findById(id);
    }

    // Обновить отзыв
    public Review updateReview(Long id, Review reviewDetails) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));

        review.setRating(reviewDetails.getRating());
        review.setComment(reviewDetails.getComment());

        return reviewRepository.save(review);
    }

    // Удалить отзыв
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));
        reviewRepository.delete(review);
    }

    // Получить отзывы для мероприятия
    public List<Review> getReviewsByEventId(Long eventId) {
        return reviewRepository.findByEventId(eventId);
    }

    // Получить отзывы пользователя
    public List<Review> getReviewsByUserId(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    // Получить конкретный отзыв пользователя для мероприятия
    public Optional<Review> getReviewByUserAndEvent(Long userId, Long eventId) {
        return reviewRepository.findByUserIdAndEventId(userId, eventId);
    }

    // Получить средний рейтинг мероприятия
    public Double getAverageRatingForEvent(Long eventId) {
        Double avgRating = reviewRepository.findAverageRatingByEventId(eventId);
        return avgRating != null ? avgRating : 0.0;
    }

    // Получить количество отзывов для мероприятия
    public Long getReviewCountForEvent(Long eventId) {
        return reviewRepository.countByEventId(eventId);
    }

    // Получить отзывы с сортировкой по дате
    public List<Review> getReviewsSortedByDate(Long eventId, boolean ascending) {
        return ascending ?
                reviewRepository.findByEventIdOrderByCreatedAtAsc(eventId) :
                reviewRepository.findByEventIdOrderByCreatedAtDesc(eventId);
    }

    // Получить отзывы с сортировкой по рейтингу
    public List<Review> getReviewsSortedByRating(Long eventId, boolean ascending) {
        return ascending ?
                reviewRepository.findByEventIdOrderByRatingAsc(eventId) :
                reviewRepository.findByEventIdOrderByRatingDesc(eventId);
    }
}