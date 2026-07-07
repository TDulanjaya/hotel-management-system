package com.luxestay.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SelectedPackage {
    private String id;
    private String name;
    private String category;
    private String description;
    private String priceType;
    private Double price;
}
