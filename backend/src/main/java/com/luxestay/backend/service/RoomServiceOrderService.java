package com.luxestay.backend.service;

import com.luxestay.backend.model.RoomServiceOrder;
import com.luxestay.backend.repository.RoomServiceOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomServiceOrderService {

    @Autowired
    private RoomServiceOrderRepository repository;

    public List<RoomServiceOrder> getAll() {
        return repository.findAll();
    }

    public RoomServiceOrder getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public RoomServiceOrder create(RoomServiceOrder roomServiceOrder) {
        return repository.save(roomServiceOrder);
    }

    public RoomServiceOrder update(String id, RoomServiceOrder roomServiceOrder) {
        roomServiceOrder.setId(id);
        return repository.save(roomServiceOrder);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }
}
