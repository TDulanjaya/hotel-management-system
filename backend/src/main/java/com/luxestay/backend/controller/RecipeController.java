package com.luxestay.backend.controller;

import com.luxestay.backend.model.Recipe;
import com.luxestay.backend.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    @Autowired
    private RecipeService service;

    @GetMapping
    public List<Recipe> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Recipe getById(@PathVariable String id) {
        return service.getById(id);
    }

    @PostMapping
    public Recipe create(@RequestBody Recipe recipe) {
        return service.create(recipe);
    }

    @PutMapping("/{id}")
    public Recipe update(@PathVariable String id, @RequestBody Recipe recipe) {
        return service.update(id, recipe);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
