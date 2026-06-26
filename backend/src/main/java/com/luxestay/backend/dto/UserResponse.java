package com.luxestay.backend.dto;

import com.luxestay.backend.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private Role role;
    private boolean active;
}
