package com.luxestay.backend.service;

import com.luxestay.backend.dto.EventRequest;
import com.luxestay.backend.model.EventBooking;
import com.luxestay.backend.repository.EventBookingRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EventService {

    private final EventBookingRepository eventRepository;

    public EventService(EventBookingRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @PostConstruct
    public void seedData() {
        if (eventRepository.count() == 0) {
            EventBooking sampleEvent = EventBooking.builder()
                    .id("EV-1001")
                    .eventName("Wedding Reception")
                    .eventType("Wedding")
                    .guestCount(150)
                    .primaryDate("2026-06-25")
                    .startTime("18:00")
                    .organizerName("Daniel Smith")
                    .phone("+94 77 123 4567")
                    .email("daniel@example.com")
                    .kitchenNote("Vegetarian menu required")
                    .specialNote("Need flower decoration")
                    .status("Confirmed")
                    .selectedVenue(null)
                    .selectedPackages(new ArrayList<>())
                    .venueTotal(2500.00)
                    .packageTotal(1500.00)
                    .serviceCharge(400.00)
                    .grandTotal(4400.00)
                    .createdAt(System.currentTimeMillis())
                    .build();

            eventRepository.save(sampleEvent);
        }
    }

    public List<EventBooking> getAllEvents() {
        return eventRepository.findAll();
    }

    public EventBooking getEventById(String id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
    }

    public EventBooking createEvent(EventRequest request) {
        String id = "EV-" + System.currentTimeMillis();

        EventBooking event = EventBooking.builder()
                .id(id)
                .eventName(request.getEventName())
                .eventType(request.getEventType())
                .guestCount(request.getGuestCount())
                .primaryDate(request.getPrimaryDate())
                .startTime(request.getStartTime())
                .organizerName(request.getOrganizerName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .kitchenNote(request.getKitchenNote())
                .specialNote(request.getSpecialNote())
                .status(request.getStatus() != null ? request.getStatus() : "Pending")
                .selectedVenue(request.getSelectedVenue())
                .selectedPackages(request.getSelectedPackages())
                .venueTotal(request.getVenueTotal())
                .packageTotal(request.getPackageTotal())
                .serviceCharge(request.getServiceCharge())
                .grandTotal(request.getGrandTotal())
                .createdAt(System.currentTimeMillis())
                .build();

        return eventRepository.save(event);
    }

    public EventBooking updateEvent(String id, EventRequest request) {
        EventBooking existingEvent = getEventById(id);

        existingEvent.setEventName(request.getEventName());
        existingEvent.setEventType(request.getEventType());
        existingEvent.setGuestCount(request.getGuestCount());
        existingEvent.setPrimaryDate(request.getPrimaryDate());
        existingEvent.setStartTime(request.getStartTime());
        existingEvent.setOrganizerName(request.getOrganizerName());
        existingEvent.setPhone(request.getPhone());
        existingEvent.setEmail(request.getEmail());
        existingEvent.setKitchenNote(request.getKitchenNote());
        existingEvent.setSpecialNote(request.getSpecialNote());
        existingEvent.setStatus(request.getStatus());
        existingEvent.setSelectedVenue(request.getSelectedVenue());
        existingEvent.setSelectedPackages(request.getSelectedPackages());
        existingEvent.setVenueTotal(request.getVenueTotal());
        existingEvent.setPackageTotal(request.getPackageTotal());
        existingEvent.setServiceCharge(request.getServiceCharge());
        existingEvent.setGrandTotal(request.getGrandTotal());

        return eventRepository.save(existingEvent);
    }

    public void deleteEvent(String id) {
        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Event not found with id: " + id);
        }
        eventRepository.deleteById(id);
    }
}