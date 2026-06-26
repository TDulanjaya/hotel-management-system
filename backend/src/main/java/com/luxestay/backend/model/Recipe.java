package com.luxestay.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "recipes")
public class Recipe {
    @Id private String id;
    private String name;
    private String category;
    private String ingredients;
    private String instructions;
    private int prepTime;
    private int servings;
    private String notes;
}
