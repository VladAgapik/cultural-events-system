package com.example.culturaleventssystem.controller;

import com.example.culturaleventssystem.entity.User;
import com.example.culturaleventssystem.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Регистрация пользователя
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> credentials) {
        try {
            String username = credentials.get("username");
            String email = credentials.get("email");
            String password = credentials.get("password");

            if (username == null || email == null || password == null) {
                return ResponseEntity.badRequest().body("Username, email and password are required");
            }

            User user = authService.registerUser(username, email, password);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("user", user);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Аутентификация пользователя
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");

            if (email == null || password == null) {
                return ResponseEntity.badRequest().body("Email and password are required");
            }

            Optional<User> user = authService.loginUser(email, password);

            if (user.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Login successful");
                response.put("user", user.get());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body("Invalid email or password");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Проверка прав администратора
    @PostMapping("/check-admin")
    public ResponseEntity<?> checkAdmin(@RequestBody User user) {
        boolean isAdmin = authService.isAdmin(user);

        Map<String, Object> response = new HashMap<>();
        response.put("isAdmin", isAdmin);

        return ResponseEntity.ok(response);
    }
}