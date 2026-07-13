package com.luxestay.server.controller;

import com.luxestay.server.model.Reservation;
import com.luxestay.server.model.Room;
import com.luxestay.server.model.Folio;
import com.luxestay.server.repository.ReservationRepository;
import com.luxestay.server.repository.RoomRepository;
import com.luxestay.server.repository.FolioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.luxestay.server.exception.ResourceNotFoundException;

import java.util.List;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RoomRepository roomRepository;
    
    @Autowired
    private FolioRepository folioRepository;

    @GetMapping
    public ResponseEntity<List<Reservation>> getDueCheckouts() {
        // Fetch reservations with status CHECKED_IN
        List<Reservation> checkedIn = reservationRepository.findAllByStatusIgnoreCase("CHECKED_IN");
        return ResponseEntity.ok(checkedIn);
    }

    @PostMapping("/{reservationId}")
    public ResponseEntity<Reservation> processCheckout(@PathVariable String reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));
        
        // 1. Mark reservation as CHECKED_OUT
        reservation.setStatus("CHECKED_OUT");
        reservationRepository.save(reservation);

        // 2. Mark room as CLEANING
        String roomNumber = reservation.getRoomNumber();
        if (roomNumber != null) {
            Room room = roomRepository.findByRoomNumber(roomNumber).orElse(null);
            if (room != null) {
                room.setStatus("CLEANING");
                roomRepository.save(room);
            }
        }
        
        // 3. Mark Folio as CLOSED
        Folio folio = folioRepository.findByReservationId(reservationId).orElse(null);
        if (folio != null) {
            folio.setStatus("CLOSED");
            folioRepository.save(folio);
        }

        return ResponseEntity.ok(reservation);
    }
}
