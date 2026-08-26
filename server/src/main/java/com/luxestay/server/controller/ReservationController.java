package com.luxestay.server.controller;

import com.luxestay.server.model.Reservation;
import com.luxestay.server.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import jakarta.validation.Valid;
import com.luxestay.server.dto.ReservationRequest;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService service;

    @GetMapping
    public Page<Reservation> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return service.getReservations(search, pageable);
    }

    @GetMapping("/{id}")
    public Reservation getById(@PathVariable String id) {
        return service.getById(id);
    }

    @PostMapping
    public Reservation create(@Valid @RequestBody ReservationRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public Reservation update(@PathVariable String id, @Valid @RequestBody ReservationRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
