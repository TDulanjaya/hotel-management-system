package com.luxestay.server.service;

import com.luxestay.server.dto.InventoryItemRequest;
import com.luxestay.server.dto.PurchaseRequest;
import com.luxestay.server.exception.ResourceNotFoundException;
import com.luxestay.server.model.InventoryItem;
import com.luxestay.server.repository.InventoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final AuditLogService auditLogService;

    public InventoryService(InventoryRepository inventoryRepository, AuditLogService auditLogService) {
        this.inventoryRepository = inventoryRepository;
        this.auditLogService = auditLogService;
    }

    public List<InventoryItem> getAllItems() {
        return inventoryRepository.findAll();
    }

    public InventoryItem getItemById(String id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found"));
    }

    public InventoryItem createItem(InventoryItemRequest request) {
        InventoryItem item = InventoryItem.builder()
                .itemName(request.getItemName())
                .category(request.getCategory())
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .reorderLevel(request.getReorderLevel())
                .supplierName(request.getSupplierName())
                .purchasePrice(request.getPurchasePrice())
                .status(request.getStatus())
                .createdAt(System.currentTimeMillis())
                .build();
        InventoryItem saved = inventoryRepository.save(item);
        auditLogService.log("CREATE", "INVENTORY", saved.getId(), "Created inventory item: " + saved.getItemName());
        return saved;
    }

    public InventoryItem updateItem(String id, InventoryItemRequest request) {
        InventoryItem item = getItemById(id);
        item.setItemName(request.getItemName());
        item.setCategory(request.getCategory());
        item.setQuantity(request.getQuantity());
        item.setUnit(request.getUnit());
        item.setReorderLevel(request.getReorderLevel());
        item.setSupplierName(request.getSupplierName());
        item.setPurchasePrice(request.getPurchasePrice());
        item.setStatus(request.getStatus());
        InventoryItem saved = inventoryRepository.save(item);
        auditLogService.log("UPDATE", "INVENTORY", saved.getId(), "Updated inventory item: " + saved.getItemName());
        return saved;
    }

    public void deleteItem(String id) {
        InventoryItem item = inventoryRepository.findById(id).orElse(null);
        if (item != null) {
            auditLogService.log("DELETE", "INVENTORY", id, "Deleted inventory item: " + item.getItemName());
        }
        inventoryRepository.deleteById(id);
    }

    public InventoryItem purchaseStock(String id, PurchaseRequest request) {
        InventoryItem item = getItemById(id);
        item.setQuantity(item.getQuantity() + request.getQuantity());
        item.setPurchasePrice(request.getPurchasePrice());
        item.setSupplierName(request.getSupplierName());
        
        if (item.getQuantity() > item.getReorderLevel()) {
            item.setStatus("In Stock");
        } else if (item.getQuantity() > 0) {
            item.setStatus("Low Stock");
        } else {
            item.setStatus("Critical");
        }
        
        InventoryItem saved = inventoryRepository.save(item);
        auditLogService.log("PURCHASE", "INVENTORY", saved.getId(), "Purchased " + request.getQuantity() + " " + saved.getUnit() + " of " + saved.getItemName());
        return saved;
    }

    public void deductStock(String inventoryItemId, double quantity) {
        if (inventoryItemId == null || inventoryItemId.isBlank() || quantity <= 0) {
            return;
        }
        InventoryItem item = getItemById(inventoryItemId);
        double remaining = Math.max(0, item.getQuantity() - quantity);
        item.setQuantity((int) Math.round(remaining));

        if (item.getQuantity() > item.getReorderLevel()) {
            item.setStatus("In Stock");
        } else if (item.getQuantity() > 0) {
            item.setStatus("Low Stock");
        } else {
            item.setStatus("Critical");
        }
        inventoryRepository.save(item);
        auditLogService.log("DEDUCT", "INVENTORY", item.getId(), "Deducted " + quantity + " " + item.getUnit() + " for kitchen order");
    }
}
