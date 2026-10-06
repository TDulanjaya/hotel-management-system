package com.luxestay.server.service;

import com.luxestay.server.model.RestaurantOrder;
import com.luxestay.server.model.KitchenOrder;
import com.luxestay.server.repository.RestaurantOrderRepository;
import com.luxestay.server.repository.RestaurantTableRepository;
import com.luxestay.server.repository.ReservationRepository;
import com.luxestay.server.repository.EventBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantOrderService {

    @Autowired
    private RestaurantOrderRepository repository;

    @Autowired
    private RestaurantTableRepository restaurantTableRepository;

    @Autowired
    private OrderBillingService billingService;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private KitchenOrderService kitchenOrderService;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private EventBookingRepository eventBookingRepository;

    @Autowired
    private DirectBillService directBillService;

    public List<RestaurantOrder> getAll() {
        return repository.findAll();
    }

    public RestaurantOrder getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public RestaurantOrder create(RestaurantOrder restaurantOrder) {
        normalizeBilling(restaurantOrder);
        validateOrderContext(restaurantOrder);
        restaurantOrder.setItems(billingService.resolveAndPriceItems(restaurantOrder.getItems()));
        restaurantOrder.setTotalAmount(billingService.sumTotal(restaurantOrder.getItems()));

        RestaurantOrder saved = repository.save(restaurantOrder);

        // Mark table as occupied
        if (saved.getTableNumber() != null && !saved.getTableNumber().isBlank()) {
            restaurantTableRepository.findByTableNumber(saved.getTableNumber()).ifPresent(table -> {
                table.setStatus("OCCUPIED");
                restaurantTableRepository.save(table);
            });
        }

        if ("ROOM_FOLIO".equalsIgnoreCase(saved.getBillingType())) {
            billingService.postChargeToFolio(
                    saved.getRoomNumber(),
                    "Restaurant order (" + (saved.getItems() != null ? saved.getItems().size() : 0) + " item(s), table " + saved.getTableNumber() + ")",
                    "Restaurant",
                    saved.getTotalAmount(),
                    "RESTAURANT_ORDER",
                    saved.getId(),
                    null
            );
            saved.setBillingStatus("FOLIO_POSTED");
        } else if ("DIRECT_PAYMENT".equalsIgnoreCase(saved.getBillingType())) {
            directBillService.ensureForSource(saved.getCustomerType(), saved.getGuestName(),
                    "RESTAURANT_ORDER", saved.getId(),
                    "Restaurant order (" + (saved.getItems() != null ? saved.getItems().size() : 0) + " item(s))",
                    "Restaurant", saved.getTotalAmount());
            saved.setBillingStatus("AWAITING_PAYMENT");
        } else if ("EVENT_MASTER_BILL".equalsIgnoreCase(saved.getBillingType())) {
            billingService.postChargeToEvent(saved.getEventId(), "Restaurant order", "Restaurant",
                    saved.getTotalAmount(), "RESTAURANT_ORDER", saved.getId(), null);
            saved.setBillingStatus("EVENT_BILLED");
        } else {
            saved.setBillingStatus("PENDING");
        }

        KitchenOrder kitchenOrder = new KitchenOrder();
        kitchenOrder.setOrderSource("RESTAURANT");
        kitchenOrder.setRestaurantOrderId(saved.getId());
        kitchenOrder.setTableOrRoom(saved.getTableNumber() != null && !saved.getTableNumber().isBlank()
                ? "TABLE " + saved.getTableNumber()
                : "ROOM " + saved.getRoomNumber());
        kitchenOrder.setGuestName(saved.getGuestName());
        kitchenOrder.setItems(saved.getItems());
        kitchenOrder.setStatus("QUEUED");
        kitchenOrder.setCustomerType(saved.getCustomerType());
        kitchenOrder.setBillingType(saved.getBillingType());
        kitchenOrder.setNotes(saved.getNotes());
        KitchenOrder savedKitchenOrder = kitchenOrderService.create(kitchenOrder);
        saved.setKitchenOrderId(savedKitchenOrder.getId());
        saved = repository.save(saved);

        auditLogService.log("CREATE", "RESTAURANT", saved.getId(), "Created restaurant order #" + saved.getId() + " for table " + saved.getTableNumber());

        return saved;
    }

    public RestaurantOrder update(String id, RestaurantOrder restaurantOrder) {
        normalizeBilling(restaurantOrder);
        validateOrderContext(restaurantOrder);
        restaurantOrder.setId(id);
        restaurantOrder.setItems(billingService.resolveAndPriceItems(restaurantOrder.getItems()));
        restaurantOrder.setTotalAmount(billingService.sumTotal(restaurantOrder.getItems()));

        RestaurantOrder saved = repository.save(restaurantOrder);

        if ("CANCELLED".equalsIgnoreCase(saved.getStatus())) {
            saved.setBillingStatus("CANCELLED");
            if ("ROOM_FOLIO".equalsIgnoreCase(saved.getBillingType()) && saved.getReservationId() != null) {
                billingService.voidSourceCharge(saved.getReservationId(), saved.getId());
            } else if ("DIRECT_PAYMENT".equalsIgnoreCase(saved.getBillingType())) {
                directBillService.voidSource("RESTAURANT_ORDER", saved.getId());
            } else if ("EVENT_MASTER_BILL".equalsIgnoreCase(saved.getBillingType())) {
                billingService.voidEventSource(saved.getEventId(), saved.getId());
            }
        } else if ("ROOM_FOLIO".equalsIgnoreCase(saved.getBillingType())) {
            billingService.postChargeToFolio(saved.getRoomNumber(),
                    "Restaurant order (" + (saved.getItems() == null ? 0 : saved.getItems().size()) + " item(s))",
                    "Restaurant", saved.getTotalAmount(), "RESTAURANT_ORDER", saved.getId(), null);
        } else if ("DIRECT_PAYMENT".equalsIgnoreCase(saved.getBillingType())) {
            directBillService.ensureForSource(saved.getCustomerType(), saved.getGuestName(),
                    "RESTAURANT_ORDER", saved.getId(), "Restaurant order", "Restaurant",
                    saved.getTotalAmount());
        } else if ("EVENT_MASTER_BILL".equalsIgnoreCase(saved.getBillingType())) {
            billingService.postChargeToEvent(saved.getEventId(), "Restaurant order", "Restaurant",
                    saved.getTotalAmount(), "RESTAURANT_ORDER", saved.getId(), null);
            saved.setBillingStatus("EVENT_BILLED");
        }

        // Free up table when order finishes or gets cancelled
        if (("COMPLETED".equalsIgnoreCase(saved.getStatus()) || "CANCELLED".equalsIgnoreCase(saved.getStatus()))
                && saved.getTableNumber() != null && !saved.getTableNumber().isBlank()) {
            restaurantTableRepository.findByTableNumber(saved.getTableNumber()).ifPresent(table -> {
                table.setStatus("CLEANING");
                restaurantTableRepository.save(table);
            });
        }

        auditLogService.log("UPDATE", "RESTAURANT", saved.getId(), "Updated restaurant order #" + saved.getId() + " to " + saved.getStatus());

        return saved;
    }

    private void normalizeBilling(RestaurantOrder order) {
        if (order.getCustomerType() == null || order.getCustomerType().isBlank()) {
            order.setCustomerType(order.getRoomNumber() == null || order.getRoomNumber().isBlank()
                    ? "WALK_IN" : "HOTEL_GUEST");
        }
        if (order.getBillingType() == null || order.getBillingType().isBlank()) {
            order.setBillingType(order.getRoomNumber() == null || order.getRoomNumber().isBlank()
                    ? "DIRECT_PAYMENT" : "ROOM_FOLIO");
        }
        if (order.getBillingStatus() == null || order.getBillingStatus().isBlank()) {
            order.setBillingStatus("UNBILLED");
        }
    }

    private void validateOrderContext(RestaurantOrder order) {
        boolean hasTable = order.getTableNumber() != null && !order.getTableNumber().isBlank();
        boolean hasRoom = order.getRoomNumber() != null && !order.getRoomNumber().isBlank();

        if (!hasTable && !hasRoom) {
            throw new IllegalArgumentException("Select a registered table or an active guest room.");
        }
        if (hasTable) {
            restaurantTableRepository.findByTableNumber(order.getTableNumber())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Table " + order.getTableNumber() + " is not registered."));
        }
        if ("ROOM_FOLIO".equalsIgnoreCase(order.getBillingType()) && !hasRoom) {
            throw new IllegalArgumentException("Room-folio billing requires an active guest room.");
        }
        if ("HOTEL_GUEST".equalsIgnoreCase(order.getCustomerType()) && !hasRoom) {
            throw new IllegalArgumentException("Hotel guest orders require a verified room.");
        }
        if (hasRoom) {
            var activeReservation = reservationRepository.findAllByStatusIgnoreCase("CHECKED_IN").stream()
                    .filter(reservation -> order.getRoomNumber().equalsIgnoreCase(reservation.getRoomNumber()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Room " + order.getRoomNumber() + " has no active checked-in reservation."));
            if (order.getReservationId() == null || order.getReservationId().isBlank()) {
                order.setReservationId(activeReservation.getId());
            }
        }
        if ("EVENT_MASTER_BILL".equalsIgnoreCase(order.getBillingType())) {
            if (order.getEventId() == null || order.getEventId().isBlank()
                    || eventBookingRepository.findById(order.getEventId()).isEmpty()) {
                throw new IllegalArgumentException("Event restaurant billing requires a valid event.");
            }
        }
    }

    public void delete(String id) {
        repository.deleteById(id);
        auditLogService.log("DELETE", "RESTAURANT", id, "Deleted restaurant order #" + id);
    }
}
