package com.luxestay.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "payments")
public class Payment {
    @Id private String id;
    private String guestName;
    private String roomNumber;
    private String referenceType;
    private String referenceId;
    private double amount;
    private String method;
    private String status;
    private String notes;
    private LocalDateTime paidAt = LocalDateTime.now();
}
