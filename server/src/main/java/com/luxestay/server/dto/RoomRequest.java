package com.luxestay.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class RoomRequest {
    @NotBlank(message = "Room number is required")
    private String roomNumber;
    
    @NotBlank(message = "Room type is required")
    private String roomType;
    
    @NotBlank(message = "Floor is required")
    private String floor;
    
    @NotNull(message = "Capacity is required")
    @Positive(message = "Capacity must be positive")
    private Integer capacity;
    
    @NotNull(message = "Price per night is required")
    @Positive(message = "Price must be positive")
    private Double pricePerNight;
    
    @NotBlank(message = "Status is required")
    private String status;
    
    private String description;
    private String image;
}
