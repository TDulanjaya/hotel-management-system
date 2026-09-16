package com.luxestay.server.service;

import com.luxestay.server.model.RoomServiceOrder;
import com.luxestay.server.repository.RoomServiceOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomServiceOrderService {

    @Autowired
    private RoomServiceOrderRepository repository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private OrderBillingService billingService;

    public List<RoomServiceOrder> getAll() {
        return repository.findAll();
    }

    public RoomServiceOrder getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public RoomServiceOrder create(RoomServiceOrder roomServiceOrder) {
        roomServiceOrder.setItems(billingService.resolveAndPriceItems(roomServiceOrder.getItems()));
        roomServiceOrder.setTotalAmount(billingService.sumTotal(roomServiceOrder.getItems()));

        RoomServiceOrder saved = repository.save(roomServiceOrder);
        messagingTemplate.convertAndSend("/topic/room-service", "updated");

        billingService.postChargeToFolio(
                saved.getRoomNumber(),
                "Room service order (" + saved.getItems().size() + " item(s))",
                "Room Service",
                saved.getTotalAmount()
        );

        return saved;
    }

    public RoomServiceOrder update(String id, RoomServiceOrder roomServiceOrder) {
        roomServiceOrder.setId(id);
        roomServiceOrder.setItems(billingService.resolveAndPriceItems(roomServiceOrder.getItems()));
        roomServiceOrder.setTotalAmount(billingService.sumTotal(roomServiceOrder.getItems()));
        RoomServiceOrder saved = repository.save(roomServiceOrder);
        messagingTemplate.convertAndSend("/topic/room-service", "updated");
        return saved;
    }

    public void delete(String id) {
        repository.deleteById(id);
        messagingTemplate.convertAndSend("/topic/room-service", "updated");
    }
}

