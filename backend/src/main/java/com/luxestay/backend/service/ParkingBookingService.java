package com.luxestay.backend.service;

import com.luxestay.backend.dto.ParkingBookingRequest;
import com.luxestay.backend.model.ParkingBooking;
import com.luxestay.backend.repository.ParkingBookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParkingBookingService {
    private final ParkingBookingRepository parkingBookingRepository;

    public ParkingBookingService(ParkingBookingRepository parkingBookingRepository) {
        this.parkingBookingRepository = parkingBookingRepository;
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
        return parkingBookingRepository.save(booking);
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
        return parkingBookingRepository.save(booking);
    }

    public void deleteBooking(String id) {
        parkingBookingRepository.deleteById(id);
    }
}
