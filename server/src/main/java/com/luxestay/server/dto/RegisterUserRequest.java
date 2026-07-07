package com.luxestay.server.dto;

import com.luxestay.server.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterUserRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
    private Boolean active;
}
