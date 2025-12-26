package com.example.culturaleventssystem.service;

import com.example.culturaleventssystem.entity.Event;
import com.example.culturaleventssystem.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    // Создать мероприятие
    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    // Получить все мероприятия
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // Найти мероприятие по ID
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    // Обновить мероприятие
    public Event updateEvent(Long id, Event eventDetails) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setCategory(eventDetails.getCategory());
        event.setDate(eventDetails.getDate());
        event.setLocation(eventDetails.getLocation());
        event.setOrganizer(eventDetails.getOrganizer());
        event.setImageUrl(eventDetails.getImageUrl());

        return eventRepository.save(event);
    }

    // Удалить мероприятие
    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        eventRepository.delete(event);
    }

    // Получить мероприятия по категории
    public List<Event> getEventsByCategory(Long categoryId) {
        return eventRepository.findByCategoryId(categoryId);
    }

    // Получить мероприятия по дате
    public List<Event> getEventsByDate(LocalDate date) {
        return eventRepository.findByDate(date);
    }

    // Получить будущие мероприятия
    public List<Event> getUpcomingEvents() {
        return eventRepository.findByDateAfter(LocalDate.now());
    }

    // Получить прошедшие мероприятия
    public List<Event> getPastEvents() {
        return eventRepository.findByDateBefore(LocalDate.now());
    }

    // Поиск мероприятий по названию
    public List<Event> searchEventsByTitle(String title) {
        return eventRepository.findByTitleContainingIgnoreCase(title);
    }

    // Поиск мероприятий по локации
    public List<Event> searchEventsByLocation(String location) {
        return eventRepository.findByLocationContainingIgnoreCase(location);
    }

    // Расширенный поиск с фильтрами
    public List<Event> searchEventsWithFilters(String title, Long categoryId, LocalDate date, String location) {
        return eventRepository.findByFilters(title, categoryId, date, location);
    }

    // Получить мероприятия с сортировкой по дате
    public List<Event> getEventsSortedByDateAsc() {
        return eventRepository.findAllByOrderByDateAsc();
    }

    public List<Event> getEventsSortedByDateDesc() {
        return eventRepository.findAllByOrderByDateDesc();
    }

    // Получить количество мероприятий
    public long getEventCount() {
        return eventRepository.count();
    }
}