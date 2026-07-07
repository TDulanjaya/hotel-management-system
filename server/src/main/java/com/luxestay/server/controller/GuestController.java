package com.luxestay.server.controller;

import com.luxestay.server.model.Guest;
import com.luxestay.server.service.GuestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guests")
public class GuestController {

    @Autowired
    private GuestService service;

    @GetMapping
    public List<Guest> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Guest getById(@PathVariable String id) {
        return service.getById(id);
    }

    @PostMapping
    public Guest create(@RequestBody Guest guest) {
        return service.create(guest);
    }

    @PutMapping("/{id}")
    public Guest update(@PathVariable String id, @RequestBody Guest guest) {
        return service.update(id, guest);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
