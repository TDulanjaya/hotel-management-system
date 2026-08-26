package com.luxestay.server.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "guests")
public class Guest {
    @Id private String id;
    @org.springframework.data.mongodb.core.index.Indexed
    private String name;
    @org.springframework.data.mongodb.core.index.Indexed
    private String email;
    @org.springframework.data.mongodb.core.index.Indexed
    private String phone;
    private String nationality;
    private String idType;
    @org.springframework.data.mongodb.core.index.Indexed
    private String idNumber;
    private String address;
    private String notes;
    private boolean active = true;
}
