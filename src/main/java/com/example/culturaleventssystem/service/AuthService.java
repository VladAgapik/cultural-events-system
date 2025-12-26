package com.example.culturaleventssystem.service;

import com.example.culturaleventssystem.entity.User;
import com.example.culturaleventssystem.entity.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserService userService;

    // Регистрация нового пользователя
    public User registerUser(String username, String email, String password) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password); // В будущем добавим шифрование паролей
        user.setRole(UserRole.USER);

        return userService.createUser(user);
    }

    // Регистрация администратора (только для тестирования)
    public User registerAdmin(String username, String email, String password) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(UserRole.ADMIN);

        return userService.createUser(user);
    }

    // Аутентификация пользователя
    public Optional<User> loginUser(String email, String password) {
        return userService.authenticateUser(email, password);
    }

    // Проверка, является ли пользователь администратором
    public boolean isAdmin(User user) {
        return user.getRole() == UserRole.ADMIN;
    }

    // Проверка прав доступа
    public boolean hasAccess(User user, Long targetUserId) {
        return user.getId().equals(targetUserId) || isAdmin(user);
    }
}