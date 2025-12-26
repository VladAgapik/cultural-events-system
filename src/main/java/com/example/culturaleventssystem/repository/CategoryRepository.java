package com.example.culturaleventssystem.repository;

import com.example.culturaleventssystem.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Найти категорию по названию
    Optional<Category> findByName(String name);

    // Проверить существование категории по названию
    boolean existsByName(String name);
}