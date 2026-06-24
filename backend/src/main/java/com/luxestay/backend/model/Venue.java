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
public class Venue {
    private String id;
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
