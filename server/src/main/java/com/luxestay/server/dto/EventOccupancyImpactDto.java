package com.luxestay.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventOccupancyImpactDto {
    private long committedRooms;
    private long totalCapacity;
    private double percentage;
    private String forecastText;
    private long activeEventsCount;
    private long totalGuests;
}
