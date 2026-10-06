package com.luxestay.server.service;

import com.luxestay.server.model.RoomServiceOrder;
import com.luxestay.server.model.KitchenOrder;
import com.luxestay.server.repository.RoomServiceOrderRepository;
import com.luxestay.server.repository.ReservationRepository;
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

    @Autowired
    private KitchenOrderService kitchenOrderService;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private DirectBillService directBillService;

    public List<RoomServiceOrder> getAll() {
        return repository.findAll();
    }

    public RoomServiceOrder getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public RoomServiceOrder create(RoomServiceOrder roomServiceOrder) {
        var activeReservation = reservationRepository.findAllByStatusIgnoreCase("CHECKED_IN").stream()
                .filter(reservation -> roomServiceOrder.getRoomNumber() != null
                        && roomServiceOrder.getRoomNumber().equalsIgnoreCase(reservation.getRoomNumber()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        "Room service requires an active checked-in reservation."));
        if (roomServiceOrder.getReservationId() == null || roomServiceOrder.getReservationId().isBlank()) {
            roomServiceOrder.setReservationId(activeReservation.getId());
        }
        roomServiceOrder.setItems(billingService.resolveAndPriceItems(roomServiceOrder.getItems()));
        roomServiceOrder.setTotalAmount(billingService.sumTotal(roomServiceOrder.getItems()));

        RoomServiceOrder saved = repository.save(roomServiceOrder);
        KitchenOrder kitchenOrder = new KitchenOrder();
        kitchenOrder.setOrderSource("ROOM_SERVICE");
        kitchenOrder.setRoomServiceOrderId(saved.getId());
        kitchenOrder.setTableOrRoom("ROOM " + saved.getRoomNumber());
        kitchenOrder.setGuestName(saved.getGuestName());
        kitchenOrder.setItems(saved.getItems());
        kitchenOrder.setStatus("QUEUED");
        kitchenOrder.setBillingType("ROOM_FOLIO");
        kitchenOrder.setNotes(saved.getNotes());
        KitchenOrder savedKitchenOrder = kitchenOrderService.create(kitchenOrder);
        saved.setKitchenOrderId(savedKitchenOrder.getId());
        saved.setBillingStatus("FOLIO_POSTED");
        messagingTemplate.convertAndSend("/topic/room-service", "updated");

        billingService.postChargeToFolio(
                saved.getRoomNumber(),
                "Room service order (" + saved.getItems().size() + " item(s))",
                "Room Service",
                saved.getTotalAmount(),
                "ROOM_SERVICE_ORDER",
                saved.getId(),
                null
        );

        return repository.save(saved);
    }

    public RoomServiceOrder update(String id, RoomServiceOrder roomServiceOrder) {
        roomServiceOrder.setId(id);
        roomServiceOrder.setItems(billingService.resolveAndPriceItems(roomServiceOrder.getItems()));
        roomServiceOrder.setTotalAmount(billingService.sumTotal(roomServiceOrder.getItems()));
        RoomServiceOrder saved = repository.save(roomServiceOrder);
        if ("CANCELLED".equalsIgnoreCase(saved.getStatus())) {
            billingService.voidSourceCharge(saved.getReservationId(), saved.getId());
        } else {
            billingService.postChargeToFolio(saved.getRoomNumber(),
                    "Room service order (" + (saved.getItems() == null ? 0 : saved.getItems().size()) + " item(s))",
                    "Room Service", saved.getTotalAmount(), "ROOM_SERVICE_ORDER", saved.getId(), null);
        }
        messagingTemplate.convertAndSend("/topic/room-service", "updated");
        return saved;
    }

    public void delete(String id) {
        RoomServiceOrder existing = getById(id);
        billingService.voidSourceCharge(existing.getReservationId(), id);
        repository.deleteById(id);
        messagingTemplate.convertAndSend("/topic/room-service", "updated");
    }
}
