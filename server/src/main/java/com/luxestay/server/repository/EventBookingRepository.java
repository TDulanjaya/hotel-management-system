package com.luxestay.server.repository;

import com.luxestay.server.model.EventBooking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventBookingRepository extends MongoRepository<EventBooking, String> {
}
