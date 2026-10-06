package com.luxestay.server.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

import java.util.List;

@Data
@Document(collection = "room_service_orders")
public class RoomServiceOrder {
    @Id private String id;
    private String roomNumber;
    private String guestName;
    private String reservationId;
    private String kitchenOrderId;
    private String billingType = "ROOM_FOLIO";
    private String billingStatus;
    private List<OrderLineItem> items;
    private String notes;
    private String status;
    private double totalAmount;
    private String paymentStatus;
    private LocalDateTime orderedAt = LocalDateTime.now();
}
