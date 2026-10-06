package com.luxestay.server.controller;

import com.luxestay.server.dto.InventoryItemRequest;
import com.luxestay.server.dto.InventoryPurchaseRequest;
import com.luxestay.server.dto.PurchaseRequest;
import com.luxestay.server.model.InventoryItem;
import com.luxestay.server.model.InventoryPurchase;
import com.luxestay.server.service.InventoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

    @GetMapping("/purchases")
    public ResponseEntity<List<InventoryPurchase>> getAllPurchases() {
        return ResponseEntity.ok(inventoryService.getAllPurchases());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryItem> getItemById(@PathVariable String id) {
        return ResponseEntity.ok(inventoryService.getItemById(id));
    }

    @GetMapping("/{id}/purchases")
    public ResponseEntity<List<InventoryPurchase>> getPurchasesByItem(@PathVariable String id) {
        return ResponseEntity.ok(inventoryService.getPurchasesByItem(id));
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

    @PostMapping("/{id}/purchase-stock")
    public ResponseEntity<InventoryPurchase> recordPurchaseStock(@PathVariable String id,
                                                                 @RequestBody InventoryPurchaseRequest request,
                                                                 Authentication authentication) {
        String user = authentication != null ? authentication.getName() : "MANAGER";
        return new ResponseEntity<>(inventoryService.recordPurchase(id, request, user), HttpStatus.CREATED);
    }
}
