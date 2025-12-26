package com.example.culturaleventssystem.service;

import com.example.culturaleventssystem.entity.Category;
import com.example.culturaleventssystem.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Создать категорию
    public Category createCategory(Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Category with this name already exists");
        }
        return categoryRepository.save(category);
    }

    // Получить все категории
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Найти категорию по ID
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    // Найти категорию по названию
    public Optional<Category> getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }

    // Обновить категорию
    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        // Проверяем уникальность названия
        if (!category.getName().equals(categoryDetails.getName()) &&
                categoryRepository.existsByName(categoryDetails.getName())) {
            throw new RuntimeException("Category with this name already exists");
        }

        category.setName(categoryDetails.getName());
        return categoryRepository.save(category);
    }

    // Удалить категорию
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        categoryRepository.delete(category);
    }

    // Проверить существование категории
    public boolean categoryExistsByName(String name) {
        return categoryRepository.existsByName(name);
    }
}