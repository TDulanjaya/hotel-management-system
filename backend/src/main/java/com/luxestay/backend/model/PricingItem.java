package com.luxestay.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PricingItem {
    private String id;
    private String name;
    private String category;
    private String description;
    private String priceType;
    private Double price;
    private String status;
}
