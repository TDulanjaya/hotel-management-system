package com.luxestay.server.service;

import com.luxestay.server.model.KitchenOrder;
import com.luxestay.server.model.OrderLineItem;
import com.luxestay.server.model.Recipe;
import com.luxestay.server.model.RecipeIngredient;
import com.luxestay.server.repository.KitchenOrderRepository;
import com.luxestay.server.repository.RecipeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KitchenOrderService {

    private static final Logger log = LoggerFactory.getLogger(KitchenOrderService.class);

    @Autowired
    private KitchenOrderRepository repository;

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<KitchenOrder> getAll() {
        return repository.findAll();
    }

    public KitchenOrder getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public KitchenOrder create(KitchenOrder kitchenOrder) {
        KitchenOrder saved = repository.save(kitchenOrder);
        messagingTemplate.convertAndSend("/topic/kitchen", "updated");
        auditLogService.log("CREATE", "KITCHEN", saved.getId(), "Created kitchen order #" + saved.getId());
        return saved;
    }

    public KitchenOrder update(String id, KitchenOrder kitchenOrder) {
        KitchenOrder existing = getById(id);
        boolean justServed = existing != null
                && !"SERVED".equalsIgnoreCase(existing.getStatus())
                && "SERVED".equalsIgnoreCase(kitchenOrder.getStatus());

        kitchenOrder.setId(id);
        KitchenOrder saved = repository.save(kitchenOrder);
        messagingTemplate.convertAndSend("/topic/kitchen", "updated");
        auditLogService.log("UPDATE", "KITCHEN", saved.getId(), "Updated kitchen order #" + saved.getId() + " to " + saved.getStatus());

        if (justServed) {
            deductIngredientsForOrder(saved);
        }
        return saved;
    }

    private void deductIngredientsForOrder(KitchenOrder order) {
        if (order.getItems() == null) return;
        for (OrderLineItem line : order.getItems()) {
            if (line.getRecipeId() == null || line.getRecipeId().isBlank()) {
                throw new IllegalStateException("Kitchen item " + line.getName() + " has no recipe reference.");
            }
            Recipe recipe = recipeRepository.findById(line.getRecipeId())
                    .orElseThrow(() -> new IllegalStateException("Recipe not found for " + line.getName()));
            if (recipe.getIngredients() == null || recipe.getIngredients().isEmpty()) {
                throw new IllegalStateException("Recipe " + recipe.getName() + " has no ingredients.");
            }

            for (RecipeIngredient ingredient : recipe.getIngredients()) {
                if (ingredient.getInventoryItemId() == null || ingredient.getInventoryItemId().isBlank()) continue;
                try {
                    inventoryService.deductStock(
                            ingredient.getInventoryItemId(),
                            ingredient.getQuantityPerServing() * line.getQuantity()
                    );
                } catch (Exception e) {
                    log.error("Could not deduct stock for {}: {}", ingredient.getInventoryItemId(), e.getMessage());
                }
            }
        }
    }

    public void delete(String id) {
        repository.deleteById(id);
        messagingTemplate.convertAndSend("/topic/kitchen", "updated");
        auditLogService.log("DELETE", "KITCHEN", id, "Deleted kitchen order #" + id);
    }
}
