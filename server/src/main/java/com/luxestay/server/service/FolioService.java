package com.luxestay.server.service;

import com.luxestay.server.model.Folio;
import com.luxestay.server.repository.FolioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FolioService {

    @Autowired
    private FolioRepository repository;

    public List<Folio> getAll() {
        return repository.findAll();
    }

    public Folio getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public Folio getByReservationId(String reservationId) {
        return repository.findByReservationId(reservationId).orElse(null);
    }

    public Folio create(Folio folio) {
        folio.setStatus(folio.getStatus() == null ? "OPEN" : folio.getStatus());
        recalculate(folio);
        return repository.save(folio);
    }

    public Folio update(String id, Folio folio) {
        folio.setId(id);
        Folio existing = getById(id);
        if (existing != null && "CLOSED".equalsIgnoreCase(existing.getStatus())) {
            throw new IllegalStateException("Cannot edit a closed folio.");
        }
        recalculate(folio);
        return repository.save(folio);
    }

    public void delete(String id) {
        Folio existing = repository.findById(id).orElse(null);
        if (existing != null && "CLOSED".equalsIgnoreCase(existing.getStatus())) {
            throw new IllegalStateException("Cannot delete a settled/closed folio. Records must be preserved for audit purposes.");
        }
        repository.deleteById(id);
    }

    private void recalculate(Folio folio) {
        if (folio.getLines() == null) {
            folio.setLines(new java.util.ArrayList<>());
        }
        folio.setTotalAmount(folio.getLines().stream()
                .filter(line -> !"VOID".equalsIgnoreCase(line.getStatus()))
                .mapToDouble(com.luxestay.server.model.FolioLine::getAmount)
                .sum());
        folio.setBalanceAmount(Math.max(0, folio.getTotalAmount() - folio.getPaidAmount()));
    }
}
