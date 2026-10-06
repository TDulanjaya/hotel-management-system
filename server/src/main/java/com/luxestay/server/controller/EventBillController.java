package com.luxestay.server.controller;

import com.luxestay.server.model.EventBill;
import com.luxestay.server.service.EventBillService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event-bills")
public class EventBillController {
    private final EventBillService service;

    public EventBillController(EventBillService service) {
        this.service = service;
    }

    @GetMapping
    public List<EventBill> getAll() {
        return service.getAll();
    }

    @GetMapping("/event/{eventId}")
    public EventBill getByEventId(@PathVariable String eventId) {
        return service.getByEventId(eventId);
    }
}
