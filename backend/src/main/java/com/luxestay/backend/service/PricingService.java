package com.luxestay.backend.service;

import com.luxestay.backend.dto.PricingItemRequest;
import com.luxestay.backend.model.PricingItem;
import com.luxestay.backend.repository.PricingItemRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PricingService {

    private final PricingItemRepository pricingItemRepository;

    public PricingService(PricingItemRepository pricingItemRepository) {
        this.pricingItemRepository = pricingItemRepository;
    }

    @PostConstruct
    public void seedData() {
        if (pricingItemRepository.count() == 0) {
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

            pricingItemRepository.save(roomPrice);
            pricingItemRepository.save(parkingPrice);
        }
    }

    public List<PricingItem> getAllPricingItems() {
        return pricingItemRepository.findAll();
    }

    public PricingItem getPricingItemById(String id) {
        return pricingItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pricing item not found with id: " + id));
    }

    public List<PricingItem> getPricingItemsByCategory(String category) {
        return pricingItemRepository.findByCategoryIgnoreCase(category);
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

        return pricingItemRepository.save(item);
    }

    public PricingItem updatePricingItem(String id, PricingItemRequest request) {
        PricingItem existingItem = getPricingItemById(id);

        existingItem.setName(request.getName());
        existingItem.setCategory(request.getCategory());
        existingItem.setDescription(request.getDescription());
        existingItem.setPriceType(request.getPriceType());
        existingItem.setPrice(request.getPrice());
        existingItem.setStatus(request.getStatus());

        return pricingItemRepository.save(existingItem);
    }

    public void deletePricingItem(String id) {
        if (!pricingItemRepository.existsById(id)) {
            throw new RuntimeException("Pricing item not found with id: " + id);
        }
        pricingItemRepository.deleteById(id);
    }
}