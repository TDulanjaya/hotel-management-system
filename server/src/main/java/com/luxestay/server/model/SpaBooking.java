package com.luxestay.server.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

import java.util.List;

@Data
@Document(collection = "spa_bookings")
public class SpaBooking {
    @Id private String id;
    private String guestName;
    private String roomNumber;
    private List<OrderLineItem> items;
    private String notes;
    private String status;
    private double totalAmount;
    private String paymentStatus;
    private String therapistName;
    private String preferredTime;
    private LocalDateTime orderedAt = LocalDateTime.now();
}
