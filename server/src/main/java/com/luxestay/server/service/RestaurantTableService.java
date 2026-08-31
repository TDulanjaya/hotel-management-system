package com.luxestay.server.service;

import com.luxestay.server.model.RestaurantTable;
import com.luxestay.server.repository.RestaurantTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantTableService {

    @Autowired
    private RestaurantTableRepository repository;

    public List<RestaurantTable> getAll() {
        return repository.findAll();
    }

    public RestaurantTable getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public RestaurantTable create(RestaurantTable table) {
        if (table.getCreatedAt() == null) {
            table.setCreatedAt(System.currentTimeMillis());
        }
        if (table.getStatus() == null || table.getStatus().isBlank()) {
            table.setStatus("AVAILABLE");
        }
        return repository.save(table);
    }

    public RestaurantTable update(String id, RestaurantTable table) {
        table.setId(id);
        if (table.getCreatedAt() == null) {
            RestaurantTable existing = getById(id);
            if (existing != null && existing.getCreatedAt() != null) {
                table.setCreatedAt(existing.getCreatedAt());
            } else {
                table.setCreatedAt(System.currentTimeMillis());
            }
        }
        return repository.save(table);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }
}
