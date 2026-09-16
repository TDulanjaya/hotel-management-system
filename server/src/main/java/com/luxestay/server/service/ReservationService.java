package com.luxestay.server.service;

import com.luxestay.server.dto.ReservationRequest;
import com.luxestay.server.exception.ResourceNotFoundException;
import com.luxestay.server.model.Folio;
import com.luxestay.server.model.Reservation;
import com.luxestay.server.model.Room;
import com.luxestay.server.repository.FolioRepository;
import com.luxestay.server.repository.ReservationRepository;
import com.luxestay.server.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository repository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private FolioRepository folioRepository;

    @Autowired
    private AuditLogService auditLogService;

    public Page<Reservation> getReservations(String keyword, Pageable pageable) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return repository.searchReservations(keyword, pageable);
        }
        return repository.findAll(pageable);
    }

    public Reservation getById(String id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
    }

    public Reservation create(ReservationRequest request) {
        assertNoOverlap(request.getRoomNumber(), request.getCheckIn(), request.getCheckOut(), null);

        Reservation reservation = new Reservation();
        mapRequestToEntity(request, reservation);
        Reservation saved = repository.save(reservation);
        auditLogService.log("CREATE", "RESERVATION", saved.getId(), "Created reservation for " + saved.getGuestName());

        syncRoomStatus(saved);
        return saved;
    }

    public Reservation update(String id, ReservationRequest request) {
        assertNoOverlap(request.getRoomNumber(), request.getCheckIn(), request.getCheckOut(), id);

        Reservation reservation = getById(id);
        mapRequestToEntity(request, reservation);
        Reservation saved = repository.save(reservation);
        auditLogService.log("UPDATE", "RESERVATION", saved.getId(), "Updated reservation for " + saved.getGuestName());

        syncRoomStatus(saved);
        return saved;
    }

    // Check for overlapping bookings on the same room
    private void assertNoOverlap(String roomNumber, String checkIn, String checkOut, String excludeReservationId) {
        if (roomNumber == null || roomNumber.isBlank() || checkIn == null || checkOut == null) {
            return;
        }
        List<Reservation> existing = repository.findByRoomNumber(roomNumber);
        boolean clash = existing.stream()
                .filter(r -> excludeReservationId == null || !r.getId().equals(excludeReservationId))
                .filter(r -> !"CANCELLED".equalsIgnoreCase(r.getStatus()))
                .anyMatch(r -> checkIn.compareTo(r.getCheckOut()) < 0 && checkOut.compareTo(r.getCheckIn()) > 0);

        if (clash) {
            throw new IllegalStateException(
                    "Room " + roomNumber + " already has a reservation that overlaps " + checkIn + " to " + checkOut + ".");
        }
    }

    // Keep room status and folio in sync with reservation
    private void syncRoomStatus(Reservation reservation) {
        if (reservation.getRoomNumber() == null) return;

        Room room = roomRepository.findByRoomNumber(reservation.getRoomNumber()).orElse(null);
        String status = reservation.getStatus();

        if (room != null && status != null) {
            if ("CHECKED_IN".equalsIgnoreCase(status)) {
                room.setStatus("OCCUPIED");
                roomRepository.save(room);
            } else if ("CANCELLED".equalsIgnoreCase(status)) {
                room.setStatus("AVAILABLE");
                roomRepository.save(room);
            }
        }

        // Create open folio if checked in
        if ("CHECKED_IN".equalsIgnoreCase(status) && reservation.getId() != null) {
            folioRepository.findByReservationId(reservation.getId())
                    .orElseGet(() -> {
                        Folio newFolio = new Folio();
                        newFolio.setReservationId(reservation.getId());
                        newFolio.setGuestName(reservation.getGuestName());
                        newFolio.setRoomNumber(reservation.getRoomNumber());
                        newFolio.setStatus("OPEN");
                        newFolio.setLines(new ArrayList<>());
                        newFolio.setTotalAmount(0.0);
                        return folioRepository.save(newFolio);
                    });
        }
    }

    private void mapRequestToEntity(ReservationRequest request, Reservation reservation) {
        reservation.setGuestName(request.getGuestName());
        reservation.setGuestId(request.getGuestId());
        reservation.setRoomNumber(request.getRoomNumber());
        reservation.setCheckIn(request.getCheckIn());
        reservation.setCheckOut(request.getCheckOut());
        reservation.setAdults(request.getAdults());
        reservation.setChildren(request.getChildren());
        reservation.setStatus(request.getStatus());
        reservation.setTotalAmount(request.getTotalAmount());
        reservation.setPaymentStatus(request.getPaymentStatus());
        reservation.setNotes(request.getNotes());
    }

    public void delete(String id) {
        Reservation reservation = repository.findById(id).orElse(null);
        auditLogService.log("DELETE", "RESERVATION", id, "Deleted reservation");
        repository.deleteById(id);

        if (reservation != null && reservation.getRoomNumber() != null) {
            roomRepository.findByRoomNumber(reservation.getRoomNumber()).ifPresent(room -> {
                room.setStatus("AVAILABLE");
                roomRepository.save(room);
            });
        }
    }
}
