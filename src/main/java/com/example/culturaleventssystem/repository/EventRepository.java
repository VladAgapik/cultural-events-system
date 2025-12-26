package com.example.culturaleventssystem.repository;

import com.example.culturaleventssystem.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Найти мероприятия по категории
    List<Event> findByCategoryId(Long categoryId);

    // Найти мероприятия по дате
    List<Event> findByDate(LocalDate date);

    // Найти мероприятия после указанной даты (будущие)
    List<Event> findByDateAfter(LocalDate date);

    // Найти мероприятия до указанной даты (прошедшие)
    List<Event> findByDateBefore(LocalDate date);

    // Найти мероприятия по локации
    List<Event> findByLocationContainingIgnoreCase(String location);

    // Найти мероприятия по организатору
    List<Event> findByOrganizerContainingIgnoreCase(String organizer);

    // Поиск мероприятий по названию (без учета регистра)
    List<Event> findByTitleContainingIgnoreCase(String title);

    // Получить мероприятия с пагинацией и сортировкой по дате
    List<Event> findAllByOrderByDateAsc();
    List<Event> findAllByOrderByDateDesc();

    // Поиск по нескольким критериям
    @Query("SELECT e FROM Event e WHERE " +
            "(:title IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
            "(:categoryId IS NULL OR e.category.id = :categoryId) AND " +
            "(:date IS NULL OR e.date = :date) AND " +
            "(:location IS NULL OR LOWER(e.location) LIKE LOWER(CONCAT('%', :location, '%')))")
    List<Event> findByFilters(@Param("title") String title,
                              @Param("categoryId") Long categoryId,
                              @Param("date") LocalDate date,
                              @Param("location") String location);
}