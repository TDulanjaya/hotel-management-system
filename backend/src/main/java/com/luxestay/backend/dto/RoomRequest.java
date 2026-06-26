package com.luxestay.backend.dto;

import lombok.Data;

@Data
public class RoomRequest {
    private String roomNumber;
    private String roomType;
    private String floor;
    private Integer capacity;
    private Double pricePerNight;
    private String status;
    private String description;
    private String image;
}
