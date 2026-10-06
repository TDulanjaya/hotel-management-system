package com.luxestay.server.repository;

import com.luxestay.server.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    List<Payment> findByReferenceTypeAndReferenceId(String referenceType, String referenceId);
}
