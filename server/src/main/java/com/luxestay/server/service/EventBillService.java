package com.luxestay.server.service;

import com.luxestay.server.model.EventBill;
import com.luxestay.server.repository.EventBillRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventBillService {
    private final EventBillRepository repository;

    public EventBillService(EventBillRepository repository) {
        this.repository = repository;
    }

    public List<EventBill> getAll() {
        return repository.findAll();
    }

    public EventBill getByEventId(String eventId) {
        return repository.findByEventId(eventId).orElseGet(() -> {
            EventBill bill = new EventBill();
            bill.setEventId(eventId);
            return repository.save(bill);
        });
    }
}
