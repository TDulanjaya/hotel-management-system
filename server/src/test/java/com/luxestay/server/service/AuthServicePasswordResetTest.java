package com.luxestay.server.service;

import com.luxestay.server.dto.ForgotPasswordRequest;
import com.luxestay.server.dto.ResetPasswordRequest;
import com.luxestay.server.model.AppUser;
import com.luxestay.server.model.Role;
import com.luxestay.server.repository.AppUserRepository;
import com.luxestay.server.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServicePasswordResetTest {

    @Mock
    private AppUserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private EmailService emailService;

    @Mock
    private RateLimiterService rateLimiterService;

    @InjectMocks
    private AuthService authService;

    private AppUser testUser;

    @BeforeEach
    void setUp() {
        lenient().when(rateLimiterService.isAllowed(anyString(), anyInt(), anyLong())).thenReturn(true);

        testUser = AppUser.builder()
                .id("user-123")
                .name("Test User")
                .email("staff@luxestay.com")
                .password("encoded-old-password")
                .role(Role.RECEPTIONIST)
                .active(true)
                .build();
    }

    // forgotPassword tests
    @Nested
    @DisplayName("forgotPassword()")
    class ForgotPasswordTests {

        @Test
        @DisplayName("valid email → saves token, sends email, returns generic message")
        void forgotPassword_validEmail_sendsResetEmail() {
            when(userRepository.findByEmail("staff@luxestay.com"))
                    .thenReturn(Optional.of(testUser));

            ForgotPasswordRequest request = new ForgotPasswordRequest();
            request.setEmail("staff@luxestay.com");

            Map<String, String> response = authService.forgotPassword(request);

            // Verify token was set and user was saved
            ArgumentCaptor<AppUser> userCaptor = ArgumentCaptor.forClass(AppUser.class);
            verify(userRepository).save(userCaptor.capture());

            AppUser savedUser = userCaptor.getValue();
            assertNotNull(savedUser.getResetPasswordToken(), "Reset token should be generated");
            assertNotNull(savedUser.getResetPasswordTokenExpiry(), "Token expiry should be set");
            assertTrue(savedUser.getResetPasswordTokenExpiry().isAfter(LocalDateTime.now()),
                    "Token expiry should be in the future");

            // Verify email was sent
            verify(emailService).sendPasswordResetEmail(
                    eq("staff@luxestay.com"),
                    eq(savedUser.getResetPasswordToken()));

            // Verify generic message returned
            assertEquals("If this email exists, a password reset request has been created.",
                    response.get("message"));
        }

        @Test
        @DisplayName("non-existent email → returns same generic message (no enumeration)")
        void forgotPassword_nonExistentEmail_returnsSameGenericMessage() {
            when(userRepository.findByEmail("unknown@luxestay.com"))
                    .thenReturn(Optional.empty());

            ForgotPasswordRequest request = new ForgotPasswordRequest();
            request.setEmail("unknown@luxestay.com");

            Map<String, String> response = authService.forgotPassword(request);

            // Generic response for non-existent email
            assertEquals("If this email exists, a password reset request has been created.",
                    response.get("message"));

            // Ensure no email sent
            verify(userRepository, never()).save(any());
            verify(emailService, never()).sendPasswordResetEmail(anyString(), anyString());
        }

        @Test
        @DisplayName("email service failure → still returns generic message, no exception leaks")
        void forgotPassword_emailFailure_returnsGenericMessage() {
            when(userRepository.findByEmail("staff@luxestay.com"))
                    .thenReturn(Optional.of(testUser));
            doThrow(new RuntimeException("SMTP connection refused"))
                    .when(emailService).sendPasswordResetEmail(anyString(), anyString());

            ForgotPasswordRequest request = new ForgotPasswordRequest();
            request.setEmail("staff@luxestay.com");

            Map<String, String> response = assertDoesNotThrow(
                    () -> authService.forgotPassword(request));

            assertEquals("If this email exists, a password reset request has been created.",
                    response.get("message"));

            // Token should still have been persisted
            verify(userRepository).save(any(AppUser.class));
        }
    }

    // resetPassword tests
    @Nested
    @DisplayName("resetPassword()")
    class ResetPasswordTests {

        @Test
        @DisplayName("valid token + valid password → resets password, clears token")
        void resetPassword_validToken_resetsPassword() {
            testUser.setResetPasswordToken("valid-token");
            testUser.setResetPasswordTokenExpiry(LocalDateTime.now().plusMinutes(15));

            when(userRepository.findByResetPasswordToken("valid-token"))
                    .thenReturn(Optional.of(testUser));
            when(passwordEncoder.encode("NewSecure123"))
                    .thenReturn("encoded-new-password");

            ResetPasswordRequest request = new ResetPasswordRequest();
            request.setToken("valid-token");
            request.setNewPassword("NewSecure123");

            Map<String, String> response = authService.resetPassword(request);

            assertEquals("Password reset successfully", response.get("message"));

            // Verify password was updated and token was cleared
            ArgumentCaptor<AppUser> userCaptor = ArgumentCaptor.forClass(AppUser.class);
            verify(userRepository).save(userCaptor.capture());

            AppUser savedUser = userCaptor.getValue();
            assertEquals("encoded-new-password", savedUser.getPassword());
            assertNull(savedUser.getResetPasswordToken(), "Token should be cleared after reset");
            assertNull(savedUser.getResetPasswordTokenExpiry(), "Token expiry should be cleared");
        }

        @Test
        @DisplayName("invalid token → returns error, does not change any password")
        void resetPassword_invalidToken_returnsError() {
            when(userRepository.findByResetPasswordToken("bad-token"))
                    .thenReturn(Optional.empty());

            ResetPasswordRequest request = new ResetPasswordRequest();
            request.setToken("bad-token");
            request.setNewPassword("NewSecure123");

            Map<String, String> response = authService.resetPassword(request);

            assertEquals("Invalid reset token", response.get("message"));
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("expired token → returns error, does not change password")
        void resetPassword_expiredToken_returnsError() {
            testUser.setResetPasswordToken("expired-token");
            testUser.setResetPasswordTokenExpiry(LocalDateTime.now().minusMinutes(5));

            when(userRepository.findByResetPasswordToken("expired-token"))
                    .thenReturn(Optional.of(testUser));

            ResetPasswordRequest request = new ResetPasswordRequest();
            request.setToken("expired-token");
            request.setNewPassword("NewSecure123");

            Map<String, String> response = authService.resetPassword(request);

            assertEquals("Reset token has expired", response.get("message"));
            verify(userRepository, never()).save(any());
            verify(passwordEncoder, never()).encode(anyString());
        }

        @Test
        @DisplayName("null token expiry → treated as expired")
        void resetPassword_nullExpiry_returnsError() {
            testUser.setResetPasswordToken("orphan-token");
            testUser.setResetPasswordTokenExpiry(null);

            when(userRepository.findByResetPasswordToken("orphan-token"))
                    .thenReturn(Optional.of(testUser));

            ResetPasswordRequest request = new ResetPasswordRequest();
            request.setToken("orphan-token");
            request.setNewPassword("NewSecure123");

            Map<String, String> response = authService.resetPassword(request);

            assertEquals("Reset token has expired", response.get("message"));
            verify(userRepository, never()).save(any());
        }
    }
}
