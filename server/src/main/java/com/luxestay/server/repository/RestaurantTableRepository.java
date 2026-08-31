package com.luxestay.server.repository;

import com.luxestay.server.model.RestaurantTable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RestaurantTableRepository extends MongoRepository<RestaurantTable, String> {
    Optional<RestaurantTable> findByTableNumber(String tableNumber);
    boolean existsByTableNumber(String tableNumber);
}
