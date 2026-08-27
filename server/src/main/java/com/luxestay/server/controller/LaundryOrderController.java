package com.luxestay.server.controller;

import com.luxestay.server.model.LaundryOrder;
import com.luxestay.server.service.LaundryOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/laundry", "/api/laundry/orders"})
public class LaundryOrderController {

    @Autowired
    private LaundryOrderService service;

    @GetMapping
    public List<LaundryOrder> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public LaundryOrder getById(@PathVariable String id) {
        return service.getById(id);
    }

    @PostMapping
    public LaundryOrder create(@RequestBody LaundryOrder order) {
        return service.create(order);
    }

    @PutMapping("/{id}")
    public LaundryOrder update(@PathVariable String id, @RequestBody LaundryOrder order) {
        return service.update(id, order);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
