package com.luxestay.server.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "recipes")
public class Recipe {
    @Id private String id;
    @org.springframework.data.mongodb.core.index.Indexed
    private String name;
    @org.springframework.data.mongodb.core.index.Indexed
    private String category;
    private String ingredients;
    private String instructions;
    private int prepTime;
    private int servings;
    private String notes;
}
