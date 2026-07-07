package com.luxestay.server.service;

import com.luxestay.server.dto.InventoryItemRequest;
import com.luxestay.server.dto.PurchaseRequest;
import com.luxestay.server.model.InventoryItem;
import com.luxestay.server.repository.InventoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {
    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public List<InventoryItem> getAllItems() {
        return inventoryRepository.findAll();
    }

    public InventoryItem getItemById(String id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inventory item not found"));
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
        return inventoryRepository.save(item);
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
        return inventoryRepository.save(item);
    }

    public void deleteItem(String id) {
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
        
        return inventoryRepository.save(item);
    }
}
