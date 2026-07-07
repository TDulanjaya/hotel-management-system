package com.luxestay.server.dto;

import com.luxestay.server.model.SelectedPackage;
import com.luxestay.server.model.Venue;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventRequest {
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
}