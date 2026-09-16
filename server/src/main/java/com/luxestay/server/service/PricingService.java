package com.luxestay.server.service;

import com.luxestay.server.dto.PricingItemRequest;
import com.luxestay.server.exception.ResourceNotFoundException;
import com.luxestay.server.model.PricingItem;
import com.luxestay.server.repository.PricingItemRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PricingService {

    private final PricingItemRepository pricingItemRepository;
    private final AuditLogService auditLogService;

    public PricingService(PricingItemRepository pricingItemRepository, AuditLogService auditLogService) {
        this.pricingItemRepository = pricingItemRepository;
        this.auditLogService = auditLogService;
    }

    @Cacheable("pricingItems")
    public List<PricingItem> getAllPricingItems() {
        return pricingItemRepository.findAll();
    }

    @Cacheable(value = "pricingItem", key = "#id")
    public PricingItem getPricingItemById(String id) {
        return pricingItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pricing item not found with id: " + id));
    }

    @Cacheable(value = "pricingCategory", key = "#category")
    public List<PricingItem> getPricingItemsByCategory(String category) {
        return pricingItemRepository.findByCategoryIgnoreCase(category);
    }

    @CacheEvict(value = {"pricingItems", "pricingItem", "pricingCategory"}, allEntries = true)
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

        PricingItem saved = pricingItemRepository.save(item);
        auditLogService.log("CREATE", "PRICING", saved.getId(), "Created pricing item: " + saved.getName());
        return saved;
    }

    @CacheEvict(value = {"pricingItems", "pricingItem", "pricingCategory"}, allEntries = true)
    public PricingItem updatePricingItem(String id, PricingItemRequest request) {
        PricingItem existingItem = getPricingItemById(id);

        existingItem.setName(request.getName());
        existingItem.setCategory(request.getCategory());
        existingItem.setDescription(request.getDescription());
        existingItem.setPriceType(request.getPriceType());
        existingItem.setPrice(request.getPrice());
        existingItem.setStatus(request.getStatus());

        PricingItem saved = pricingItemRepository.save(existingItem);
        auditLogService.log("UPDATE", "PRICING", saved.getId(), "Updated pricing item: " + saved.getName());
        return saved;
    }

    @CacheEvict(value = {"pricingItems", "pricingItem", "pricingCategory"}, allEntries = true)
    public void deletePricingItem(String id) {
        if (!pricingItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Pricing item not found with id: " + id);
        }
        pricingItemRepository.deleteById(id);
        auditLogService.log("DELETE", "PRICING", id, "Deleted pricing item #" + id);
    }
}