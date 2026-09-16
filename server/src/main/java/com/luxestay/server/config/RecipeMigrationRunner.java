package com.luxestay.server.config;

import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class RecipeMigrationRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(RecipeMigrationRunner.class);
    private final MongoTemplate mongoTemplate;

    public RecipeMigrationRunner(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public void run(String... args) {
        try {
            if (!mongoTemplate.collectionExists("recipes")) {
                return;
            }

            List<Document> docs = mongoTemplate.getCollection("recipes").find().into(new ArrayList<>());
            for (Document doc : docs) {
                Object ingredientsObj = doc.get("ingredients");
                if (ingredientsObj instanceof String str && !str.isBlank()) {
                    log.info("Migrating recipe '{}' ingredients string to ingredientsNote and structured array", doc.getString("name"));
                    doc.put("ingredientsNote", str);
                    doc.put("ingredients", new ArrayList<>());
                    mongoTemplate.getCollection("recipes").replaceOne(new Document("_id", doc.get("_id")), doc);
                }
            }
        } catch (Exception e) {
            log.error("Failed running recipe migration: {}", e.getMessage(), e);
        }
    }
}
