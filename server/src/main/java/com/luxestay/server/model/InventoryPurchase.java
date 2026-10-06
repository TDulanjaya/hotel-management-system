package com.luxestay.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "inventory_purchases")
public class InventoryPurchase {
    @Id
    private String id;
    private String inventoryItemId;
    private String itemName;
    private String category;
    private Double quantity;
    private String unit;
    private Double unitPrice;
    private Double totalExpense;
    private String supplierName;
    private String supplierInvoiceNumber;
    private String paymentMethod;
    private String paymentStatus;
    private Long purchasedAt;
    private String recordedBy;
    private String notes;
}
