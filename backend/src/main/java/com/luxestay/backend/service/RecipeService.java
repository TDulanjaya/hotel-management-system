package com.luxestay.backend.service;

import com.luxestay.backend.model.Recipe;
import com.luxestay.backend.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecipeService {

    @Autowired
    private RecipeRepository repository;

    public List<Recipe> getAll() {
        return repository.findAll();
    }

    public Recipe getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public Recipe create(Recipe recipe) {
        return repository.save(recipe);
    }

    public Recipe update(String id, Recipe recipe) {
        recipe.setId(id);
        return repository.save(recipe);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }
}
