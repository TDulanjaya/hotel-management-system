package com.luxestay.backend.controller;

import com.luxestay.backend.dto.InventoryItemRequest;
import com.luxestay.backend.dto.PurchaseRequest;
import com.luxestay.backend.model.InventoryItem;
import com.luxestay.backend.service.InventoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    
    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<List<InventoryItem>> getAllItems() {
        return ResponseEntity.ok(inventoryService.getAllItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryItem> getItemById(@PathVariable String id) {
        return ResponseEntity.ok(inventoryService.getItemById(id));
    }

    @PostMapping
    public ResponseEntity<InventoryItem> createItem(@RequestBody InventoryItemRequest request) {
        return new ResponseEntity<>(inventoryService.createItem(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryItem> updateItem(@PathVariable String id, @RequestBody InventoryItemRequest request) {
        return ResponseEntity.ok(inventoryService.updateItem(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable String id) {
        inventoryService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/purchase")
    public ResponseEntity<InventoryItem> purchaseStock(@PathVariable String id, @RequestBody PurchaseRequest request) {
        return ResponseEntity.ok(inventoryService.purchaseStock(id, request));
    }
}
