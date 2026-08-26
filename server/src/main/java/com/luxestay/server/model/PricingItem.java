package com.luxestay.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "pricing_items")
public class PricingItem {
    @Id
    private String id;
    private String name;
    @org.springframework.data.mongodb.core.index.Indexed
    private String category;
    private String description;
    private String priceType;
    private Double price;
    @org.springframework.data.mongodb.core.index.Indexed
    private String status;
}
