package com.luxestay.server.service;

import com.luxestay.server.dto.EventOccupancyImpactDto;
import com.luxestay.server.dto.EventRequest;
import com.luxestay.server.model.EventBooking;
import com.luxestay.server.model.Reservation;
import com.luxestay.server.repository.EventBookingRepository;
import com.luxestay.server.repository.ReservationRepository;
import com.luxestay.server.repository.RoomRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EventService {

    private final EventBookingRepository eventRepository;
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;

    public EventService(EventBookingRepository eventRepository,
                        RoomRepository roomRepository,
                        ReservationRepository reservationRepository) {
        this.eventRepository = eventRepository;
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
    }

    public EventOccupancyImpactDto getOccupancyImpact() {
        List<EventBooking> events = eventRepository.findAll();
        long totalRoomsCount = roomRepository.count();
        long monthlyCapacity = totalRoomsCount > 0 ? totalRoomsCount * 30 : 1500;

        List<Reservation> activeReservations = reservationRepository.findAll().stream()
                .filter(r -> r.getStatus() != null && !"CANCELLED".equalsIgnoreCase(r.getStatus()))
                .toList();

        long activeEvents = events.stream()
                .filter(e -> e.getStatus() != null && !"Cancelled".equalsIgnoreCase(e.getStatus()))
                .count();

        long totalGuests = events.stream()
                .filter(e -> e.getStatus() != null && !"Cancelled".equalsIgnoreCase(e.getStatus()))
                .mapToLong(e -> e.getGuestCount() != null ? e.getGuestCount() : 0)
                .sum();

        long reservationRoomNights = activeReservations.size() * 3L;
        long eventRoomNights = Math.round(totalGuests * 0.6);
        long committedRooms = reservationRoomNights + eventRoomNights;

        if (committedRooms > monthlyCapacity) {
            committedRooms = monthlyCapacity;
        }

        double percentage = monthlyCapacity > 0 ? ((double) committedRooms / monthlyCapacity) * 100.0 : 0.0;
        percentage = Math.round(percentage * 10.0) / 10.0;

        String forecastText;
        if (percentage > 0) {
            double forecastDiff = Math.max(1.0, Math.round(percentage * 0.15));
            forecastText = String.format("+%.0f%% from last month's forecast", forecastDiff);
        } else {
            forecastText = "0% from last month's forecast";
        }

        return EventOccupancyImpactDto.builder()
                .committedRooms(committedRooms)
                .totalCapacity(monthlyCapacity)
                .percentage(percentage)
                .forecastText(forecastText)
                .activeEventsCount(activeEvents)
                .totalGuests(totalGuests)
                .build();
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