package com.luxestay.server.service;

import com.luxestay.server.dto.AuthResponse;
import com.luxestay.server.dto.ForgotPasswordRequest;
import com.luxestay.server.dto.LoginRequest;
import com.luxestay.server.dto.RegisterUserRequest;
import com.luxestay.server.dto.ResetPasswordRequest;
import com.luxestay.server.dto.UserResponse;
import com.luxestay.server.model.AppUser;
import com.luxestay.server.model.Role;
import com.luxestay.server.repository.AppUserRepository;
import com.luxestay.server.security.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final AppUserRepository userRepository;
    
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final RateLimiterService rateLimiterService;

    public AuthService(AppUserRepository userRepository,
                   PasswordEncoder passwordEncoder,
                   JwtService jwtService,
                   AuthenticationManager authenticationManager,
                   UserDetailsService userDetailsService,
                   RateLimiterService rateLimiterService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.rateLimiterService = rateLimiterService;
    }

    public AuthResponse login(LoginRequest request) {
        if (rateLimiterService != null && !rateLimiterService.isAllowed("login:" + request.getEmail(), 5, 300)) {
            throw new IllegalStateException("Too many login attempts. Please wait a few minutes and try again.");
        }

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        if (!user.isActive()) {
            throw new IllegalStateException("Your account is deactivated. Contact manager or owner.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (org.springframework.security.core.AuthenticationException e) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        var jwtToken = jwtService.generateToken(userDetails, user.getRole().name());

        return AuthResponse.builder()
                .token(jwtToken)
                .user(mapToUserResponse(user))
                .build();
    }

    public Map<String, String> forgotPassword(ForgotPasswordRequest request) {
        if (rateLimiterService != null && !rateLimiterService.isAllowed("forgot-password:" + request.getEmail().trim().toLowerCase(), 3, 900)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "If this email exists, a password reset request has been created.");
            return response;
        }

        Map<String, String> response = new HashMap<>();

        AppUser user = userRepository.findByEmail(request.getEmail().trim())
                .orElse(null);

        if (user == null) {
            response.put("message", "If this email exists, a password reset request has been created.");
            return response;
        }

        String token = UUID.randomUUID().toString();

        user.setResetPasswordToken(token);
        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusMinutes(30));

        userRepository.save(user);

        log.info("Password reset token generated for user {}", user.getEmail());

        response.put("message", "If this email exists, a password reset request has been created.");
        return response;
    }

    public Map<String, String> resetPassword(ResetPasswordRequest request) {
        Map<String, String> response = new HashMap<>();

        AppUser user = userRepository.findByResetPasswordToken(request.getToken().trim())
                .orElse(null);

        if (user == null) {
            response.put("message", "Invalid reset token");
            return response;
        }

        if (user.getResetPasswordTokenExpiry() == null ||
                user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            response.put("message", "Reset token has expired");
            return response;
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);

        userRepository.save(user);

        response.put("message", "Password reset successfully");
        return response;
    }

    public UserResponse createUser(RegisterUserRequest request, Role creatorRole) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use.");
        }

        if (creatorRole == Role.MANAGER) {
            if (request.getRole() == Role.OWNER || request.getRole() == Role.MANAGER) {
                throw new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.FORBIDDEN,
                        "You do not have permission to create this user role"
                );
            }
        } else if (creatorRole != Role.OWNER) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN,
                    "You do not have permission to create this user role"
            );
        }

        var user = AppUser.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .active(true)
                .createdAt(System.currentTimeMillis())
                .build();

        userRepository.save(user);
        return mapToUserResponse(user);
    }

    public UserResponse getCurrentUser(String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        return mapToUserResponse(user);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(String id) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        return mapToUserResponse(user);
    }

    public UserResponse updateUser(String id, RegisterUserRequest request, Role updaterRole) {
        var existingUser = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (updaterRole == Role.MANAGER) {
            if (existingUser.getRole() == Role.OWNER || existingUser.getRole() == Role.MANAGER) {
                throw new SecurityException("Managers cannot update OWNER or MANAGER users.");
            }

            if (request.getRole() == Role.OWNER || request.getRole() == Role.MANAGER) {
                throw new SecurityException("Managers cannot change roles to OWNER or MANAGER.");
            }
        } else if (updaterRole != Role.OWNER) {
            throw new SecurityException("Only OWNER or MANAGER can update users.");
        }

        existingUser.setName(request.getName());
        existingUser.setEmail(request.getEmail());

        if (request.getRole() != null) {
            existingUser.setRole(request.getRole());
        }

        if (request.getActive() != null) {
            existingUser.setActive(request.getActive());
        }

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userRepository.save(existingUser);
        return mapToUserResponse(existingUser);
    }

    public void deleteUser(String id, Role deleterRole) {
        if (deleterRole != Role.OWNER) {
            throw new SecurityException("Only OWNER can delete users.");
        }

        var user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (user.getRole() == Role.OWNER) {
            throw new SecurityException("OWNER cannot be deleted.");
        }

        userRepository.deleteById(id);
    }

    public void deactivateUser(String id) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        user.setActive(false);
        userRepository.save(user);
    }

    private UserResponse mapToUserResponse(AppUser user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .active(user.isActive())
                .build();
    }
}