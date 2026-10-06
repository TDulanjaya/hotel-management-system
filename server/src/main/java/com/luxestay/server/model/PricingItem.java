package com.luxestay.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "pricing_items")
public class PricingItem {
    @Id
    private String id;
    private String name;
    private String recipeId;
    @org.springframework.data.mongodb.core.index.Indexed
    private String category;
    private String description;
    private String priceType;
    private Double price;
    @org.springframework.data.mongodb.core.index.Indexed
    private String status;
    private String currency;
    private List<String> allowedCustomerTypes = new ArrayList<>();
    private List<String> allowedBillingTypes = new ArrayList<>();
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
