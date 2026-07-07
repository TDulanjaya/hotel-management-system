package com.luxestay.server.service;

import com.luxestay.server.model.RoomServiceOrder;
import com.luxestay.server.repository.RoomServiceOrderRepository;
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
