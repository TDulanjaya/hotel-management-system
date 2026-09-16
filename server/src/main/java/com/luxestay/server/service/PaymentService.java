package com.luxestay.server.service;

import com.luxestay.server.model.Payment;
import com.luxestay.server.model.Reservation;
import com.luxestay.server.repository.PaymentRepository;
import com.luxestay.server.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository repository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private AuditLogService auditLogService;

    public List<Payment> getAll() {
        return repository.findAll();
    }

    public Payment getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public Payment create(Payment payment) {
        Payment saved = repository.save(payment);
        reconcileReservationPayment(saved);
        auditLogService.log("CREATE", "PAYMENT", saved.getId(), "Recorded payment of " + saved.getAmount() + " for " + saved.getReferenceType() + " #" + saved.getReferenceId());
        return saved;
    }

    public Payment update(String id, Payment payment) {
        payment.setId(id);
        Payment saved = repository.save(payment);
        reconcileReservationPayment(saved);
        auditLogService.log("UPDATE", "PAYMENT", saved.getId(), "Updated payment #" + saved.getId() + " status to " + saved.getStatus());
        return saved;
    }

    public void delete(String id) {
        repository.deleteById(id);
        auditLogService.log("DELETE", "PAYMENT", id, "Deleted payment #" + id);
    }

    private void reconcileReservationPayment(Payment payment) {
        if (payment == null || !"RESERVATION".equalsIgnoreCase(payment.getReferenceType())
                || payment.getReferenceId() == null || payment.getReferenceId().isBlank()) {
            return;
        }

        reservationRepository.findById(payment.getReferenceId()).ifPresent(reservation -> {
            double totalPaid = repository.findAll().stream()
                    .filter(p -> payment.getReferenceId().equals(p.getReferenceId()))
                    .filter(p -> "PAID".equalsIgnoreCase(p.getStatus()))
                    .mapToDouble(Payment::getAmount)
                    .sum();

            reservation.setPaymentStatus(totalPaid >= reservation.getTotalAmount() ? "PAID" : "PARTIAL");
            reservationRepository.save(reservation);
        });
    }
}
