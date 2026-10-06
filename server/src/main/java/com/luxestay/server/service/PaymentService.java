package com.luxestay.server.service;

import com.luxestay.server.model.EventBill;
import com.luxestay.server.model.Folio;
import com.luxestay.server.model.DirectBill;
import com.luxestay.server.model.Payment;
import com.luxestay.server.model.Reservation;
import com.luxestay.server.repository.EventBillRepository;
import com.luxestay.server.repository.EventBookingRepository;
import com.luxestay.server.repository.FolioRepository;
import com.luxestay.server.repository.PaymentRepository;
import com.luxestay.server.repository.ReservationRepository;
import com.luxestay.server.repository.DirectBillRepository;
import com.luxestay.server.repository.ParkingBookingRepository;
import com.luxestay.server.repository.GameSessionRepository;
import com.luxestay.server.repository.RestaurantOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {
    private static final List<String> METHODS = List.of(
            "CASH", "CARD_TERMINAL", "BANK_TRANSFER", "CEFT", "LANKAQR",
            "ONLINE_PAYMENT", "VOUCHER", "COMPLIMENTARY");

    @Autowired private PaymentRepository repository;
    @Autowired private ReservationRepository reservationRepository;
    @Autowired private FolioRepository folioRepository;
    @Autowired private EventBillRepository eventBillRepository;
    @Autowired private EventBookingRepository eventBookingRepository;
    @Autowired private DirectBillRepository directBillRepository;
    @Autowired private ParkingBookingRepository parkingBookingRepository;
    @Autowired private GameSessionRepository gameSessionRepository;
    @Autowired private RestaurantOrderRepository restaurantOrderRepository;
    @Autowired private AuditLogService auditLogService;

    public List<Payment> getAll() { return repository.findAll(); }
    public Payment getById(String id) { return repository.findById(id).orElse(null); }

    public Payment create(Payment payment) {
        validatePayment(payment, null);
        payment.setStatus("PAID");
        if (payment.getPaidAt() == null) payment.setPaidAt(LocalDateTime.now());
        Payment saved = repository.save(payment);
        reconcile(saved);
        auditLogService.log("CREATE", "PAYMENT", saved.getId(),
                "Recorded " + saved.getMethod() + " payment of " + saved.getAmount());
        return saved;
    }

    public Payment update(String id, Payment payment) {
        Payment existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found: " + id));
        if ("VOID".equalsIgnoreCase(existing.getStatus()) || "REFUNDED".equalsIgnoreCase(existing.getStatus())) {
            throw new IllegalStateException("A voided or refunded payment cannot be edited.");
        }
        validatePayment(payment, id);
        payment.setId(id);
        payment.setStatus("PAID");
        Payment saved = repository.save(payment);
        reconcile(existing);
        reconcile(saved);
        auditLogService.log("UPDATE", "PAYMENT", saved.getId(), "Updated payment");
        return saved;
    }

    public Payment voidPayment(String id, String reason) {
        Payment payment = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found: " + id));
        if ("VOID".equalsIgnoreCase(payment.getStatus())) return payment;
        payment.setStatus("VOID");
        payment.setVoidReason(reason == null || reason.isBlank() ? "Payment voided" : reason);
        payment.setVoidedAt(LocalDateTime.now());
        Payment saved = repository.save(payment);
        reconcile(saved);
        auditLogService.log("VOID", "PAYMENT", id, saved.getVoidReason());
        return saved;
    }

    public void delete(String id) {
        voidPayment(id, "Legacy delete request converted to an auditable void.");
    }

    private void validatePayment(Payment payment, String excludedId) {
        if (payment == null || payment.getAmount() <= 0) {
            throw new IllegalArgumentException("Payment amount must be greater than zero.");
        }
        String method = payment.getMethod() == null ? "" : payment.getMethod().trim().toUpperCase();
        if (!METHODS.contains(method)) throw new IllegalArgumentException("Unsupported payment method: " + method);
        payment.setMethod(method);
        if (payment.getReferenceType() == null || payment.getReferenceId() == null
                || payment.getReferenceType().isBlank() || payment.getReferenceId().isBlank()) {
            throw new IllegalArgumentException("A bill reference is required.");
        }
        if (List.of("CARD_TERMINAL", "BANK_TRANSFER", "CEFT", "LANKAQR", "ONLINE_PAYMENT")
                .contains(method)
                && (payment.getTransactionReference() == null || payment.getTransactionReference().isBlank())) {
            throw new IllegalArgumentException("A transaction reference is required for " + method + ".");
        }
        double outstanding = outstanding(payment.getReferenceType(), payment.getReferenceId(), excludedId);
        if (payment.getAmount() > outstanding + 0.01) {
            throw new IllegalArgumentException("Payment exceeds the outstanding balance of Rs " + outstanding + ".");
        }
    }

    private double outstanding(String type, String id, String excludedId) {
        double total;
        if ("FOLIO".equalsIgnoreCase(type)) {
            Folio folio = folioRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Folio not found."));
            total = folio.getTotalAmount();
        } else if ("EVENT_BILL".equalsIgnoreCase(type)) {
            EventBill bill = eventBillRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Event bill not found."));
            total = bill.getTotalAmount();
        } else if ("RESERVATION".equalsIgnoreCase(type)) {
            Reservation reservation = reservationRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Reservation not found."));
            total = folioRepository.findByReservationId(id).map(Folio::getTotalAmount).orElse(reservation.getTotalAmount());
        } else if ("DIRECT_BILL".equalsIgnoreCase(type)
                || isDirectSource(type)) {
            DirectBill bill = "DIRECT_BILL".equalsIgnoreCase(type)
                    ? directBillRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Direct bill not found."))
                    : directBillRepository.findBySourceTypeAndSourceId(type, id)
                    .orElseThrow(() -> new IllegalArgumentException("Direct bill not found for " + type + "."));
            total = bill.getTotalAmount();
        } else {
            total = Double.MAX_VALUE;
        }
        double paid = repository.findByReferenceTypeAndReferenceId(type, id).stream()
                .filter(p -> !"VOID".equalsIgnoreCase(p.getStatus()) && !"REFUNDED".equalsIgnoreCase(p.getStatus()))
                .filter(p -> excludedId == null || !excludedId.equals(p.getId()))
                .mapToDouble(Payment::getAmount).sum();
        return Math.max(0, total - paid);
    }

    private void reconcile(Payment payment) {
        if (payment == null) return;
        String type = payment.getReferenceType();
        String id = payment.getReferenceId();
        double paid = repository.findByReferenceTypeAndReferenceId(type, id).stream()
                .filter(p -> "PAID".equalsIgnoreCase(p.getStatus()))
                .mapToDouble(Payment::getAmount).sum();
        if ("FOLIO".equalsIgnoreCase(type)) {
            folioRepository.findById(id).ifPresent(folio -> {
                folio.setPaidAmount(paid);
                folio.setBalanceAmount(Math.max(0, folio.getTotalAmount() - paid));
                if (folio.getBalanceAmount() <= 0.01) {
                    folio.setStatus("CLOSED");
                }
                folioRepository.save(folio);
            });
        } else if ("EVENT_BILL".equalsIgnoreCase(type)) {
            eventBillRepository.findById(id).ifPresent(bill -> {
                bill.setPaidAmount(paid);
                bill.setBalanceAmount(Math.max(0, bill.getTotalAmount() - paid));
                if (bill.getBalanceAmount() <= 0.01) {
                    bill.setStatus("SETTLED");
                }
                eventBillRepository.save(bill);

                // Auto-confirm event on advance payment
                if (bill.getEventId() != null) {
                    eventBookingRepository.findById(bill.getEventId()).ifPresent(event -> {
                        if (paid > 0 && "Pending".equalsIgnoreCase(event.getStatus())) {
                            event.setStatus("Confirmed");
                            eventBookingRepository.save(event);
                        }
                    });
                }
            });
        } else if ("RESERVATION".equalsIgnoreCase(type)) {
            reservationRepository.findById(id).ifPresent(reservation -> {
                reservation.setPaymentStatus(paid >= reservation.getTotalAmount() ? "PAID" : "PARTIAL");
                reservationRepository.save(reservation);
            });
        } else if ("DIRECT_BILL".equalsIgnoreCase(type) || isDirectSource(type)) {
            java.util.Optional<DirectBill> billResult = "DIRECT_BILL".equalsIgnoreCase(type)
                    ? directBillRepository.findById(id)
                    : directBillRepository.findBySourceTypeAndSourceId(type, id);
            billResult.ifPresent(bill -> {
                bill.setPaidAmount(paid);
                bill.setBalanceAmount(Math.max(0, bill.getTotalAmount() - paid));
                boolean isSettled = bill.getBalanceAmount() <= 0.01;
                bill.setStatus(isSettled ? "SETTLED" : "OPEN");
                directBillRepository.save(bill);

                if (isSettled && bill.getSourceType() != null && bill.getSourceId() != null) {
                    String srcType = bill.getSourceType().toUpperCase();
                    String srcId = bill.getSourceId();
                    if ("PARKING_BOOKING".equals(srcType)) {
                        parkingBookingRepository.findById(srcId).ifPresent(pb -> {
                            pb.setPaymentStatus("PAID");
                            pb.setStatus("CHECKED_OUT");
                            parkingBookingRepository.save(pb);
                        });
                    } else if ("GAME_SESSION".equals(srcType)) {
                        gameSessionRepository.findById(srcId).ifPresent(gs -> {
                            gs.setStatus("COMPLETED");
                            gameSessionRepository.save(gs);
                        });
                    } else if ("RESTAURANT_ORDER".equals(srcType)) {
                        restaurantOrderRepository.findById(srcId).ifPresent(ro -> {
                            ro.setPaymentStatus("PAID");
                            ro.setStatus("COMPLETED");
                            restaurantOrderRepository.save(ro);
                        });
                    }
                }
            });
        }
    }

    private boolean isDirectSource(String type) {
        return List.of("RESTAURANT_ORDER", "GAME_SESSION", "PARKING_BOOKING", "LAUNDRY_ORDER")
                .contains(type == null ? "" : type.toUpperCase());
    }
}
