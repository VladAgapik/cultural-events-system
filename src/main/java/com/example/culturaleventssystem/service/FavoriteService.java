package com.example.culturaleventssystem.service;

import com.example.culturaleventssystem.entity.Favorite;
import com.example.culturaleventssystem.repository.FavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    // Добавить в избранное
    public Favorite addToFavorites(Favorite favorite) {
        // Проверяем, не добавлено ли уже в избранное
        if (favoriteRepository.existsByUserIdAndEventId(
                favorite.getUser().getId(), favorite.getEvent().getId())) {
            throw new RuntimeException("Event is already in favorites");
        }
        return favoriteRepository.save(favorite);
    }

    // Удалить из избранного
    public void removeFromFavorites(Long userId, Long eventId) {
        Favorite favorite = favoriteRepository.findByUserIdAndEventId(userId, eventId)
                .orElseThrow(() -> new RuntimeException("Favorite not found"));
        favoriteRepository.delete(favorite);
    }

    // Получить все избранные мероприятия пользователя
    public List<Favorite> getUserFavorites(Long userId) {
        return favoriteRepository.findByUserId(userId);
    }

    // Проверить, есть ли мероприятие в избранном у пользователя
    public boolean isEventInFavorites(Long userId, Long eventId) {
        return favoriteRepository.existsByUserIdAndEventId(userId, eventId);
    }

    // Получить количество избранных мероприятий у пользователя
    public Long getUserFavoriteCount(Long userId) {
        return favoriteRepository.countByUserId(userId);
    }

    // Найти запись избранного
    public Optional<Favorite> getFavoriteByUserAndEvent(Long userId, Long eventId) {
        return favoriteRepository.findByUserIdAndEventId(userId, eventId);
    }

    // Получить все избранные
    public List<Favorite> getAllFavorites() {
        return favoriteRepository.findAll();
    }
}