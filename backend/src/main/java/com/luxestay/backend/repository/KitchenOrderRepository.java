package com.luxestay.backend.repository;

import com.luxestay.backend.model.KitchenOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KitchenOrderRepository extends MongoRepository<KitchenOrder, String> {
}
