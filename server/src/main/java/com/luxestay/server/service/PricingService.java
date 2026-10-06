package com.luxestay.server.service;

import com.luxestay.server.dto.PricingItemRequest;
import com.luxestay.server.exception.ResourceNotFoundException;
import com.luxestay.server.model.PricingItem;
import com.luxestay.server.model.Recipe;
import com.luxestay.server.repository.RecipeRepository;
import com.luxestay.server.repository.PricingItemRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

@Service
public class PricingService {

    private final PricingItemRepository pricingItemRepository;
    private final AuditLogService auditLogService;
    private final RecipeRepository recipeRepository;

    public PricingService(PricingItemRepository pricingItemRepository, AuditLogService auditLogService,
                          RecipeRepository recipeRepository) {
        this.pricingItemRepository = pricingItemRepository;
        this.auditLogService = auditLogService;
        this.recipeRepository = recipeRepository;
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

    public List<String> getAllCategories() {
        return pricingItemRepository.findAll().stream()
                .map(PricingItem::getCategory)
                .filter(java.util.Objects::nonNull)
                .distinct()
                .sorted()
                .toList();
    }

    @CacheEvict(value = {"pricingItems", "pricingItem", "pricingCategory"}, allEntries = true)
    public PricingItem createPricingItem(PricingItemRequest request) {
        validateRequest(request);
        String id = "PR-" + System.currentTimeMillis();

        PricingItem item = PricingItem.builder()
                .id(id)
                .name(request.getName())
                .recipeId(request.getRecipeId())
                .category(request.getCategory())
                .description(request.getDescription())
                .priceType(request.getPriceType())
                .price(request.getPrice())
                .status(request.getStatus() != null ? request.getStatus() : "Active")
                .currency(request.getCurrency() != null ? request.getCurrency() : "LKR")
                .allowedCustomerTypes(copy(request.getAllowedCustomerTypes()))
                .allowedBillingTypes(copy(request.getAllowedBillingTypes()))
                .requiresReservation(request.getRequiresReservation())
                .requiresOpenFolio(request.getRequiresOpenFolio())
                .requiresEvent(request.getRequiresEvent())
                .requiresGameSession(request.getRequiresGameSession())
                .requiresVehicle(request.getRequiresVehicle())
                .requiresQuantity(request.getRequiresQuantity())
                .requiresDuration(request.getRequiresDuration())
                .kitchenRequired(request.getKitchenRequired())
                .vehicleType(request.getVehicleType())
                .gracePeriodMinutes(request.getGracePeriodMinutes())
                .minimumBillableHours(request.getMinimumBillableHours())
                .dailyMaximum(request.getDailyMaximum())
                .overnightRate(request.getOvernightRate())
                .build();

        PricingItem saved = pricingItemRepository.save(item);
        auditLogService.log("CREATE", "PRICING", saved.getId(), "Created pricing item: " + saved.getName());
        return saved;
    }

    @CacheEvict(value = {"pricingItems", "pricingItem", "pricingCategory"}, allEntries = true)
    public PricingItem updatePricingItem(String id, PricingItemRequest request) {
        validateRequest(request);
        PricingItem existingItem = getPricingItemById(id);

        existingItem.setName(request.getName());
        existingItem.setRecipeId(request.getRecipeId());
        existingItem.setCategory(request.getCategory());
        existingItem.setDescription(request.getDescription());
        existingItem.setPriceType(request.getPriceType());
        existingItem.setPrice(request.getPrice());
        existingItem.setStatus(request.getStatus());
        existingItem.setCurrency(request.getCurrency() != null ? request.getCurrency() : "LKR");
        existingItem.setAllowedCustomerTypes(copy(request.getAllowedCustomerTypes()));
        existingItem.setAllowedBillingTypes(copy(request.getAllowedBillingTypes()));
        existingItem.setRequiresReservation(request.getRequiresReservation());
        existingItem.setRequiresOpenFolio(request.getRequiresOpenFolio());
        existingItem.setRequiresEvent(request.getRequiresEvent());
        existingItem.setRequiresGameSession(request.getRequiresGameSession());
        existingItem.setRequiresVehicle(request.getRequiresVehicle());
        existingItem.setRequiresQuantity(request.getRequiresQuantity());
        existingItem.setRequiresDuration(request.getRequiresDuration());
        existingItem.setKitchenRequired(request.getKitchenRequired());
        existingItem.setVehicleType(request.getVehicleType());
        existingItem.setGracePeriodMinutes(request.getGracePeriodMinutes());
        existingItem.setMinimumBillableHours(request.getMinimumBillableHours());
        existingItem.setDailyMaximum(request.getDailyMaximum());
        existingItem.setOvernightRate(request.getOvernightRate());

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

    private List<String> copy(List<String> values) {
        return values == null ? new ArrayList<>() : new ArrayList<>(values);
    }

    private void validateRequest(PricingItemRequest request) {
        if (request.getPrice() == null || request.getPrice() <= 0) {
            throw new IllegalArgumentException("Pricing amount must be greater than zero.");
        }
        boolean food = request.getCategory() != null
                && (request.getCategory().equalsIgnoreCase("RESTAURANT_FOOD")
                || request.getCategory().equalsIgnoreCase("ROOM_SERVICE_FOOD")
                || request.getCategory().equalsIgnoreCase("DESSERT")
                || Boolean.TRUE.equals(request.getKitchenRequired()));
        if (food) {
            if (request.getRecipeId() == null || request.getRecipeId().isBlank()) {
                throw new IllegalArgumentException("A recipe is required for kitchen menu pricing.");
            }
            Recipe recipe = recipeRepository.findById(request.getRecipeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Recipe not found: " + request.getRecipeId()));
            if ("INACTIVE".equalsIgnoreCase(recipe.getStatus())
                    || recipe.getIngredients() == null || recipe.getIngredients().isEmpty()) {
                throw new IllegalArgumentException("The selected recipe is inactive or has no ingredients.");
            }
        }
    }
}