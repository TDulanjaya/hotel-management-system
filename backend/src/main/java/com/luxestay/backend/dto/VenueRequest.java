package com.luxestay.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VenueRequest {
    private String name;
    private String type;
    private Integer capacity;
    private String size;
    private String location;
    private String status;
    private Double price;
    private String image;
    private List<String> tags;
}