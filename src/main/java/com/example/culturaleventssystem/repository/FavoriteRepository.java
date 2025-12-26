package com.example.culturaleventssystem.repository;

import com.example.culturaleventssystem.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    // Найти все избранные мероприятия пользователя
    List<Favorite> findByUserId(Long userId);

    // Проверить, есть ли мероприятие в избранном у пользователя
    boolean existsByUserIdAndEventId(Long userId, Long eventId);

    // Найти конкретную запись избранного
    Optional<Favorite> findByUserIdAndEventId(Long userId, Long eventId);

    // Удалить из избранного
    void deleteByUserIdAndEventId(Long userId, Long eventId);

    // Количество избранных мероприятий у пользователя
    Long countByUserId(Long userId);
}