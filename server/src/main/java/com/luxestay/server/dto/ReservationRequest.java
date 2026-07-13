package com.luxestay.server.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class ReservationRequest {
    @NotBlank(message = "Guest name is required")
    private String guestName;
    
    @NotBlank(message = "Guest ID is required")
    private String guestId;
    
    @NotBlank(message = "Room number is required")
    private String roomNumber;
    
    @NotBlank(message = "Check-in date is required")
    private String checkIn;
    
    @NotBlank(message = "Check-out date is required")
    private String checkOut;
    
    @Min(value = 1, message = "At least 1 adult is required")
    private int adults;
    
    @PositiveOrZero(message = "Children cannot be negative")
    private int children;
    
    @NotBlank(message = "Status is required")
    private String status;
    
    @PositiveOrZero(message = "Total amount must be valid")
    private double totalAmount;
    
    @NotBlank(message = "Payment status is required")
    private String paymentStatus;
    
    private String notes;
}
