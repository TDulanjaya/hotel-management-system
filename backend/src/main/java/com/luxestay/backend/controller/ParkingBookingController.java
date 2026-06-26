package com.luxestay.backend.controller;

import com.luxestay.backend.dto.ParkingBookingRequest;
import com.luxestay.backend.model.ParkingBooking;
import com.luxestay.backend.service.ParkingBookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parking")
public class ParkingBookingController {

    private final ParkingBookingService parkingBookingService;

    public ParkingBookingController(ParkingBookingService parkingBookingService) {
        this.parkingBookingService = parkingBookingService;
    }

    @GetMapping
    public ResponseEntity<List<ParkingBooking>> getAllBookings() {
        return ResponseEntity.ok(parkingBookingService.getAllBookings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParkingBooking> getBookingById(@PathVariable String id) {
        return ResponseEntity.ok(parkingBookingService.getBookingById(id));
    }

    @PostMapping
    public ResponseEntity<ParkingBooking> createBooking(@RequestBody ParkingBookingRequest request) {
        return new ResponseEntity<>(parkingBookingService.createBooking(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParkingBooking> updateBooking(@PathVariable String id, @RequestBody ParkingBookingRequest request) {
        return ResponseEntity.ok(parkingBookingService.updateBooking(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable String id) {
        parkingBookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}
