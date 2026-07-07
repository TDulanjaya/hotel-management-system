package com.luxestay.server.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "kitchen_orders")
public class KitchenOrder {
    @Id private String id;
    private String orderSource;
    private String tableOrRoom;
    private String guestName;
    private String items;
    private String priority;
    private String status;
    private String notes;
    private LocalDateTime receivedAt = LocalDateTime.now();
}
