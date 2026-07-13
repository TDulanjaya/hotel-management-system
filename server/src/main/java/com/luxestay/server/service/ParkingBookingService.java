package com.luxestay.server.service;

import com.luxestay.server.dto.ParkingBookingRequest;
import com.luxestay.server.model.ParkingBooking;
import com.luxestay.server.repository.ParkingBookingRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParkingBookingService {
    private final ParkingBookingRepository parkingBookingRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ParkingBookingService(ParkingBookingRepository parkingBookingRepository, SimpMessagingTemplate messagingTemplate) {
        this.parkingBookingRepository = parkingBookingRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public List<ParkingBooking> getAllBookings() {
        return parkingBookingRepository.findAll();
    }

    public ParkingBooking getBookingById(String id) {
        return parkingBookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Parking booking not found"));
    }

    public ParkingBooking createBooking(ParkingBookingRequest request) {
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
                .amount(request.getAmount())
                .paymentStatus(request.getPaymentStatus())
                .notes(request.getNotes())
                .status(request.getStatus())
                .createdAt(System.currentTimeMillis())
                .build();
        ParkingBooking saved = parkingBookingRepository.save(booking);
        messagingTemplate.convertAndSend("/topic/parking", "updated");
        return saved;
    }

    public ParkingBooking updateBooking(String id, ParkingBookingRequest request) {
        ParkingBooking booking = getBookingById(id);
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
        booking.setAmount(request.getAmount());
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

