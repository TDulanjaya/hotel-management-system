package com.luxestay.server.repository;

import com.luxestay.server.model.ParkingBooking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParkingBookingRepository extends MongoRepository<ParkingBooking, String> {
}
