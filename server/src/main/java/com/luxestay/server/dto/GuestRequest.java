package com.luxestay.server.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GuestRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    private String nationality;
    
    @NotBlank(message = "ID Type is required")
    private String idType;
    
    @NotBlank(message = "ID Number is required")
    private String idNumber;
    
    private String address;
    private String notes;
}
