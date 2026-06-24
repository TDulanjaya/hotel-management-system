package com.luxestay.backend.service;

import com.luxestay.backend.dto.PricingItemRequest;
import com.luxestay.backend.model.PricingItem;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class PricingService {

    private final Map<String, PricingItem> pricingItems = new LinkedHashMap<>();

    public PricingService() {
        PricingItem roomPrice = PricingItem.builder()
                .id("PR-1001")
                .name("Deluxe Room")
                .category("Room")
                .description("Deluxe room price per night")
                .priceType("Per Night")
                .price(250.00)
                .status("Active")
                .build();

        PricingItem parkingPrice = PricingItem.builder()
                .id("PR-1002")
                .name("Parking")
                .category("Parking")
                .description("Parking price per hour")
                .priceType("Per Hour")
                .price(5.00)
                .status("Active")
                .build();

        pricingItems.put(roomPrice.getId(), roomPrice);
        pricingItems.put(parkingPrice.getId(), parkingPrice);
    }

    public List<PricingItem> getAllPricingItems() {
        return new ArrayList<>(pricingItems.values());
    }

    public PricingItem getPricingItemById(String id) {
        PricingItem item = pricingItems.get(id);

        if (item == null) {
            throw new RuntimeException("Pricing item not found with id: " + id);
        }

        return item;
    }

    public List<PricingItem> getPricingItemsByCategory(String category) {
        return pricingItems.values()
                .stream()
                .filter(item -> item.getCategory() != null && item.getCategory().equalsIgnoreCase(category))
                .toList();
    }

    public PricingItem createPricingItem(PricingItemRequest request) {
        String id = "PR-" + System.currentTimeMillis();

        PricingItem item = PricingItem.builder()
                .id(id)
                .name(request.getName())
                .category(request.getCategory())
                .description(request.getDescription())
                .priceType(request.getPriceType())
                .price(request.getPrice())
                .status(request.getStatus() != null ? request.getStatus() : "Active")
                .build();

        pricingItems.put(id, item);
        return item;
    }

    public PricingItem updatePricingItem(String id, PricingItemRequest request) {
        PricingItem existingItem = getPricingItemById(id);

        existingItem.setName(request.getName());
        existingItem.setCategory(request.getCategory());
        existingItem.setDescription(request.getDescription());
        existingItem.setPriceType(request.getPriceType());
        existingItem.setPrice(request.getPrice());
        existingItem.setStatus(request.getStatus());

        pricingItems.put(id, existingItem);
        return existingItem;
    }

    public void deletePricingItem(String id) {
        pricingItems.remove(id);
    }
}