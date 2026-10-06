package com.luxestay.server.model;

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
    @org.springframework.data.mongodb.core.index.Indexed
    private String referenceType;
    @org.springframework.data.mongodb.core.index.Indexed
    private String referenceId;
    private double amount;
    private String method;
    private String billingType;
    private String transactionReference;
    private String voidReason;
    private LocalDateTime voidedAt;
    private String voidedBy;
    @org.springframework.data.mongodb.core.index.Indexed
    private String status;
    private String notes;
    @org.springframework.data.mongodb.core.index.Indexed
    private LocalDateTime paidAt = LocalDateTime.now();
}
