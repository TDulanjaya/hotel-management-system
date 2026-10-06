package com.luxestay.server.service;

import com.luxestay.server.dto.InventoryItemRequest;
import com.luxestay.server.dto.InventoryPurchaseRequest;
import com.luxestay.server.dto.PurchaseRequest;
import com.luxestay.server.exception.ResourceNotFoundException;
import com.luxestay.server.model.InventoryItem;
import com.luxestay.server.model.InventoryPurchase;
import com.luxestay.server.repository.InventoryPurchaseRepository;
import com.luxestay.server.repository.InventoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final InventoryPurchaseRepository purchaseRepository;
    private final AuditLogService auditLogService;

    public InventoryService(InventoryRepository inventoryRepository,
                            InventoryPurchaseRepository purchaseRepository,
                            AuditLogService auditLogService) {
        this.inventoryRepository = inventoryRepository;
        this.purchaseRepository = purchaseRepository;
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
        int currentQty = item.getQuantity() != null ? item.getQuantity() : 0;
        int addQty = request.getQuantity() != null ? (int) Math.round(request.getQuantity()) : 0;
        item.setQuantity(currentQty + addQty);
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

        double qty = request.getQuantity() != null ? request.getQuantity() : 0.0;
        double unitPrice = request.getUnitPrice() != null ? request.getUnitPrice() : (request.getPurchasePrice() != null ? request.getPurchasePrice() : 0.0);
        double totalExpense = request.getTotalExpense() != null ? request.getTotalExpense() : (Math.round((qty * unitPrice) * 100.0) / 100.0);
        InventoryPurchase purchase = InventoryPurchase.builder()
                .inventoryItemId(saved.getId())
                .itemName(saved.getItemName())
                .category(saved.getCategory())
                .quantity(qty)
                .unit(saved.getUnit())
                .unitPrice(unitPrice)
                .totalExpense(totalExpense)
                .supplierName(request.getSupplierName() != null ? request.getSupplierName() : saved.getSupplierName())
                .supplierInvoiceNumber(request.getSupplierInvoiceNumber())
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "PETTY_CASH")
                .paymentStatus(request.getPaymentStatus() != null ? request.getPaymentStatus() : "PAID")
                .purchasedAt(System.currentTimeMillis())
                .recordedBy(request.getRecordedBy() != null ? request.getRecordedBy() : "SYSTEM")
                .notes(request.getNotes() != null ? request.getNotes() : (request.getNote() != null ? request.getNote() : "Stock restock"))
                .build();
        purchaseRepository.save(purchase);

        auditLogService.log("PURCHASE", "INVENTORY", saved.getId(), "Purchased " + request.getQuantity() + " " + saved.getUnit() + " of " + saved.getItemName());
        return saved;
    }

    public InventoryPurchase recordPurchase(String id, InventoryPurchaseRequest request, String recordedBy) {
        InventoryItem item = getItemById(id);
        int qty = request.getQuantity() != null ? (int) Math.round(request.getQuantity()) : 1;
        item.setQuantity(item.getQuantity() + qty);
        if (request.getUnitPrice() != null) {
            item.setPurchasePrice(request.getUnitPrice());
        }
        if (request.getSupplierName() != null && !request.getSupplierName().isBlank()) {
            item.setSupplierName(request.getSupplierName());
        }

        if (item.getQuantity() > item.getReorderLevel()) {
            item.setStatus("In Stock");
        } else if (item.getQuantity() > 0) {
            item.setStatus("Low Stock");
        } else {
            item.setStatus("Critical");
        }
        inventoryRepository.save(item);

        double unitPrice = request.getUnitPrice() != null ? request.getUnitPrice() : 0.0;
        double totalExpense = Math.round((qty * unitPrice) * 100.0) / 100.0;

        InventoryPurchase purchase = InventoryPurchase.builder()
                .inventoryItemId(item.getId())
                .itemName(item.getItemName())
                .category(item.getCategory())
                .quantity((double) qty)
                .unit(item.getUnit())
                .unitPrice(unitPrice)
                .totalExpense(totalExpense)
                .supplierName(request.getSupplierName() != null ? request.getSupplierName() : item.getSupplierName())
                .supplierInvoiceNumber(request.getSupplierInvoiceNumber())
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "BANK_TRANSFER")
                .paymentStatus(request.getPaymentStatus() != null ? request.getPaymentStatus() : "PAID")
                .purchasedAt(System.currentTimeMillis())
                .recordedBy(recordedBy != null ? recordedBy : "SYSTEM")
                .notes(request.getNotes())
                .build();

        InventoryPurchase savedPurchase = purchaseRepository.save(purchase);
        auditLogService.log("PURCHASE", "INVENTORY", item.getId(),
                "Purchased " + qty + " " + item.getUnit() + " of " + item.getItemName() + " (Expense: Rs " + totalExpense + ")");
        return savedPurchase;
    }

    public List<InventoryPurchase> getAllPurchases() {
        return purchaseRepository.findAllByOrderByPurchasedAtDesc();
    }

    public List<InventoryPurchase> getPurchasesByItem(String itemId) {
        return purchaseRepository.findByInventoryItemIdOrderByPurchasedAtDesc(itemId);
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
