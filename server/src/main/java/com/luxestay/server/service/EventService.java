package com.luxestay.server.service;

import com.luxestay.server.dto.EventOccupancyImpactDto;
import com.luxestay.server.dto.EventRequest;
import com.luxestay.server.exception.ResourceNotFoundException;
import com.luxestay.server.model.EventBooking;
import com.luxestay.server.model.EventBill;
import com.luxestay.server.model.FolioLine;
import com.luxestay.server.model.PricingItem;
import com.luxestay.server.model.Reservation;
import com.luxestay.server.model.SelectedPackage;
import com.luxestay.server.model.Venue;
import com.luxestay.server.repository.EventBookingRepository;
import com.luxestay.server.repository.EventBillRepository;
import com.luxestay.server.repository.PricingItemRepository;
import com.luxestay.server.repository.ReservationRepository;
import com.luxestay.server.repository.RoomRepository;
import com.luxestay.server.repository.VenueRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EventService {

    private final EventBookingRepository eventRepository;
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;
    private final VenueRepository venueRepository;
    private final PricingItemRepository pricingItemRepository;
    private final AuditLogService auditLogService;
    private final EventBillRepository eventBillRepository;

    public EventService(EventBookingRepository eventRepository,
                        RoomRepository roomRepository,
                        ReservationRepository reservationRepository,
                        VenueRepository venueRepository,
                        PricingItemRepository pricingItemRepository,
                        AuditLogService auditLogService,
                        EventBillRepository eventBillRepository) {
        this.eventRepository = eventRepository;
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
        this.venueRepository = venueRepository;
        this.pricingItemRepository = pricingItemRepository;
        this.auditLogService = auditLogService;
        this.eventBillRepository = eventBillRepository;
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
        long eventRoomNights = Math.round(totalGuests * 0.15);
        long committedRooms = reservationRoomNights + eventRoomNights;

        double percentage = monthlyCapacity > 0
                ? Math.min(100.0, Math.round(((double) committedRooms / monthlyCapacity) * 1000.0) / 10.0)
                : 0.0;

        String forecastText;
        if (percentage >= 80.0) {
            forecastText = "Critical Peak — banquet guest influx will require housekeeping surge capacity.";
        } else if (percentage >= 50.0) {
            forecastText = "High Demand — banquet dates show significant overlap with room occupancy.";
        } else {
            forecastText = "Optimal capacity available across all room categories.";
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
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
    }

    public EventBooking createEvent(EventRequest request) {
        String venueId = request.getSelectedVenue() != null ? request.getSelectedVenue().getId() : null;
        assertNoVenueOverlap(venueId, request.getPrimaryDate(), null);

        String id = "EV-" + System.currentTimeMillis();

        Venue venue = null;
        double venueTotal = 0.0;
        if (venueId != null && !venueId.isBlank()) {
            venue = venueRepository.findById(venueId)
                    .orElseThrow(() -> new ResourceNotFoundException("Venue not found: " + venueId));
            venueTotal = venue.getPrice() != null ? venue.getPrice() : 0.0;
        }

        List<SelectedPackage> resolvedPackages = new ArrayList<>();
        double packageTotal = 0.0;
        if (request.getSelectedPackages() != null) {
            for (SelectedPackage requested : request.getSelectedPackages()) {
                if (requested.getId() == null || requested.getId().isBlank()) continue;
                PricingItem catalogItem = pricingItemRepository.findById(requested.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Pricing item not found: " + requested.getId()));
                SelectedPackage resolved = SelectedPackage.builder()
                        .id(catalogItem.getId())
                        .name(catalogItem.getName())
                        .category(catalogItem.getCategory())
                        .description(catalogItem.getDescription())
                        .priceType(catalogItem.getPriceType())
                        .price(catalogItem.getPrice() != null ? catalogItem.getPrice() : 0.0)
                        .quantity(requested.getQuantity() == null ? 1 : Math.max(1, requested.getQuantity()))
                        .build();
                        resolvedPackages.add(resolved);
                        packageTotal += (catalogItem.getPrice() != null ? catalogItem.getPrice() : 0.0)
                                * resolved.getQuantity();
            }
        }

        double serviceCharge = Math.round((venueTotal + packageTotal) * 0.10 * 100.0) / 100.0;
        double grandTotal = venueTotal + packageTotal + serviceCharge;

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
                .roomNumber(request.getRoomNumber())
                .reservationId(request.getReservationId())
                .selectedVenue(venue)
                .selectedPackages(resolvedPackages)
                .venueTotal(venueTotal)
                .packageTotal(packageTotal)
                .serviceCharge(serviceCharge)
                .grandTotal(grandTotal)
                .createdAt(System.currentTimeMillis())
                .build();

        EventBooking saved = eventRepository.save(event);
        EventBill bill = new EventBill();
        bill.setEventId(saved.getId());
        bill.setEventName(saved.getEventName());
        addEventLine(bill, "Venue rental", "Venue", venueTotal, "EVENT_VENUE", saved.getId() + ":venue");
        addEventLine(bill, "Event packages", "Catering", packageTotal, "EVENT_PACKAGE", saved.getId() + ":packages");
        addEventLine(bill, "Service charge", "Service Charge", serviceCharge, "EVENT_SERVICE_CHARGE", saved.getId() + ":service");
        bill.setTotalAmount(grandTotal);
        bill.setBalanceAmount(grandTotal);
        eventBillRepository.save(bill);
        auditLogService.log("CREATE", "EVENT", saved.getId(), "Created event booking: " + saved.getEventName());
        return saved;
    }

    private void addEventLine(EventBill bill, String description, String category, double amount,
                              String sourceType, String sourceId) {
        if (amount <= 0) return;
        FolioLine line = new FolioLine();
        line.setDescription(description);
        line.setCategory(category);
        line.setAmount(amount);
        line.setDate(java.time.LocalDate.now().toString());
        line.setSourceType(sourceType);
        line.setSourceId(sourceId);
        line.setStatus("POSTED");
        bill.getLines().add(line);
    }

    public EventBooking updateEvent(String id, EventRequest request) {
        EventBooking existingEvent = getEventById(id);

        String venueId = request.getSelectedVenue() != null ? request.getSelectedVenue().getId() : null;
        assertNoVenueOverlap(venueId, request.getPrimaryDate(), id);

        Venue venue = null;
        double venueTotal = 0.0;
        if (venueId != null && !venueId.isBlank()) {
            venue = venueRepository.findById(venueId)
                    .orElseThrow(() -> new ResourceNotFoundException("Venue not found: " + venueId));
            venueTotal = venue.getPrice() != null ? venue.getPrice() : 0.0;
        }

        List<SelectedPackage> resolvedPackages = new ArrayList<>();
        double packageTotal = 0.0;
        if (request.getSelectedPackages() != null) {
            for (SelectedPackage requested : request.getSelectedPackages()) {
                if (requested.getId() == null || requested.getId().isBlank()) continue;
                PricingItem catalogItem = pricingItemRepository.findById(requested.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Pricing item not found: " + requested.getId()));
                SelectedPackage resolved = SelectedPackage.builder()
                        .id(catalogItem.getId())
                        .name(catalogItem.getName())
                        .category(catalogItem.getCategory())
                        .description(catalogItem.getDescription())
                        .priceType(catalogItem.getPriceType())
                        .price(catalogItem.getPrice() != null ? catalogItem.getPrice() : 0.0)
                        .build();
                resolvedPackages.add(resolved);
                packageTotal += (catalogItem.getPrice() != null ? catalogItem.getPrice() : 0.0);
            }
        }

        double serviceCharge = Math.round((venueTotal + packageTotal) * 0.10 * 100.0) / 100.0;
        double grandTotal = venueTotal + packageTotal + serviceCharge;

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
        existingEvent.setRoomNumber(request.getRoomNumber());
        existingEvent.setReservationId(request.getReservationId());
        existingEvent.setSelectedVenue(venue);
        existingEvent.setSelectedPackages(resolvedPackages);
        existingEvent.setVenueTotal(venueTotal);
        existingEvent.setPackageTotal(packageTotal);
        existingEvent.setServiceCharge(serviceCharge);
        existingEvent.setGrandTotal(grandTotal);

        EventBooking saved = eventRepository.save(existingEvent);
        auditLogService.log("UPDATE", "EVENT", saved.getId(), "Updated event booking: " + saved.getEventName());
        return saved;
    }

    public void deleteEvent(String id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found with id: " + id);
        }
        eventRepository.deleteById(id);
        auditLogService.log("DELETE", "EVENT", id, "Deleted event booking #" + id);
    }

    private void assertNoVenueOverlap(String venueId, String primaryDate, String excludeEventId) {
        if (venueId == null || venueId.isBlank() || primaryDate == null || primaryDate.isBlank()) {
            return;
        }
        boolean conflict = eventRepository.findAll().stream()
                .filter(e -> excludeEventId == null || !e.getId().equals(excludeEventId))
                .filter(e -> e.getStatus() == null || !"Cancelled".equalsIgnoreCase(e.getStatus()))
                .filter(e -> e.getSelectedVenue() != null && venueId.equals(e.getSelectedVenue().getId()))
                .anyMatch(e -> primaryDate.equalsIgnoreCase(e.getPrimaryDate()));

        if (conflict) {
            throw new IllegalStateException("Venue is already booked for another event on " + primaryDate + ".");
        }
    }
}