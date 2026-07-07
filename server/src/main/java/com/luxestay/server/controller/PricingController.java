package com.luxestay.server.controller;

import com.luxestay.server.dto.PricingItemRequest;
import com.luxestay.server.model.PricingItem;
import com.luxestay.server.service.PricingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pricing")
@RequiredArgsConstructor
public class PricingController {

    private final PricingService pricingService;

    @GetMapping
    public ResponseEntity<List<PricingItem>> getAllPricingItems() {
        return ResponseEntity.ok(pricingService.getAllPricingItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PricingItem> getPricingItemById(@PathVariable String id) {
        return ResponseEntity.ok(pricingService.getPricingItemById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<PricingItem>> getPricingItemsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(pricingService.getPricingItemsByCategory(category));
    }

    @PostMapping
    public ResponseEntity<PricingItem> createPricingItem(@RequestBody PricingItemRequest request) {
        return new ResponseEntity<>(pricingService.createPricingItem(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PricingItem> updatePricingItem(@PathVariable String id, @RequestBody PricingItemRequest request) {
        return ResponseEntity.ok(pricingService.updatePricingItem(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePricingItem(@PathVariable String id) {
        pricingService.deletePricingItem(id);
        return ResponseEntity.noContent().build();
    }
}
