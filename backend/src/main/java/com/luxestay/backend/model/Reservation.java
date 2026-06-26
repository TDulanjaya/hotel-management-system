package com.luxestay.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "reservations")
public class Reservation {
    @Id private String id;
    private String guestName;
    private String guestId;
    private String roomNumber;
    private String checkIn;
    private String checkOut;
    private int adults;
    private int children;
    private String status;
    private double totalAmount;
    private String paymentStatus;
    private String notes;
}
