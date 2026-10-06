package com.luxestay.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PricingItemRequest {
    private String name;
    private String recipeId;
    private String category;
    private String description;
    private String priceType;
    private Double price;
    private String status;
    private String currency;
    private List<String> allowedCustomerTypes;
    private List<String> allowedBillingTypes;
    private Boolean requiresReservation;
    private Boolean requiresOpenFolio;
    private Boolean requiresEvent;
    private Boolean requiresGameSession;
    private Boolean requiresVehicle;
    private Boolean requiresQuantity;
    private Boolean requiresDuration;
    private Boolean kitchenRequired;
    private String vehicleType;
    private Integer gracePeriodMinutes;
    private Integer minimumBillableHours;
    private Double dailyMaximum;
    private Double overnightRate;
}