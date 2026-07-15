package com.luxestay.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "parking")
public class Parking {
    @Id
    private String id;

    private String slotNumber;
    private String vehicleNumber;
    private String guestName;
    private String vehicleType;
    private String location;
    private String status; // Available, Occupied, Reserved, Maintenance
    private String notes;
}