package com.luxestay.server.service;

import com.luxestay.server.model.LaundryOrder;
import com.luxestay.server.repository.LaundryOrderRepository;
import com.luxestay.server.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LaundryOrderService {

    @Autowired
    private LaundryOrderRepository repository;

    @Autowired
    private OrderBillingService billingService;

    @Autowired
    private DirectBillService directBillService;

    @Autowired
    private ReservationRepository reservationRepository;

    public List<LaundryOrder> getAll() {
        return repository.findAll();
    }

    public LaundryOrder getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public LaundryOrder create(LaundryOrder order) {
        normalizeAndValidate(order);
        order.setItems(billingService.resolveAndPriceItems(order.getItems()));
        order.setTotalAmount(billingService.sumTotal(order.getItems()));

        LaundryOrder saved = repository.save(order);
        billingService.postChargeToFolio(saved.getRoomNumber(),
                "Laundry order (" + saved.getItems().size() + " item(s))",
                "Laundry", saved.getTotalAmount(), "LAUNDRY_ORDER", saved.getId(), null);
        saved.setBillingStatus("FOLIO_POSTED");

        return repository.save(saved);
    }

    public LaundryOrder update(String id, LaundryOrder order) {
        normalizeAndValidate(order);
        order.setId(id);
        order.setItems(billingService.resolveAndPriceItems(order.getItems()));
        order.setTotalAmount(billingService.sumTotal(order.getItems()));
        return repository.save(order);
    }

    public void delete(String id) {
        LaundryOrder existing = getById(id);
        if (existing.getReservationId() != null) {
            billingService.voidSourceCharge(existing.getReservationId(), id);
        }
        repository.deleteById(id);
    }

    private void normalizeAndValidate(LaundryOrder order) {
        if (order.getRoomNumber() == null || order.getRoomNumber().isBlank()) {
            throw new IllegalArgumentException("Laundry service is reserved for in-house room guests. Please select an active guest room.");
        }
        order.setCustomerType("HOTEL_GUEST");
        order.setBillingType("ROOM_FOLIO");
        
        var activeRes = reservationRepository.findAllByStatusIgnoreCase("CHECKED_IN").stream()
                .filter(reservation -> order.getRoomNumber().equalsIgnoreCase(reservation.getRoomNumber()))
                .findFirst().orElseThrow(() -> new IllegalArgumentException(
                        "Room " + order.getRoomNumber() + " has no active checked-in reservation."));
        if (order.getReservationId() == null || order.getReservationId().isBlank()) {
            order.setReservationId(activeRes.getId());
        }
        if (order.getGuestName() == null || order.getGuestName().isBlank()) {
            order.setGuestName(activeRes.getGuestName());
        }
    }
}
