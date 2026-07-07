package com.luxestay.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PricingItemRequest {
    private String name;
    private String category;
    private String description;
    private String priceType;
    private Double price;
    private String status;
}