package com.luxestay.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, CustomUserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(org.springframework.security.config.Customizer.withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                
                .requestMatchers(HttpMethod.GET, "/").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/venues/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/pricing/**").permitAll()
                
                .requestMatchers(HttpMethod.GET, "/api/auth/me").authenticated()

                // OWNER only specific routes
                .requestMatchers(HttpMethod.PUT, "/api/users/*/deactivate").hasRole("OWNER")
                .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("OWNER")
                .requestMatchers("/api/admin/**").hasRole("OWNER")
                .requestMatchers("/api/settings/**").hasRole("OWNER")
                
                // OWNER + MANAGER users routes
                .requestMatchers(HttpMethod.POST, "/api/users/**").hasAnyRole("OWNER", "MANAGER")
                .requestMatchers(HttpMethod.GET, "/api/users/**").hasAnyRole("OWNER", "MANAGER")
                .requestMatchers(HttpMethod.PUT, "/api/users/**").hasAnyRole("OWNER", "MANAGER")
                
                // OWNER + MANAGER other features
                .requestMatchers(HttpMethod.POST, "/api/pricing/**").hasAnyRole("OWNER", "MANAGER")
                .requestMatchers(HttpMethod.PUT, "/api/pricing/**").hasAnyRole("OWNER", "MANAGER")
                .requestMatchers(HttpMethod.DELETE, "/api/pricing/**").hasAnyRole("OWNER", "MANAGER")
                .requestMatchers(HttpMethod.GET, "/api/reports/**").hasAnyRole("OWNER", "MANAGER")
                
                // OWNER + MANAGER + EVENTS
                .requestMatchers(HttpMethod.POST, "/api/venues/**").hasAnyRole("OWNER", "MANAGER", "EVENTS")
                .requestMatchers(HttpMethod.PUT, "/api/venues/**").hasAnyRole("OWNER", "MANAGER", "EVENTS")
                .requestMatchers(HttpMethod.DELETE, "/api/venues/**").hasAnyRole("OWNER", "MANAGER", "EVENTS")
                .requestMatchers(HttpMethod.GET, "/api/events/**").hasAnyRole("OWNER", "MANAGER", "EVENTS")
                .requestMatchers(HttpMethod.POST, "/api/events/**").hasAnyRole("OWNER", "MANAGER", "EVENTS")
                .requestMatchers(HttpMethod.PUT, "/api/events/**").hasAnyRole("OWNER", "MANAGER", "EVENTS")
                .requestMatchers(HttpMethod.DELETE, "/api/events/**").hasAnyRole("OWNER", "MANAGER", "EVENTS")
                
                // OWNER + MANAGER + RECEPTIONIST
                .requestMatchers(HttpMethod.GET, "/api/rooms/**").hasAnyRole("OWNER", "MANAGER", "RECEPTIONIST")
                .requestMatchers(HttpMethod.POST, "/api/rooms/**").hasAnyRole("OWNER", "MANAGER", "RECEPTIONIST")
                .requestMatchers(HttpMethod.PUT, "/api/rooms/**").hasAnyRole("OWNER", "MANAGER", "RECEPTIONIST")
                .requestMatchers(HttpMethod.DELETE, "/api/rooms/**").hasAnyRole("OWNER", "MANAGER")
                // Added for RECEPTIONIST based on user rules "Guests if page exists", "Payments if page exists"
                .requestMatchers("/api/guests/**").hasAnyRole("OWNER", "MANAGER", "RECEPTIONIST")
                .requestMatchers("/api/payments/**").hasAnyRole("OWNER", "MANAGER", "RECEPTIONIST")
                .requestMatchers("/api/reservations/**").hasAnyRole("OWNER", "MANAGER", "RECEPTIONIST")
                
                // OWNER + MANAGER + INVENTORY
                .requestMatchers(HttpMethod.GET, "/api/inventory/**").hasAnyRole("OWNER", "MANAGER", "INVENTORY")
                .requestMatchers(HttpMethod.POST, "/api/inventory/**").hasAnyRole("OWNER", "MANAGER", "INVENTORY")
                .requestMatchers(HttpMethod.PUT, "/api/inventory/**").hasAnyRole("OWNER", "MANAGER", "INVENTORY")
                .requestMatchers(HttpMethod.DELETE, "/api/inventory/**").hasAnyRole("OWNER", "MANAGER", "INVENTORY")
                
                // OWNER + MANAGER + PARKING
                .requestMatchers(HttpMethod.GET, "/api/parking/**").hasAnyRole("OWNER", "MANAGER", "PARKING")
                .requestMatchers(HttpMethod.POST, "/api/parking/**").hasAnyRole("OWNER", "MANAGER", "PARKING")
                .requestMatchers(HttpMethod.PUT, "/api/parking/**").hasAnyRole("OWNER", "MANAGER", "PARKING")
                .requestMatchers(HttpMethod.DELETE, "/api/parking/**").hasAnyRole("OWNER", "MANAGER", "PARKING")
                
                // OWNER + MANAGER + WAITER
                .requestMatchers(HttpMethod.GET, "/api/restaurant/orders/**").hasAnyRole("OWNER", "MANAGER", "WAITER")
                .requestMatchers(HttpMethod.POST, "/api/restaurant/orders/**").hasAnyRole("OWNER", "MANAGER", "WAITER")
                .requestMatchers(HttpMethod.PUT, "/api/restaurant/orders/**").hasAnyRole("OWNER", "MANAGER", "WAITER")
                
                // OWNER + MANAGER + ROOM_SERVICE
                .requestMatchers(HttpMethod.GET, "/api/room-service/**").hasAnyRole("OWNER", "MANAGER", "ROOM_SERVICE")
                .requestMatchers(HttpMethod.POST, "/api/room-service/**").hasAnyRole("OWNER", "MANAGER", "ROOM_SERVICE")
                .requestMatchers(HttpMethod.PUT, "/api/room-service/**").hasAnyRole("OWNER", "MANAGER", "ROOM_SERVICE")
                
                // OWNER + MANAGER + COOK
                .requestMatchers(HttpMethod.GET, "/api/kitchen/orders/**").hasAnyRole("OWNER", "MANAGER", "COOK")
                .requestMatchers(HttpMethod.PUT, "/api/kitchen/orders/**").hasAnyRole("OWNER", "MANAGER", "COOK")
                
                // OWNER + MANAGER + GAME_STAFF
                .requestMatchers(HttpMethod.GET, "/api/games/**").hasAnyRole("OWNER", "MANAGER", "GAME_STAFF")
                .requestMatchers(HttpMethod.POST, "/api/games/**").hasAnyRole("OWNER", "MANAGER", "GAME_STAFF")
                .requestMatchers(HttpMethod.PUT, "/api/games/**").hasAnyRole("OWNER", "MANAGER", "GAME_STAFF")
                .requestMatchers(HttpMethod.DELETE, "/api/games/**").hasAnyRole("OWNER", "MANAGER", "GAME_STAFF")
                
                .anyRequest().authenticated()
            );

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
