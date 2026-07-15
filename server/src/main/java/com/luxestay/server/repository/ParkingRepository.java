package com.luxestay.server.repository;

import com.luxestay.server.model.Parking;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ParkingRepository extends MongoRepository<Parking, String> {
    boolean existsBySlotNumber(String slotNumber);
}