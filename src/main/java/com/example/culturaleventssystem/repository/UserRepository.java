package com.example.culturaleventssystem.repository;

import com.example.culturaleventssystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Найти пользователя по email
    Optional<User> findByEmail(String email);

    // Найти пользователя по username
    Optional<User> findByUsername(String username);

    // Проверить существование пользователя по email
    boolean existsByEmail(String email);

    // Проверить существование пользователя по username
    boolean existsByUsername(String username);

    // Найти пользователя по email и паролю (для авторизации)
    Optional<User> findByEmailAndPassword(String email, String password);
}