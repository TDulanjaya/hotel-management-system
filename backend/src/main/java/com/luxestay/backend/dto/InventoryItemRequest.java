package com.luxestay.backend.dto;

import lombok.Data;

@Data
public class InventoryItemRequest {
    private String itemName;
    private String category;
    private Integer quantity;
    private String unit;
    private Integer reorderLevel;
    private String supplierName;
    private Double purchasePrice;
    private String status;
}
