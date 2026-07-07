package com.luxestay.server.service;

import com.luxestay.server.model.KitchenOrder;
import com.luxestay.server.repository.KitchenOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KitchenOrderService {

    @Autowired
    private KitchenOrderRepository repository;

    public List<KitchenOrder> getAll() {
        return repository.findAll();
    }

    public KitchenOrder getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public KitchenOrder create(KitchenOrder kitchenOrder) {
        return repository.save(kitchenOrder);
    }

    public KitchenOrder update(String id, KitchenOrder kitchenOrder) {
        kitchenOrder.setId(id);
        return repository.save(kitchenOrder);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }
}
