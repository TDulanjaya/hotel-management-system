package com.luxestay.server.repository;

import com.luxestay.server.model.PricingItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PricingItemRepository extends MongoRepository<PricingItem, String> {
    List<PricingItem> findByCategoryIgnoreCase(String category);
}
