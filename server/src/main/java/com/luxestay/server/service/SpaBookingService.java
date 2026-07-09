package com.luxestay.server.service;

import com.luxestay.server.model.SpaBooking;
import com.luxestay.server.repository.SpaBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpaBookingService {

    @Autowired
    private SpaBookingRepository repository;

    public List<SpaBooking> getAll() {
        return repository.findAll();
    }

    public SpaBooking getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public SpaBooking create(SpaBooking booking) {
        return repository.save(booking);
    }

    public SpaBooking update(String id, SpaBooking booking) {
        booking.setId(id);
        return repository.save(booking);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }
}
