package com.luxestay.server.service;

import com.luxestay.server.model.Recipe;
import com.luxestay.server.repository.RecipeRepository;
import com.luxestay.server.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecipeService {

    @Autowired
    private RecipeRepository repository;

    @Autowired
    private InventoryService inventoryService;

    @Cacheable("recipes")
    public List<Recipe> getAll() {
        return repository.findAll();
    }

    @Cacheable(value = "recipe", key = "#id")
    public Recipe getById(String id) {
        return repository.findById(id).orElse(null);
    }

    @CacheEvict(value = {"recipes", "recipe"}, allEntries = true)
    public Recipe create(Recipe recipe) {
        validate(recipe);
        return repository.save(recipe);
    }

    @CacheEvict(value = {"recipes", "recipe"}, allEntries = true)
    public Recipe update(String id, Recipe recipe) {
        validate(recipe);
        recipe.setId(id);
        return repository.save(recipe);
    }

    @CacheEvict(value = {"recipes", "recipe"}, allEntries = true)
    public void delete(String id) {
        repository.deleteById(id);
    }

    private void validate(Recipe recipe) {
        if (recipe.getName() == null || recipe.getName().isBlank()
                || recipe.getIngredients() == null || recipe.getIngredients().isEmpty()) {
            throw new IllegalArgumentException("Recipe name and at least one ingredient are required.");
        }
        if (recipe.getServings() <= 0) {
            throw new IllegalArgumentException("Recipe servings must be greater than zero.");
        }
        recipe.getIngredients().forEach(ingredient -> {
            if (ingredient.getInventoryItemId() == null || ingredient.getInventoryItemId().isBlank()
                    || ingredient.getQuantityPerServing() <= 0) {
                throw new IllegalArgumentException("Every recipe ingredient needs an inventory item and positive quantity.");
            }
            inventoryService.getItemById(ingredient.getInventoryItemId());
        });
    }
}
