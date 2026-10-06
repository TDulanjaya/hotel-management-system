package com.luxestay.server.repository;

import com.luxestay.server.model.EventBill;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface EventBillRepository extends MongoRepository<EventBill, String> {
    Optional<EventBill> findByEventId(String eventId);
}
