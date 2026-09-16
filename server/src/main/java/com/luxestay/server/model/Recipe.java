package com.luxestay.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "recipes")
public class Recipe {
    @Id private String id;
    @org.springframework.data.mongodb.core.index.Indexed
    private String name;
    @org.springframework.data.mongodb.core.index.Indexed
    private String category;
    private List<RecipeIngredient> ingredients = new ArrayList<>();
    private String ingredientsNote;
    private String instructions;
    private int prepTime;
    private int servings;
    private String notes;
}
