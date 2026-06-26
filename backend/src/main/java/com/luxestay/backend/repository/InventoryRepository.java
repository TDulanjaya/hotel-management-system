package com.luxestay.backend.repository;

import com.luxestay.backend.model.InventoryItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryRepository extends MongoRepository<InventoryItem, String> {
}
