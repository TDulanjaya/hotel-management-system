package com.luxestay.backend.controller;

import com.luxestay.backend.dto.RegisterUserRequest;
import com.luxestay.backend.dto.UserResponse;
import com.luxestay.backend.model.Role;
import com.luxestay.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody RegisterUserRequest request, Authentication authentication) {
        Role creatorRole = getRoleFromAuthentication(authentication);
        return ResponseEntity.ok(authService.createUser(request, creatorRole));
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(authService.getUserById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable String id, @RequestBody RegisterUserRequest request, Authentication authentication) {
        Role updaterRole = getRoleFromAuthentication(authentication);
        return ResponseEntity.ok(authService.updateUser(id, request, updaterRole));
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateUser(@PathVariable String id) {
        authService.deactivateUser(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id, Authentication authentication) {
        Role deleterRole = getRoleFromAuthentication(authentication);
        authService.deleteUser(id, deleterRole);
        return ResponseEntity.noContent().build();
    }

    private Role getRoleFromAuthentication(Authentication authentication) {
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if (authority.getAuthority().startsWith("ROLE_")) {
                return Role.valueOf(authority.getAuthority().substring(5));
            }
        }
        throw new IllegalStateException("User role not found");
    }
}
