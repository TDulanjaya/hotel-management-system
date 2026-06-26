package com.luxestay.backend.service;

import com.luxestay.backend.model.RestaurantOrder;
import com.luxestay.backend.repository.RestaurantOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantOrderService {

    @Autowired
    private RestaurantOrderRepository repository;

    public List<RestaurantOrder> getAll() {
        return repository.findAll();
    }

    public RestaurantOrder getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public RestaurantOrder create(RestaurantOrder restaurantOrder) {
        return repository.save(restaurantOrder);
    }

    public RestaurantOrder update(String id, RestaurantOrder restaurantOrder) {
        restaurantOrder.setId(id);
        return repository.save(restaurantOrder);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }
}
