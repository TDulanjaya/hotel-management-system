package com.luxestay.server.repository;

import com.luxestay.server.model.LaundryOrder;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LaundryOrderRepository extends MongoRepository<LaundryOrder, String> {
}
