package com.luxestay.backend.config;

import com.mongodb.ConnectionString;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class MongoConfig {

    private final Dotenv dotenv = Dotenv.configure()
            .filename(".env.local")
            .directory(".")
            .ignoreIfMissing()
            .load();

    @Bean
    public MongoClient mongoClient() {
        // Fix for MongoDB Atlas "Received fatal alert: internal_error" with newer Java versions
        System.setProperty("jdk.tls.client.protocols", "TLSv1.2");

        String mongoUri = getEnvValue("MONGODB_URI");

        if (mongoUri == null || mongoUri.isBlank()) {
            throw new IllegalStateException("MONGODB_URI is missing. Add it to backend/.env.local");
        }

        ConnectionString connectionString = new ConnectionString(mongoUri);
        return MongoClients.create(connectionString);
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        String databaseName = getEnvValue("MONGODB_DATABASE");

        if (databaseName == null || databaseName.isBlank()) {
            throw new IllegalStateException("MONGODB_DATABASE is missing. Add it to backend/.env.local");
        }

        return new MongoTemplate(mongoClient(), databaseName);
    }

    private String getEnvValue(String key) {
        String systemValue = System.getenv(key);

        if (systemValue != null && !systemValue.isBlank()) {
            return systemValue;
        }

        return dotenv.get(key);
    }
}
