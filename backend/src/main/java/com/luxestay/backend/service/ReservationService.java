package com.luxestay.backend.service;

import com.luxestay.backend.model.Reservation;
import com.luxestay.backend.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository repository;

    public List<Reservation> getAll() {
        return repository.findAll();
    }

    public Reservation getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public Reservation create(Reservation reservation) {
        return repository.save(reservation);
    }

    public Reservation update(String id, Reservation reservation) {
        reservation.setId(id);
        return repository.save(reservation);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }
}
