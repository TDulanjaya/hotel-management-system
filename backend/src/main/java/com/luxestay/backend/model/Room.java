package com.luxestay.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "rooms")
public class Room {
    @Id
    private String id;
    private String roomNumber;
    private String roomType;
    private String floor;
    private Integer capacity;
    private Double pricePerNight;
    private String status;
    private String description;
    private String image;
    private Long createdAt;
}
