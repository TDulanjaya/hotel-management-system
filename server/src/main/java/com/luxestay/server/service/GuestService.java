package com.luxestay.server.service;

import com.luxestay.server.dto.GuestRequest;
import com.luxestay.server.exception.ResourceNotFoundException;
import com.luxestay.server.model.Guest;
import com.luxestay.server.repository.GuestRepository;
import com.luxestay.server.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class GuestService {

    @Autowired
    private GuestRepository repository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private AuditLogService auditLogService;

    public Page<Guest> getAll(String keyword, Pageable pageable) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return repository.searchGuests(".*" + keyword + ".*", pageable);
        }
        return repository.findAll(pageable);
    }

    public Guest getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public Guest create(GuestRequest request) {
        boolean duplicate = repository.findAll().stream().anyMatch(g ->
                (request.getEmail() != null && !request.getEmail().isBlank() && request.getEmail().equalsIgnoreCase(g.getEmail())) ||
                (request.getIdNumber() != null && !request.getIdNumber().isBlank() && request.getIdNumber().equalsIgnoreCase(g.getIdNumber()))
        );
        if (duplicate) {
            throw new IllegalStateException("A guest with this email or ID number already exists.");
        }

        Guest guest = new Guest();
        Guest saved = mapToEntityAndSave(request, guest);
        auditLogService.log("CREATE", "GUEST", saved.getId(), "Created guest " + saved.getName());
        return saved;
    }

    public Guest update(String id, GuestRequest request) {
        Guest guest = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Guest not found"));
        Guest saved = mapToEntityAndSave(request, guest);
        auditLogService.log("UPDATE", "GUEST", saved.getId(), "Updated guest " + saved.getName());
        return saved;
    }

    private Guest mapToEntityAndSave(GuestRequest request, Guest guest) {
        guest.setName(request.getName());
        guest.setEmail(request.getEmail());
        guest.setPhone(request.getPhone());
        guest.setNationality(request.getNationality());
        guest.setIdType(request.getIdType());
        guest.setIdNumber(request.getIdNumber());
        guest.setAddress(request.getAddress());
        guest.setNotes(request.getNotes());
        return repository.save(guest);
    }

    public void delete(String id) {
        boolean hasReservations = reservationRepository.findAll().stream()
                .anyMatch(r -> id.equals(r.getGuestId()));
        if (hasReservations) {
            throw new IllegalStateException("Cannot delete a guest with existing reservations. Cancel or reassign those first.");
        }

        Guest guest = repository.findById(id).orElse(null);
        String name = guest != null ? guest.getName() : id;
        repository.deleteById(id);
        auditLogService.log("DELETE", "GUEST", id, "Deleted guest " + name);
    }
}
