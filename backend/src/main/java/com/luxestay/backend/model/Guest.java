package com.luxestay.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "guests")
public class Guest {
    @Id private String id;
    private String name;
    private String email;
    private String phone;
    private String nationality;
    private String idType;
    private String idNumber;
    private String address;
    private String notes;
    private boolean active = true;
}
