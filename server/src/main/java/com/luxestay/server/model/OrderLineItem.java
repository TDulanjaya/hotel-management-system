package com.luxestay.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderLineItem {
    private String pricingItemId;
    private String recipeId;
    private String name;
    private int quantity;
    private double price;

    public OrderLineItem(String pricingItemId, String name, int quantity, double price) {
        this.pricingItemId = pricingItemId;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
    }
}
