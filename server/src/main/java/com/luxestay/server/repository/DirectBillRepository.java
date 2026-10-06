package com.luxestay.server.repository;

import com.luxestay.server.model.DirectBill;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface DirectBillRepository extends MongoRepository<DirectBill, String> {
    Optional<DirectBill> findBySourceTypeAndSourceId(String sourceType, String sourceId);
}
