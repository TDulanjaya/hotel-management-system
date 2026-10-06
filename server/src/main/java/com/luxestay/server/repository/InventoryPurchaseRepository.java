package com.luxestay.server.repository;

import com.luxestay.server.model.InventoryPurchase;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryPurchaseRepository extends MongoRepository<InventoryPurchase, String> {
    List<InventoryPurchase> findByInventoryItemIdOrderByPurchasedAtDesc(String inventoryItemId);
    List<InventoryPurchase> findAllByOrderByPurchasedAtDesc();
}
