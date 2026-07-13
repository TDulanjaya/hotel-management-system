package com.luxestay.server.repository;

import com.luxestay.server.model.SpaBooking;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SpaBookingRepository extends MongoRepository<SpaBooking, String> {
}
