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
@Document(collection = "inventory_items")
public class InventoryItem {
    @Id
    private String id;
    @org.springframework.data.mongodb.core.index.Indexed
    private String itemName;
    @org.springframework.data.mongodb.core.index.Indexed
    private String category;
    private Integer quantity;
    private String unit;
    private Integer reorderLevel;
    private String supplierName;
    private Double purchasePrice;
    @org.springframework.data.mongodb.core.index.Indexed
    private String status;
    private Long createdAt;
}
