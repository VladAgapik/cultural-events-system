package com.example.culturaleventssystem.controller;

import com.example.culturaleventssystem.entity.Review;
import com.example.culturaleventssystem.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Получить все отзывы
    @GetMapping
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    // Получить отзыв по ID
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable Long id) {
        Optional<Review> review = reviewService.getReviewById(id);
        return review.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Создать новый отзыв
    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody Review review) {
        try {
            Review createdReview = reviewService.createReview(review);
            return ResponseEntity.ok(createdReview);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Обновить отзыв
    @PutMapping("/{id}")
    public ResponseEntity<?> updateReview(@PathVariable Long id, @RequestBody Review reviewDetails) {
        try {
            Review updatedReview = reviewService.updateReview(id, reviewDetails);
            return ResponseEntity.ok(updatedReview);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Удалить отзыв
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        try {
            reviewService.deleteReview(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Получить отзывы для мероприятия
    @GetMapping("/event/{eventId}")
    public List<Review> getReviewsByEventId(@PathVariable Long eventId) {
        return reviewService.getReviewsByEventId(eventId);
    }

    // Получить отзывы пользователя
    @GetMapping("/user/{userId}")
    public List<Review> getReviewsByUserId(@PathVariable Long userId) {
        return reviewService.getReviewsByUserId(userId);
    }

    // Получить конкретный отзыв пользователя для мероприятия
    @GetMapping("/user/{userId}/event/{eventId}")
    public ResponseEntity<Review> getReviewByUserAndEvent(@PathVariable Long userId, @PathVariable Long eventId) {
        Optional<Review> review = reviewService.getReviewByUserAndEvent(userId, eventId);
        return review.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Получить средний рейтинг мероприятия
    @GetMapping("/event/{eventId}/average-rating")
    public ResponseEntity<Map<String, Object>> getAverageRatingForEvent(@PathVariable Long eventId) {
        Double avgRating = reviewService.getAverageRatingForEvent(eventId);

        Map<String, Object> response = new HashMap<>();
        response.put("eventId", eventId);
        response.put("averageRating", avgRating);

        return ResponseEntity.ok(response);
    }

    // Получить количество отзывов для мероприятия
    @GetMapping("/event/{eventId}/count")
    public ResponseEntity<Map<String, Object>> getReviewCountForEvent(@PathVariable Long eventId) {
        Long count = reviewService.getReviewCountForEvent(eventId);

        Map<String, Object> response = new HashMap<>();
        response.put("eventId", eventId);
        response.put("reviewCount", count);

        return ResponseEntity.ok(response);
    }

    // Получить отзывы с сортировкой по дате
    @GetMapping("/event/{eventId}/sorted/date")
    public List<Review> getReviewsSortedByDate(@PathVariable Long eventId,
                                               @RequestParam(defaultValue = "desc") String order) {
        boolean ascending = "asc".equalsIgnoreCase(order);
        return reviewService.getReviewsSortedByDate(eventId, ascending);
    }

    // Получить отзывы с сортировкой по рейтингу
    @GetMapping("/event/{eventId}/sorted/rating")
    public List<Review> getReviewsSortedByRating(@PathVariable Long eventId,
                                                 @RequestParam(defaultValue = "desc") String order) {
        boolean ascending = "asc".equalsIgnoreCase(order);
        return reviewService.getReviewsSortedByRating(eventId, ascending);
    }
}