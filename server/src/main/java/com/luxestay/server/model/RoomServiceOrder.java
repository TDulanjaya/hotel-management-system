package com.luxestay.server.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "room_service_orders")
public class RoomServiceOrder {
    @Id private String id;
    private String roomNumber;
    private String guestName;
    private String items;
    private String notes;
    private String status;
    private double totalAmount;
    private String paymentStatus;
    private LocalDateTime orderedAt = LocalDateTime.now();
}
