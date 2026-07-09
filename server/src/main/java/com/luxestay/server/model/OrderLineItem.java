package com.luxestay.server.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderLineItem {
    private String pricingItemId;
    private String name;
    private int quantity;
    private double price;
}
