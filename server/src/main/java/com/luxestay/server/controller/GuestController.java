package com.luxestay.server.controller;

import com.luxestay.server.dto.GuestRequest;
import com.luxestay.server.model.Guest;
import com.luxestay.server.service.GuestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/guests")
public class GuestController {

    @Autowired
    private GuestService service;

    @GetMapping
    public Page<Guest> getAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort) {
        
        org.springframework.data.domain.Sort.Direction direction = org.springframework.data.domain.Sort.Direction.DESC;
        String sortBy = "createdAt";
        if (sort.length >= 2) {
            sortBy = sort[0];
            direction = sort[1].equalsIgnoreCase("asc") ? org.springframework.data.domain.Sort.Direction.ASC : org.springframework.data.domain.Sort.Direction.DESC;
        } else if (sort.length == 1) {
            sortBy = sort[0];
        }
        
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size, org.springframework.data.domain.Sort.by(direction, sortBy));
        return service.getAll(keyword, pageable);
    }

    @GetMapping("/{id}")
    public Guest getById(@PathVariable String id) {
        return service.getById(id);
    }

    @PostMapping
    public Guest create(@Valid @RequestBody GuestRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public Guest update(@PathVariable String id, @Valid @RequestBody GuestRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
