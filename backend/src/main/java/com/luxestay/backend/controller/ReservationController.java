package com.luxestay.backend.controller;

import com.luxestay.backend.model.Reservation;
import com.luxestay.backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService service;

    @GetMapping
    public List<Reservation> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Reservation getById(@PathVariable String id) {
        return service.getById(id);
    }

    @PostMapping
    public Reservation create(@RequestBody Reservation reservation) {
        return service.create(reservation);
    }

    @PutMapping("/{id}")
    public Reservation update(@PathVariable String id, @RequestBody Reservation reservation) {
        return service.update(id, reservation);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
