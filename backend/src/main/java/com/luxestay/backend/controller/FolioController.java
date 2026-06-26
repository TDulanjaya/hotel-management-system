package com.luxestay.backend.controller;

import com.luxestay.backend.model.Folio;
import com.luxestay.backend.service.FolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folios")
public class FolioController {

    @Autowired
    private FolioService service;

    @GetMapping
    public List<Folio> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Folio getById(@PathVariable String id) {
        return service.getById(id);
    }

    @PostMapping
    public Folio create(@RequestBody Folio folio) {
        return service.create(folio);
    }

    @PutMapping("/{id}")
    public Folio update(@PathVariable String id, @RequestBody Folio folio) {
        return service.update(id, folio);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
