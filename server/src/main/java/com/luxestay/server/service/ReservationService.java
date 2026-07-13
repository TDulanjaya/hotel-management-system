package com.luxestay.server.service;

import com.luxestay.server.model.Reservation;
import com.luxestay.server.dto.ReservationRequest;
import com.luxestay.server.exception.ResourceNotFoundException;
import com.luxestay.server.repository.ReservationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository repository;
    
    @Autowired
    private AuditLogService auditLogService;

    public Page<Reservation> getReservations(String keyword, Pageable pageable) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return repository.searchReservations(keyword, pageable);
        }
        return repository.findAll(pageable);
    }

    public Reservation getById(String id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));
    }

    public Reservation create(ReservationRequest request) {
        Reservation reservation = new Reservation();
        mapRequestToEntity(request, reservation);
        Reservation saved = repository.save(reservation);
        auditLogService.log("CREATE", "RESERVATION", saved.getId(), "Created reservation for " + saved.getGuestName());
        return saved;
    }

    public Reservation update(String id, ReservationRequest request) {
        Reservation reservation = getById(id);
        mapRequestToEntity(request, reservation);
        Reservation saved = repository.save(reservation);
        auditLogService.log("UPDATE", "RESERVATION", saved.getId(), "Updated reservation for " + saved.getGuestName());
        return saved;
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
        auditLogService.log("DELETE", "RESERVATION", id, "Deleted reservation");
        repository.deleteById(id);
    }
}
