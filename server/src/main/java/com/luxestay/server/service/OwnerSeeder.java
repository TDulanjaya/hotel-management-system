package com.luxestay.server.service;

import com.luxestay.server.model.AppUser;
import com.luxestay.server.model.Role;
import com.luxestay.server.repository.AppUserRepository;
import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class OwnerSeeder {

    private static final Logger logger = LoggerFactory.getLogger(OwnerSeeder.class);

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Dotenv dotenv;

    public OwnerSeeder(AppUserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.dotenv = Dotenv.configure()
                .filename(".env.local")
                .directory(".")
                .ignoreIfMissing()
                .load();
    }

    @PostConstruct
    public void seedOwner() {
        if (!userRepository.existsByRole(Role.OWNER)) {
            String ownerName = getEnvValue("OWNER_NAME");
            String ownerEmail = getEnvValue("OWNER_EMAIL");
            String ownerPassword = getEnvValue("OWNER_PASSWORD");

            if (ownerName == null || ownerEmail == null || ownerPassword == null) {
                logger.warn("OWNER_NAME, OWNER_EMAIL, or OWNER_PASSWORD missing in .env.local. Skipping Owner creation.");
                return;
            }

            if (userRepository.existsByEmail(ownerEmail)) {
                logger.warn("User with owner email already exists but is not an OWNER role.");
                return;
            }

            AppUser owner = AppUser.builder()
                    .name(ownerName)
                    .email(ownerEmail)
                    .password(passwordEncoder.encode(ownerPassword))
                    .role(Role.OWNER)
                    .active(true)
                    .createdAt(System.currentTimeMillis())
                    .build();

            userRepository.save(owner);
            logger.info("First OWNER account created successfully.");
        }
    }

    private String getEnvValue(String key) {
        String systemValue = System.getenv(key);
        if (systemValue != null && !systemValue.isBlank()) {
            return systemValue;
        }
        return dotenv.get(key);
    }
}
