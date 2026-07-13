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

    public Folio create(Folio folio) {
        return repository.save(folio);
    }

    public Folio update(String id, Folio folio) {
        folio.setId(id);
        return repository.save(folio);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }
}
