package com.luxestay.server.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

import java.util.List;

@Data
@Document(collection = "restaurant_orders")
public class RestaurantOrder {
    @Id private String id;
    private String tableNumber;
    private String guestName;
    private String roomNumber;
    private String customerType;
    private String billingType;
    private String reservationId;
    private String eventId;
    private String folioId;
    private String kitchenOrderId;
    private String billingStatus;
    private List<OrderLineItem> items;
    private String notes;
    @org.springframework.data.mongodb.core.index.Indexed
    private String status;
    private double totalAmount;
    private String paymentStatus;
    @org.springframework.data.mongodb.core.index.Indexed
    private LocalDateTime orderedAt = LocalDateTime.now();
}
