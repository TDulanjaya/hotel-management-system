package com.luxestay.server.service;

import com.luxestay.server.model.Parking;
import com.luxestay.server.repository.ParkingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParkingService {

    private final ParkingRepository parkingRepository;

    public ParkingService(ParkingRepository parkingRepository) {
        this.parkingRepository = parkingRepository;
    }

    public List<Parking> getAllParking() {
        return parkingRepository.findAll();
    }

    public Parking getParkingById(String id) {
        return parkingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking record not found"));
    }

    public Parking createParking(Parking parking) {
        if (parking.getSlotNumber() == null || parking.getSlotNumber().isBlank()) {
            throw new RuntimeException("Slot number is required");
        }

        if (parkingRepository.existsBySlotNumber(parking.getSlotNumber())) {
            throw new RuntimeException("Parking slot already exists");
        }

        if (parking.getStatus() == null || parking.getStatus().isBlank()) {
            parking.setStatus("Available");
        }

        return parkingRepository.save(parking);
    }

    public Parking updateParking(String id, Parking request) {
        Parking existing = getParkingById(id);

        existing.setSlotNumber(request.getSlotNumber());
        existing.setVehicleNumber(request.getVehicleNumber());
        existing.setGuestName(request.getGuestName());
        existing.setVehicleType(request.getVehicleType());
        existing.setLocation(request.getLocation());
        existing.setStatus(request.getStatus());
        existing.setNotes(request.getNotes());

        return parkingRepository.save(existing);
    }

    public void deleteParking(String id) {
        Parking existing = getParkingById(id);
        parkingRepository.delete(existing);
    }
}