package com.luxestay.server.service;

import com.luxestay.server.dto.ParkingBookingRequest;
import com.luxestay.server.exception.ResourceNotFoundException;
import com.luxestay.server.model.ParkingBooking;
import com.luxestay.server.model.PricingItem;
import com.luxestay.server.repository.ParkingBookingRepository;
import com.luxestay.server.repository.PricingItemRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParkingBookingService {
    private final ParkingBookingRepository parkingBookingRepository;
    private final PricingItemRepository pricingItemRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final OrderBillingService billingService;

    public ParkingBookingService(ParkingBookingRepository parkingBookingRepository,
                                  PricingItemRepository pricingItemRepository,
                                  SimpMessagingTemplate messagingTemplate,
                                  OrderBillingService billingService) {
        this.parkingBookingRepository = parkingBookingRepository;
        this.pricingItemRepository = pricingItemRepository;
        this.messagingTemplate = messagingTemplate;
        this.billingService = billingService;
    }

    public List<ParkingBooking> getAllBookings() {
        return parkingBookingRepository.findAll();
    }

    public ParkingBooking getBookingById(String id) {
        return parkingBookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking booking not found: " + id));
    }

    private double resolveAmount(String pricingItemId) {
        if (pricingItemId == null || pricingItemId.isBlank()) {
            throw new IllegalArgumentException("pricingItemId is required — select a parking rate from Service Pricing.");
        }
        PricingItem item = pricingItemRepository.findById(pricingItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Pricing item not found: " + pricingItemId));
        if ("Inactive".equalsIgnoreCase(item.getStatus())) {
            throw new IllegalArgumentException("\"" + item.getName() + "\" is marked Inactive in Service Pricing.");
        }
        return item.getPrice() != null ? item.getPrice() : 0.0;
    }

    public ParkingBooking createBooking(ParkingBookingRequest request) {
        double amount = resolveAmount(request.getPricingItemId());

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
                .pricingItemId(request.getPricingItemId())
                .amount(amount)
                .paymentStatus(request.getPaymentStatus())
                .notes(request.getNotes())
                .status(request.getStatus())
                .createdAt(System.currentTimeMillis())
                .build();
        ParkingBooking saved = parkingBookingRepository.save(booking);
        messagingTemplate.convertAndSend("/topic/parking", "updated");

        billingService.postChargeToFolio(saved.getRoomNumber(), "Parking (" + saved.getVehicleNumber() + ")", "Parking", amount);

        return saved;
    }

    public ParkingBooking updateBooking(String id, ParkingBookingRequest request) {
        ParkingBooking booking = getBookingById(id);
        double amount = resolveAmount(request.getPricingItemId());

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
        booking.setPricingItemId(request.getPricingItemId());
        booking.setAmount(amount);
        booking.setPaymentStatus(request.getPaymentStatus());
        booking.setNotes(request.getNotes());
        booking.setStatus(request.getStatus());
        ParkingBooking saved = parkingBookingRepository.save(booking);
        messagingTemplate.convertAndSend("/topic/parking", "updated");
        return saved;
    }

    public void deleteBooking(String id) {
        parkingBookingRepository.deleteById(id);
        messagingTemplate.convertAndSend("/topic/parking", "updated");
    }
}


