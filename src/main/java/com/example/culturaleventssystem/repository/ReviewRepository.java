package com.example.culturaleventssystem.repository;

import com.example.culturaleventssystem.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Найти все отзывы для мероприятия
    List<Review> findByEventId(Long eventId);

    // Найти все отзывы пользователя
    List<Review> findByUserId(Long userId);

    // Найти конкретный отзыв пользователя для мероприятия
    Optional<Review> findByUserIdAndEventId(Long userId, Long eventId);

    // Получить средний рейтинг мероприятия
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.event.id = :eventId")
    Double findAverageRatingByEventId(@Param("eventId") Long eventId);

    // Получить количество отзывов для мероприятия
    Long countByEventId(Long eventId);

    // Получить отзывы с сортировкой по дате
    List<Review> findByEventIdOrderByCreatedAtDesc(Long eventId);
    List<Review> findByEventIdOrderByCreatedAtAsc(Long eventId);

    // Получить отзывы с сортировкой по рейтингу
    List<Review> findByEventIdOrderByRatingDesc(Long eventId);
    List<Review> findByEventIdOrderByRatingAsc(Long eventId);
}