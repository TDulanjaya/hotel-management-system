package com.luxestay.backend.service;

import com.luxestay.backend.dto.EventRequest;
import com.luxestay.backend.model.EventBooking;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class EventService {

    private final Map<String, EventBooking> events = new LinkedHashMap<>();

    public EventService() {
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

        events.put(sampleEvent.getId(), sampleEvent);
    }

    public List<EventBooking> getAllEvents() {
        return new ArrayList<>(events.values());
    }

    public EventBooking getEventById(String id) {
        EventBooking event = events.get(id);

        if (event == null) {
            throw new RuntimeException("Event not found with id: " + id);
        }

        return event;
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

        events.put(id, event);
        return event;
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

        events.put(id, existingEvent);
        return existingEvent;
    }

    public void deleteEvent(String id) {
        events.remove(id);
    }
}