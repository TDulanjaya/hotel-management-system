package com.luxestay.server.controller;

import com.luxestay.server.dto.VenueRequest;
import com.luxestay.server.model.Venue;
import com.luxestay.server.service.VenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
public class VenueController {

    private final VenueService venueService;

    @GetMapping
    public ResponseEntity<List<Venue>> getAllVenues() {
        return ResponseEntity.ok(venueService.getAllVenues());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venue> getVenueById(@PathVariable String id) {
        return ResponseEntity.ok(venueService.getVenueById(id));
    }

    @PostMapping
    public ResponseEntity<Venue> createVenue(@RequestBody VenueRequest request) {
        return new ResponseEntity<>(venueService.createVenue(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Venue> updateVenue(@PathVariable String id, @RequestBody VenueRequest request) {
        return ResponseEntity.ok(venueService.updateVenue(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVenue(@PathVariable String id) {
        venueService.deleteVenue(id);
        return ResponseEntity.noContent().build();
    }
}
