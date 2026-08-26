package com.luxestay.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
public class AppUser {

    @Id
    private String id;

    private String name;
    @org.springframework.data.mongodb.core.index.Indexed(unique = true)
    private String email;
    private String password;
    @org.springframework.data.mongodb.core.index.Indexed
    private Role role;
    private boolean active;
    private Long createdAt;
    private String resetPasswordToken;
    private LocalDateTime resetPasswordTokenExpiry;
}
