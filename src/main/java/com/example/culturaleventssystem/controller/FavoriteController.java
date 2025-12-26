package com.example.culturaleventssystem.controller;

import com.example.culturaleventssystem.entity.Favorite;
import com.example.culturaleventssystem.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    // Добавить мероприятие в избранное
    @PostMapping
    public ResponseEntity<?> addToFavorites(@RequestBody Favorite favorite) {
        try {
            Favorite addedFavorite = favoriteService.addToFavorites(favorite);
            return ResponseEntity.ok(addedFavorite);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Удалить мероприятие из избранного
    @DeleteMapping("/user/{userId}/event/{eventId}")
    public ResponseEntity<?> removeFromFavorites(@PathVariable Long userId, @PathVariable Long eventId) {
        try {
            favoriteService.removeFromFavorites(userId, eventId);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Event removed from favorites");

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Получить избранные мероприятия пользователя
    @GetMapping("/user/{userId}")
    public List<Favorite> getUserFavorites(@PathVariable Long userId) {
        return favoriteService.getUserFavorites(userId);
    }

    // Получение всех избранных
    @GetMapping
    public List<Favorite> getAllFavorites() {
        return favoriteService.getAllFavorites();
    }

    // Проверить, есть ли мероприятие в избранном у пользователя
    @GetMapping("/user/{userId}/event/{eventId}/check")
    public ResponseEntity<Map<String, Object>> isEventInFavorites(@PathVariable Long userId, @PathVariable Long eventId) {
        boolean isFavorite = favoriteService.isEventInFavorites(userId, eventId);

        Map<String, Object> response = new HashMap<>();
        response.put("userId", userId);
        response.put("eventId", eventId);
        response.put("isFavorite", isFavorite);

        return ResponseEntity.ok(response);
    }

    // Получить количество избранных мероприятий у пользователя
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Map<String, Object>> getUserFavoriteCount(@PathVariable Long userId) {
        Long count = favoriteService.getUserFavoriteCount(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("userId", userId);
        response.put("favoriteCount", count);

        return ResponseEntity.ok(response);
    }
}