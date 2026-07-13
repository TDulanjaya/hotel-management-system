package com.luxestay.server.repository;

import com.luxestay.server.model.KitchenOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KitchenOrderRepository extends MongoRepository<KitchenOrder, String> {
}
