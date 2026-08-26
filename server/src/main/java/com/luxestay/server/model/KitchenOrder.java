package com.luxestay.server.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

import java.util.List;

@Data
@Document(collection = "kitchen_orders")
public class KitchenOrder {
    @Id private String id;
    private String orderSource;
    private String tableOrRoom;
    private String guestName;
    private List<OrderLineItem> items;
    private String priority;
    @org.springframework.data.mongodb.core.index.Indexed
    private String status;
    private String notes;
    @org.springframework.data.mongodb.core.index.Indexed
    private LocalDateTime receivedAt = LocalDateTime.now();
}
