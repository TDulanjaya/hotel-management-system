package com.luxestay.backend.controller;

import com.luxestay.backend.model.Payment;
import com.luxestay.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService service;

    @GetMapping
    public List<Payment> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Payment getById(@PathVariable String id) {
        return service.getById(id);
    }

    @PostMapping
    public Payment create(@RequestBody Payment payment) {
        return service.create(payment);
    }

    @PutMapping("/{id}")
    public Payment update(@PathVariable String id, @RequestBody Payment payment) {
        return service.update(id, payment);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
