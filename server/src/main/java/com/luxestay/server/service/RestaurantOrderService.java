package com.luxestay.server.service;

import com.luxestay.server.model.RestaurantOrder;
import com.luxestay.server.repository.RestaurantOrderRepository;
import com.luxestay.server.repository.RestaurantTableRepository;
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

    public List<RestaurantOrder> getAll() {
        return repository.findAll();
    }

    public RestaurantOrder getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public RestaurantOrder create(RestaurantOrder restaurantOrder) {
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

        billingService.postChargeToFolio(
                saved.getRoomNumber(),
                "Restaurant order (" + (saved.getItems() != null ? saved.getItems().size() : 0) + " item(s), table " + saved.getTableNumber() + ")",
                "Restaurant",
                saved.getTotalAmount()
        );

        auditLogService.log("CREATE", "RESTAURANT", saved.getId(), "Created restaurant order #" + saved.getId() + " for table " + saved.getTableNumber());

        return saved;
    }

    public RestaurantOrder update(String id, RestaurantOrder restaurantOrder) {
        restaurantOrder.setId(id);
        restaurantOrder.setItems(billingService.resolveAndPriceItems(restaurantOrder.getItems()));
        restaurantOrder.setTotalAmount(billingService.sumTotal(restaurantOrder.getItems()));

        RestaurantOrder saved = repository.save(restaurantOrder);

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

    public void delete(String id) {
        repository.deleteById(id);
        auditLogService.log("DELETE", "RESTAURANT", id, "Deleted restaurant order #" + id);
    }
}
