package com.luxestay.server.service;

import com.luxestay.server.dto.ParkingBookingRequest;
import com.luxestay.server.exception.ResourceNotFoundException;
import com.luxestay.server.model.ParkingBooking;
import com.luxestay.server.model.PricingItem;
import com.luxestay.server.repository.ParkingBookingRepository;
import com.luxestay.server.repository.PricingItemRepository;
import com.luxestay.server.repository.ReservationRepository;
import com.luxestay.server.repository.EventBookingRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.Locale;

@Service
public class ParkingBookingService {
    private final ParkingBookingRepository parkingBookingRepository;
    private final PricingItemRepository pricingItemRepository;
    private final ReservationRepository reservationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final OrderBillingService billingService;
    private final DirectBillService directBillService;
    private final EventBookingRepository eventBookingRepository;

    public ParkingBookingService(ParkingBookingRepository parkingBookingRepository,
                                  PricingItemRepository pricingItemRepository,
                                  ReservationRepository reservationRepository,
                                  SimpMessagingTemplate messagingTemplate,
                                  OrderBillingService billingService,
                                  DirectBillService directBillService,
                                  EventBookingRepository eventBookingRepository) {
        this.parkingBookingRepository = parkingBookingRepository;
        this.pricingItemRepository = pricingItemRepository;
        this.reservationRepository = reservationRepository;
        this.messagingTemplate = messagingTemplate;
        this.billingService = billingService;
        this.directBillService = directBillService;
        this.eventBookingRepository = eventBookingRepository;
    }

    public List<ParkingBooking> getAllBookings() {
        return parkingBookingRepository.findAll();
    }

    public ParkingBooking getBookingById(String id) {
        return parkingBookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking booking not found: " + id));
    }

