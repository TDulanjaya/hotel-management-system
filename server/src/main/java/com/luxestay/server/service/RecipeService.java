package com.luxestay.server.service;

import com.luxestay.server.model.Recipe;
import com.luxestay.server.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecipeService {

    @Autowired
    private RecipeRepository repository;

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
        return repository.save(recipe);
    }

    @CacheEvict(value = {"recipes", "recipe"}, allEntries = true)
    public Recipe update(String id, Recipe recipe) {
        recipe.setId(id);
        return repository.save(recipe);
    }

    @CacheEvict(value = {"recipes", "recipe"}, allEntries = true)
    public void delete(String id) {
        repository.deleteById(id);
    }
}
