package com.luxestay.server.dto;

import lombok.Data;

@Data
public class ParkingBookingRequest {
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
    @Deprecated
    private Double amount;
    private String paymentStatus;
    private String notes;
    private String status;
}
