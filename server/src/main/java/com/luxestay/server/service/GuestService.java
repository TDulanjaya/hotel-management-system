package com.luxestay.server.service;

import com.luxestay.server.dto.GuestRequest;
import com.luxestay.server.model.Guest;
import com.luxestay.server.repository.GuestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class GuestService {

    @Autowired
    private GuestRepository repository;

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
        Guest guest = new Guest();
        return mapToEntityAndSave(request, guest);
    }

    public Guest update(String id, GuestRequest request) {
        Guest guest = repository.findById(id).orElseThrow(() -> new RuntimeException("Guest not found"));
        return mapToEntityAndSave(request, guest);
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
        repository.deleteById(id);
    }
}
