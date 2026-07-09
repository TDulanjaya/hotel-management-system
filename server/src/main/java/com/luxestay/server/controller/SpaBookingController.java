package com.luxestay.server.controller;

import com.luxestay.server.model.SpaBooking;
import com.luxestay.server.service.SpaBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spa/bookings")
public class SpaBookingController {

    @Autowired
    private SpaBookingService service;

    @GetMapping
    public List<SpaBooking> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public SpaBooking getById(@PathVariable String id) {
        return service.getById(id);
    }

    @PostMapping
    public SpaBooking create(@RequestBody SpaBooking booking) {
        return service.create(booking);
    }

    @PutMapping("/{id}")
    public SpaBooking update(@PathVariable String id, @RequestBody SpaBooking booking) {
        return service.update(id, booking);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
