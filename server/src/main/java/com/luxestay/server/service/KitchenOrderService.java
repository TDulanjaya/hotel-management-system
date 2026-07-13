package com.luxestay.server.service;

import com.luxestay.server.model.KitchenOrder;
import com.luxestay.server.repository.KitchenOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KitchenOrderService {

    @Autowired
    private KitchenOrderRepository repository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<KitchenOrder> getAll() {
        return repository.findAll();
    }

    public KitchenOrder getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public KitchenOrder create(KitchenOrder kitchenOrder) {
        KitchenOrder saved = repository.save(kitchenOrder);
        messagingTemplate.convertAndSend("/topic/kitchen", "updated");
        return saved;
    }

    public KitchenOrder update(String id, KitchenOrder kitchenOrder) {
        kitchenOrder.setId(id);
        KitchenOrder saved = repository.save(kitchenOrder);
        messagingTemplate.convertAndSend("/topic/kitchen", "updated");
        return saved;
    }

    public void delete(String id) {
        repository.deleteById(id);
        messagingTemplate.convertAndSend("/topic/kitchen", "updated");
    }
}
