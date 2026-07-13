package com.luxestay.server.repository;

import com.luxestay.server.model.RestaurantOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantOrderRepository extends MongoRepository<RestaurantOrder, String> {
}