    private PricingItem resolvePricingItem(String pricingItemId) {
        if (pricingItemId == null || pricingItemId.isBlank()) {
            throw new IllegalArgumentException("pricingItemId is required — select a parking rate from Service Pricing.");
        }
        PricingItem item = pricingItemRepository.findById(pricingItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Pricing item not found: " + pricingItemId));
        if ("Inactive".equalsIgnoreCase(item.getStatus())) {
            throw new IllegalArgumentException("\"" + item.getName() + "\" is marked Inactive in Service Pricing.");
        }
        if (!"PARKING".equalsIgnoreCase(item.getCategory())) {
            throw new IllegalArgumentException("Selected pricing item is not a parking rate.");
        }
        return item;
    }

    private String customerType(ParkingBookingRequest request) {
        if (request.getCustomerType() != null && !request.getCustomerType().isBlank()) {
            return request.getCustomerType();
        }
        String serviceType = request.getServiceType() == null ? "" : request.getServiceType().toLowerCase(Locale.ROOT);
        if (serviceType.contains("event")) return "EVENT_GUEST";
        if (serviceType.contains("game")) return "GAME_VISITOR";
        if (serviceType.contains("walk")) return "WALK_IN";
        return "HOTEL_GUEST";
    }

    private String billingType(ParkingBookingRequest request, String customerType) {
        if (request.getBillingType() != null && !request.getBillingType().isBlank()) {
            return request.getBillingType();
        }
        return switch (customerType) {
            case "HOTEL_GUEST" -> "ROOM_FOLIO";
            case "EVENT_GUEST" -> "EVENT_MASTER_BILL";
            case "CORPORATE_ACCOUNT" -> "CORPORATE_ACCOUNT";
            default -> "DIRECT_PAYMENT";
        };
    }

    private long billableMinutes(ParkingBookingRequest request) {
        if (request.getCheckInTime() == null || request.getCheckInTime().isBlank()) {
            return 60;
        }
        try {
            LocalDateTime start = LocalDateTime.parse(request.getCheckInTime());
            LocalDateTime end = request.getExpectedCheckOutTime() == null
                    || request.getExpectedCheckOutTime().isBlank()
                    ? LocalDateTime.now()
                    : LocalDateTime.parse(request.getExpectedCheckOutTime());
            long minutes = Duration.between(start, end).toMinutes();
            if (minutes <= 0) {
                throw new IllegalArgumentException("Parking exit time must be after entry time.");
            }
            return minutes;
        } catch (DateTimeParseException ex) {
            throw new IllegalArgumentException("Parking times must use ISO local date-time format.");
        }
    }

    private double calculateAmount(PricingItem item, ParkingBookingRequest request, long durationMinutes) {
        if (item.getPrice() == null || item.getPrice() < 0) {
            throw new IllegalArgumentException("Parking pricing must have a valid non-negative rate.");
        }
        if (item.getVehicleType() != null && request.getVehicleType() != null
                && !item.getVehicleType().equalsIgnoreCase(request.getVehicleType())) {
            throw new IllegalArgumentException("The selected parking rate is for vehicle type "
                    + item.getVehicleType() + ".");
        }
        long grace = item.getGracePeriodMinutes() == null ? 0 : item.getGracePeriodMinutes();
        long chargeableMinutes = Math.max(0, durationMinutes - grace);
        int minimumHours = item.getMinimumBillableHours() == null ? 1 : Math.max(1, item.getMinimumBillableHours());
        double amount;
        if ("PER_DAY".equalsIgnoreCase(item.getPriceType())) {
            long days = Math.max(1, (long) Math.ceil(chargeableMinutes / 1440.0));
            amount = days * item.getPrice();
        } else {
            long hours = Math.max(minimumHours, (long) Math.ceil(chargeableMinutes / 60.0));
            amount = hours * item.getPrice();
        }
        if (item.getDailyMaximum() != null && item.getDailyMaximum() > 0) {
            amount = Math.min(amount, item.getDailyMaximum());
        }
        return amount;
    }

    private void validateBilling(ParkingBookingRequest request, PricingItem item,
                                 String customerType, String billingType) {
        if (request.getVehicleNumber() == null || request.getVehicleNumber().isBlank()) {
            throw new IllegalArgumentException("Vehicle number is required.");
        }
        if (request.getSlotNumber() == null || request.getSlotNumber().isBlank()) {
            throw new IllegalArgumentException("Parking slot is required.");
        }
        if (!List.of("HOTEL_GUEST", "EVENT_GUEST", "GAME_VISITOR", "WALK_IN", "CORPORATE_ACCOUNT")
                .contains(customerType.toUpperCase(Locale.ROOT))) {
            throw new IllegalArgumentException("Unsupported parking customer type.");
        }
        if (!List.of("ROOM_FOLIO", "EVENT_MASTER_BILL", "DIRECT_PAYMENT", "CORPORATE_ACCOUNT")
                .contains(billingType.toUpperCase(Locale.ROOT))) {
            throw new IllegalArgumentException("Unsupported parking billing destination.");
        }
        if ("EVENT_MASTER_BILL".equalsIgnoreCase(billingType)
                && request.getEventId() != null && !request.getEventId().isBlank()
                && eventBookingRepository.findById(request.getEventId()).isEmpty()) {
            throw new ResourceNotFoundException("Event not found: " + request.getEventId());
        }
        List<String> allowedCustomers = item.getAllowedCustomerTypes() == null
                ? List.of() : item.getAllowedCustomerTypes();
        List<String> allowedBillingTypes = item.getAllowedBillingTypes() == null
                ? List.of() : item.getAllowedBillingTypes();
        if (!allowedCustomers.isEmpty()
                && allowedCustomers.stream().noneMatch(customerType::equalsIgnoreCase)) {
            throw new IllegalArgumentException("This parking rate is not available for " + customerType + ".");
        }
        if (!allowedBillingTypes.isEmpty()
                && allowedBillingTypes.stream().noneMatch(billingType::equalsIgnoreCase)) {
            throw new IllegalArgumentException("This parking rate cannot be posted to " + billingType + ".");
        }
        if ("ROOM_FOLIO".equalsIgnoreCase(billingType)) {
            if (!"HOTEL_GUEST".equalsIgnoreCase(customerType) || request.getRoomNumber() == null
                    || request.getRoomNumber().isBlank()) {
                throw new IllegalArgumentException("Room folio parking requires a verified hotel guest and room.");
            }
            boolean activeStay = reservationRepository.findAllByStatusIgnoreCase("CHECKED_IN").stream()
                    .anyMatch(reservation -> request.getRoomNumber().equalsIgnoreCase(reservation.getRoomNumber())
                            && (request.getReservationId() == null || request.getReservationId().isBlank()
                            || request.getReservationId().equals(reservation.getId())));
            if (!activeStay) {
                throw new IllegalArgumentException("No active checked-in reservation was found for the selected room.");
            }
            if (request.getReservationId() == null || request.getReservationId().isBlank()) {
                reservationRepository.findAllByStatusIgnoreCase("CHECKED_IN").stream()
                        .filter(reservation -> request.getRoomNumber().equalsIgnoreCase(reservation.getRoomNumber()))
                        .findFirst().ifPresent(reservation -> request.setReservationId(reservation.getId()));
            }
        }
        if ("EVENT_MASTER_BILL".equalsIgnoreCase(billingType)
                && (request.getEventId() == null || request.getEventId().isBlank())) {
            throw new IllegalArgumentException("Event billing requires an event ID.");
        }
    }

    public ParkingBooking createBooking(ParkingBookingRequest request) {
        PricingItem item = resolvePricingItem(request.getPricingItemId());
        String customerType = customerType(request);
        String billingType = billingType(request, customerType);
        long durationMinutes = billableMinutes(request);
        validateBilling(request, item, customerType, billingType);
        double amount = calculateAmount(item, request, durationMinutes);

        ParkingBooking booking = ParkingBooking.builder()
                .vehicleNumber(request.getVehicleNumber())
                .vehicleModel(request.getVehicleModel())
                .vehicleType(request.getVehicleType())
                .driverName(request.getDriverName())
                .contactNumber(request.getContactNumber())
                .parkingZone(request.getParkingZone())
                .slotNumber(request.getSlotNumber())
                .serviceType(request.getServiceType())
                .checkInTime(request.getCheckInTime())
                .expectedCheckOutTime(request.getExpectedCheckOutTime())
                .guestName(request.getGuestName())
                .roomNumber(request.getRoomNumber())
                .reservationId(request.getReservationId())
                .eventId(request.getEventId())
                .customerType(customerType)
                .billingType(billingType)
                .pricingItemId(request.getPricingItemId())
                .amount(amount)
                .billableDurationMinutes(durationMinutes)
                .calculationNote("Calculated from " + durationMinutes + " minutes and " + item.getPriceType() + " rate")
                .paymentStatus(request.getPaymentStatus())
                .notes(request.getNotes())
                .status(request.getStatus())
                .createdAt(System.currentTimeMillis())
                .build();
        ParkingBooking saved = parkingBookingRepository.save(booking);
        messagingTemplate.convertAndSend("/topic/parking", "updated");

        if ("ROOM_FOLIO".equalsIgnoreCase(billingType)) {
            billingService.postChargeToFolio(saved.getRoomNumber(), "Parking (" + saved.getVehicleNumber() + ")",
                    "Parking", amount, "PARKING_BOOKING", saved.getId(), saved.getPricingItemId());
        } else if ("EVENT_MASTER_BILL".equalsIgnoreCase(billingType)) {
            billingService.postChargeToEvent(saved.getEventId(), "Parking (" + saved.getVehicleNumber() + ")",
                    "Parking", amount, "PARKING_BOOKING", saved.getId(), saved.getPricingItemId());
        } else if ("DIRECT_PAYMENT".equalsIgnoreCase(billingType)) {
            directBillService.ensureForSource(saved.getCustomerType(), saved.getGuestName(),
                    "PARKING_BOOKING", saved.getId(), "Parking (" + saved.getVehicleNumber() + ")",
                    "Parking", amount);
            saved.setPaymentStatus("AWAITING_PAYMENT");
            saved = parkingBookingRepository.save(saved);
        }

        return saved;
    }

    public ParkingBooking updateBooking(String id, ParkingBookingRequest request) {
        ParkingBooking booking = getBookingById(id);
        String previousBillingType = booking.getBillingType();
        String previousReservationId = booking.getReservationId();
        String previousEventId = booking.getEventId();
        PricingItem item = resolvePricingItem(request.getPricingItemId());
        String customerType = customerType(request);
        String billingType = billingType(request, customerType);
        long durationMinutes = billableMinutes(request);
        validateBilling(request, item, customerType, billingType);
        double amount = calculateAmount(item, request, durationMinutes);

        booking.setVehicleNumber(request.getVehicleNumber());
        booking.setVehicleModel(request.getVehicleModel());
        booking.setVehicleType(request.getVehicleType());
        booking.setDriverName(request.getDriverName());
        booking.setContactNumber(request.getContactNumber());
        booking.setParkingZone(request.getParkingZone());
        booking.setSlotNumber(request.getSlotNumber());
        booking.setServiceType(request.getServiceType());
        booking.setCheckInTime(request.getCheckInTime());
        booking.setExpectedCheckOutTime(request.getExpectedCheckOutTime());
        booking.setGuestName(request.getGuestName());
        booking.setRoomNumber(request.getRoomNumber());
        booking.setReservationId(request.getReservationId());
        booking.setEventId(request.getEventId());
        booking.setCustomerType(customerType);
        booking.setBillingType(billingType);
        booking.setPricingItemId(request.getPricingItemId());
        booking.setAmount(amount);
        booking.setBillableDurationMinutes(durationMinutes);
        booking.setCalculationNote("Calculated from " + durationMinutes + " minutes and " + item.getPriceType() + " rate");
        booking.setPaymentStatus(request.getPaymentStatus());
        booking.setNotes(request.getNotes());
        booking.setStatus(request.getStatus());
        ParkingBooking saved = parkingBookingRepository.save(booking);
        if ("ROOM_FOLIO".equalsIgnoreCase(previousBillingType)) {
            billingService.voidSourceCharge(previousReservationId, id);
        } else if ("EVENT_MASTER_BILL".equalsIgnoreCase(previousBillingType)) {
            billingService.voidEventSource(previousEventId, id);
        } else if ("DIRECT_PAYMENT".equalsIgnoreCase(previousBillingType)) {
            directBillService.voidSource("PARKING_BOOKING", id);
        }
        if ("ROOM_FOLIO".equalsIgnoreCase(billingType)) {
            billingService.postChargeToFolio(saved.getRoomNumber(), "Parking (" + saved.getVehicleNumber() + ")",
                    "Parking", amount, "PARKING_BOOKING", id, saved.getPricingItemId());
        } else if ("EVENT_MASTER_BILL".equalsIgnoreCase(billingType)) {
            billingService.postChargeToEvent(saved.getEventId(), "Parking (" + saved.getVehicleNumber() + ")",
                    "Parking", amount, "PARKING_BOOKING", id, saved.getPricingItemId());
        } else if ("DIRECT_PAYMENT".equalsIgnoreCase(billingType)) {
            directBillService.ensureForSource(saved.getCustomerType(), saved.getGuestName(),
                    "PARKING_BOOKING", id, "Parking (" + saved.getVehicleNumber() + ")",
                    "Parking", amount);
        }
        messagingTemplate.convertAndSend("/topic/parking", "updated");
        return saved;
    }

    public ParkingBooking checkoutFolio(String id) {
        ParkingBooking booking = getBookingById(id);
        if (booking.getRoomNumber() == null || booking.getRoomNumber().isBlank()) {
            throw new IllegalArgumentException("Cannot post to folio: vehicle has no room assigned.");
        }
        booking.setBillingType("ROOM_FOLIO");
        booking.setStatus("CHECKED_OUT");
        booking.setPaymentStatus("FOLIO_POSTED");
        booking.setExpectedCheckOutTime(LocalDateTime.now().toString());
        ParkingBooking saved = parkingBookingRepository.save(booking);
        billingService.postChargeToFolio(saved.getRoomNumber(), "Parking (" + saved.getVehicleNumber() + ")",
                "Parking", saved.getAmount(), "PARKING_BOOKING", saved.getId(), saved.getPricingItemId());
        messagingTemplate.convertAndSend("/topic/parking", "updated");
        return saved;
    }

    public void deleteBooking(String id) {
        ParkingBooking booking = getBookingById(id);
        if ("ROOM_FOLIO".equalsIgnoreCase(booking.getBillingType())) {
            billingService.voidSourceCharge(booking.getReservationId(), id);
        } else if ("EVENT_MASTER_BILL".equalsIgnoreCase(booking.getBillingType())) {
            billingService.voidEventSource(booking.getEventId(), id);
        } else if ("DIRECT_PAYMENT".equalsIgnoreCase(booking.getBillingType())) {
            directBillService.voidSource("PARKING_BOOKING", id);
        }
        parkingBookingRepository.deleteById(id);
        messagingTemplate.convertAndSend("/topic/parking", "updated");
    }
}
