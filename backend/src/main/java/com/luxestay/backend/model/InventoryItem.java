package com.luxestay.backend.model;

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
@Document(collection = "inventory_items")
public class InventoryItem {
    @Id
    private String id;
    private String itemName;
    private String category;
    private Integer quantity;
    private String unit;
    private Integer reorderLevel;
    private String supplierName;
    private Double purchasePrice;
    private String status;
    private Long createdAt;
}
