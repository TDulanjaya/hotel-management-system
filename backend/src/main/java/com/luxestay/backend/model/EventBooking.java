package com.luxestay.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventBooking {
    private String id;
    private String eventName;
    private String eventType;
    private Integer guestCount;
    private String primaryDate;
    private String startTime;
    private String organizerName;
    private String phone;
    private String email;
    private String kitchenNote;
    private String specialNote;
    private String status;
    private Venue selectedVenue;
    private List<SelectedPackage> selectedPackages;
    private Double venueTotal;
    private Double packageTotal;
    private Double serviceCharge;
    private Double grandTotal;
    private Long createdAt;
}
