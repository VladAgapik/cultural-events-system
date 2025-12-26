package com.example.culturaleventssystem.controller;

import com.example.culturaleventssystem.entity.Event;
import com.example.culturaleventssystem.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    // Получить все мероприятия
    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    // Получить мероприятие по ID
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Optional<Event> event = eventService.getEventById(id);
        return event.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Создать новое мероприятие
    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        try {
            Event createdEvent = eventService.createEvent(event);
            return ResponseEntity.ok(createdEvent);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Обновить мероприятие
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        try {
            Event updatedEvent = eventService.updateEvent(id, eventDetails);
            return ResponseEntity.ok(updatedEvent);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Удалить мероприятие
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Получить мероприятия по категории
    @GetMapping("/category/{categoryId}")
    public List<Event> getEventsByCategory(@PathVariable Long categoryId) {
        return eventService.getEventsByCategory(categoryId);
    }

    // Получить мероприятия по дате
    @GetMapping("/date/{date}")
    public List<Event> getEventsByDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return eventService.getEventsByDate(date);
    }

    // Получить будущие мероприятия
    @GetMapping("/upcoming")
    public List<Event> getUpcomingEvents() {
        return eventService.getUpcomingEvents();
    }

    // Получить прошедшие мероприятия
    @GetMapping("/past")
    public List<Event> getPastEvents() {
        return eventService.getPastEvents();
    }

    // Поиск мероприятий по названию
    @GetMapping("/search/title")
    public List<Event> searchEventsByTitle(@RequestParam String title) {
        return eventService.searchEventsByTitle(title);
    }

    // Поиск мероприятий по локации
    @GetMapping("/search/location")
    public List<Event> searchEventsByLocation(@RequestParam String location) {
        return eventService.searchEventsByLocation(location);
    }

    // Расширенный поиск с фильтрами
    @GetMapping("/search/filter")
    public List<Event> searchEventsWithFilters(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String location) {
        return eventService.searchEventsWithFilters(title, categoryId, date, location);
    }

    // Получить мероприятия с сортировкой по дате
    @GetMapping("/sorted/date-asc")
    public List<Event> getEventsSortedByDateAsc() {
        return eventService.getEventsSortedByDateAsc();
    }

    @GetMapping("/sorted/date-desc")
    public List<Event> getEventsSortedByDateDesc() {
        return eventService.getEventsSortedByDateDesc();
    }

    // Получить количество мероприятий
    @GetMapping("/count")
    public long getEventCount() {
        return eventService.getEventCount();
    }
}