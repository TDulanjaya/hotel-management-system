package com.luxestay.backend.service;

import com.luxestay.backend.model.Payment;
import com.luxestay.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository repository;

    public List<Payment> getAll() {
        return repository.findAll();
    }

    public Payment getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public Payment create(Payment payment) {
        return repository.save(payment);
    }

    public Payment update(String id, Payment payment) {
        payment.setId(id);
        return repository.save(payment);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }
}
