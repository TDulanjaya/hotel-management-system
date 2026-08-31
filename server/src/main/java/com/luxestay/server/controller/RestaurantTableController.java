package com.luxestay.server.controller;

import com.luxestay.server.model.RestaurantTable;
import com.luxestay.server.service.RestaurantTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/restaurant/tables", "/api/tables"})
public class RestaurantTableController {

    @Autowired
    private RestaurantTableService service;

    @GetMapping
    public List<RestaurantTable> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public RestaurantTable getById(@PathVariable String id) {
        return service.getById(id);
    }

    @PostMapping
    public RestaurantTable create(@RequestBody RestaurantTable table) {
        return service.create(table);
    }

    @PutMapping("/{id}")
    public RestaurantTable update(@PathVariable String id, @RequestBody RestaurantTable table) {
        return service.update(id, table);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
