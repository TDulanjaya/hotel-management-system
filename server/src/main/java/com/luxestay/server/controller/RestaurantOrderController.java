package com.luxestay.server.controller;

import com.luxestay.server.model.RestaurantOrder;
import com.luxestay.server.service.RestaurantOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/restaurant", "/api/restaurant/orders"})
public class RestaurantOrderController {

    @Autowired
    private RestaurantOrderService service;

    @GetMapping
    public List<RestaurantOrder> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public RestaurantOrder getById(@PathVariable String id) {
        return service.getById(id);
    }

    @PostMapping
    public RestaurantOrder create(@RequestBody RestaurantOrder restaurantOrder) {
        return service.create(restaurantOrder);
    }

    @PutMapping("/{id}")
    public RestaurantOrder update(@PathVariable String id, @RequestBody RestaurantOrder restaurantOrder) {
        return service.update(id, restaurantOrder);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
