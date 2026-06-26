package com.luxestay.backend.repository;

import com.luxestay.backend.model.ParkingBooking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParkingBookingRepository extends MongoRepository<ParkingBooking, String> {
}
