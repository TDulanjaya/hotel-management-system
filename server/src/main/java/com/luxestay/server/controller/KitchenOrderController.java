package com.luxestay.server.controller;

import com.luxestay.server.model.KitchenOrder;
import com.luxestay.server.service.KitchenOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/kitchen", "/api/kitchen/orders"})
public class KitchenOrderController {

    @Autowired
    private KitchenOrderService service;

    @GetMapping
    public List<KitchenOrder> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public KitchenOrder getById(@PathVariable String id) {
        return service.getById(id);
    }

    @PostMapping
    public KitchenOrder create(@RequestBody KitchenOrder kitchenOrder) {
        return service.create(kitchenOrder);
    }

    @PutMapping("/{id}")
    public KitchenOrder update(@PathVariable String id, @RequestBody KitchenOrder kitchenOrder) {
        return service.update(id, kitchenOrder);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
