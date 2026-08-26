package com.luxestay.server.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import org.springframework.data.mongodb.core.index.Indexed;

@Data
@Document(collection = "reservations")
public class Reservation {
    @Id private String id;
    private String guestName;
    @Indexed
    private String guestId;
    @Indexed
    private String roomNumber;
    @Indexed
    private String checkIn;
    @Indexed
    private String checkOut;
    private int adults;
    private int children;
    @Indexed
    private String status;
    private double totalAmount;
    private String paymentStatus;
    private String notes;
}
