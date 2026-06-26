package com.luxestay.backend.repository;

import com.luxestay.backend.model.RestaurantOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantOrderRepository extends MongoRepository<RestaurantOrder, String> {
}
