package com.luxestay.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryPurchaseRequest {
    private String inventoryItemId;
    private Double quantity;
    private Double unitPrice;
    private String supplierName;
    private String supplierInvoiceNumber;
    private String paymentMethod;
    private String paymentStatus;
    private String notes;
}
