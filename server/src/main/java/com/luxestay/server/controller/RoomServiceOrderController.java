package com.luxestay.server.controller;

import com.luxestay.server.model.RoomServiceOrder;
import com.luxestay.server.service.RoomServiceOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/room-service")
public class RoomServiceOrderController {

    @Autowired
    private RoomServiceOrderService service;

    @GetMapping
    public List<RoomServiceOrder> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public RoomServiceOrder getById(@PathVariable String id) {
        return service.getById(id);
    }

    @PostMapping
    public RoomServiceOrder create(@RequestBody RoomServiceOrder roomServiceOrder) {
        return service.create(roomServiceOrder);
    }

    @PutMapping("/{id}")
    public RoomServiceOrder update(@PathVariable String id, @RequestBody RoomServiceOrder roomServiceOrder) {
        return service.update(id, roomServiceOrder);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
