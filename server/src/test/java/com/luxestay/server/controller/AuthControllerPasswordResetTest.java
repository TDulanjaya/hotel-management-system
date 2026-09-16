package com.luxestay.server.controller;

import com.luxestay.server.exception.GlobalExceptionHandler;
import com.luxestay.server.security.CustomUserDetailsService;
import com.luxestay.server.security.JwtAuthenticationFilter;
import com.luxestay.server.security.JwtService;
import com.luxestay.server.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Controller-level tests for /api/auth/forgot-password and /api/auth/reset-password.
 * Validates that Jakarta Bean Validation annotations on DTOs are enforced
 * and that proper error responses are returned.
 */
@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class AuthControllerPasswordResetTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    // Forgot password endpoint tests

    @Test
    @DisplayName("forgot-password: blank email → 400 with validation error")
    void forgotPassword_blankEmail_returns400() throws Exception {
        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\": \"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Error"))
                .andExpect(jsonPath("$.details.email").exists());

        verify(authService, never()).forgotPassword(any());
    }

    @Test
    @DisplayName("forgot-password: missing email field → 400 with validation error")
    void forgotPassword_missingEmail_returns400() throws Exception {
        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Error"))
                .andExpect(jsonPath("$.details.email").exists());

        verify(authService, never()).forgotPassword(any());
    }

    @Test
    @DisplayName("forgot-password: invalid email format → 400 with validation error")
    void forgotPassword_invalidEmailFormat_returns400() throws Exception {
        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\": \"not-an-email\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Error"))
                .andExpect(jsonPath("$.details.email").exists());

        verify(authService, never()).forgotPassword(any());
    }

    @Test
    @DisplayName("forgot-password: valid email → 200, delegates to service")
    void forgotPassword_validEmail_returns200() throws Exception {
        when(authService.forgotPassword(any()))
                .thenReturn(Map.of("message", "If this email exists, a password reset request has been created."));

        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\": \"staff@luxestay.com\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value(
                        "If this email exists, a password reset request has been created."));

        verify(authService).forgotPassword(any());
    }

    // Reset password endpoint tests

    @Test
    @DisplayName("reset-password: blank token → 400 with validation error")
    void resetPassword_blankToken_returns400() throws Exception {
        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"token\": \"\", \"newPassword\": \"ValidPass123\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Error"))
                .andExpect(jsonPath("$.details.token").exists());

        verify(authService, never()).resetPassword(any());
    }

    @Test
    @DisplayName("reset-password: too-short password → 400 with validation error")
    void resetPassword_tooShortPassword_returns400() throws Exception {
        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"token\": \"some-valid-token\", \"newPassword\": \"ab\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Error"))
                .andExpect(jsonPath("$.details.newPassword").exists());

        verify(authService, never()).resetPassword(any());
    }

    @Test
    @DisplayName("reset-password: missing both fields → 400 with multiple validation errors")
    void resetPassword_missingFields_returns400() throws Exception {
        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Error"))
                .andExpect(jsonPath("$.details.token").exists())
                .andExpect(jsonPath("$.details.newPassword").exists());

        verify(authService, never()).resetPassword(any());
    }

    @Test
    @DisplayName("reset-password: valid input → 200, delegates to service")
    void resetPassword_validInput_returns200() throws Exception {
        when(authService.resetPassword(any()))
                .thenReturn(Map.of("message", "Password reset successfully"));

        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"token\": \"valid-token\", \"newPassword\": \"NewSecure123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Password reset successfully"));

        verify(authService).resetPassword(any());
    }
}
