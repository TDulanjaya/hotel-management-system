package com.luxestay.server.service;

import com.luxestay.server.model.Guest;
import com.luxestay.server.repository.GuestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GuestService {

    @Autowired
    private GuestRepository repository;

    public List<Guest> getAll() {
        return repository.findAll();
    }

    public Guest getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public Guest create(Guest guest) {
        return repository.save(guest);
    }

    public Guest update(String id, Guest guest) {
        guest.setId(id);
        return repository.save(guest);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }
}
