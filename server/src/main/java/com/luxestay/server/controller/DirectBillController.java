package com.luxestay.server.controller;

import com.luxestay.server.model.DirectBill;
import com.luxestay.server.service.DirectBillService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/direct-bills")
public class DirectBillController {
    private final DirectBillService service;

    public DirectBillController(DirectBillService service) {
        this.service = service;
    }

    @GetMapping
    public List<DirectBill> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public DirectBill getById(@PathVariable String id) {
        return service.getById(id);
    }

    @GetMapping("/source/{sourceType}/{sourceId}")
    public DirectBill getBySource(@PathVariable String sourceType, @PathVariable String sourceId) {
        return service.getBySource(sourceType, sourceId);
    }
}
