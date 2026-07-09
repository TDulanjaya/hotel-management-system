package com.luxestay.server.service;

import com.luxestay.server.model.LaundryOrder;
import com.luxestay.server.repository.LaundryOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LaundryOrderService {

    @Autowired
    private LaundryOrderRepository repository;

    public List<LaundryOrder> getAll() {
        return repository.findAll();
    }

    public LaundryOrder getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public LaundryOrder create(LaundryOrder order) {
        return repository.save(order);
    }

    public LaundryOrder update(String id, LaundryOrder order) {
        order.setId(id);
        return repository.save(order);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }
}
