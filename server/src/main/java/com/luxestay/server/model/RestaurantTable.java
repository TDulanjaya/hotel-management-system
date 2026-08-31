package com.luxestay.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "restaurant_tables")
public class RestaurantTable {
    @Id
    private String id;

    @Indexed(unique = true)
    private String tableNumber;

    @Indexed
    private String area;

    private Integer seats;

    @Indexed
    private String status; // AVAILABLE, OCCUPIED, RESERVED, CLEANING

    private String waiter;

    private String notes;

    private Long createdAt;
}
