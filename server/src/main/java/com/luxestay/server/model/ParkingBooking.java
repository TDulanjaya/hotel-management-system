package com.luxestay.server.model;

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
@Document(collection = "parking_bookings")
public class ParkingBooking {
    @Id
    private String id;
    private String vehicleNumber;
    private String vehicleModel;
    private String vehicleType;
    private String driverName;
    private String contactNumber;
    private String parkingZone;
    private String slotNumber;
    private String serviceType;
    private String checkInTime;
    private String expectedCheckOutTime;
    private String guestName;
    private String roomNumber;
    private String reservationId;
    private String eventId;
    private String customerType;
    private String billingType;
    private String pricingItemId;
    private Double amount;
    private Long billableDurationMinutes;
    private String calculationNote;
    private String paymentStatus;
    private String notes;
    private String status;
    private Long createdAt;
}
