package com.luxestay.server.service;

import com.luxestay.server.exception.ResourceNotFoundException;
import com.luxestay.server.model.EventBill;
import com.luxestay.server.model.Folio;
import com.luxestay.server.model.FolioLine;
import com.luxestay.server.model.OrderLineItem;
import com.luxestay.server.model.PricingItem;
import com.luxestay.server.model.Recipe;
import com.luxestay.server.model.Reservation;
import com.luxestay.server.repository.EventBillRepository;
import com.luxestay.server.repository.FolioRepository;
import com.luxestay.server.repository.PricingItemRepository;
import com.luxestay.server.repository.ReservationRepository;
import com.luxestay.server.repository.RecipeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderBillingService {
    private final PricingItemRepository pricingItemRepository;
    private final ReservationRepository reservationRepository;
    private final FolioRepository folioRepository;
    private final EventBillRepository eventBillRepository;
    private final RecipeRepository recipeRepository;

    public OrderBillingService(PricingItemRepository pricingItemRepository,
                               ReservationRepository reservationRepository,
                               FolioRepository folioRepository,
                               EventBillRepository eventBillRepository,
                               RecipeRepository recipeRepository) {
        this.pricingItemRepository = pricingItemRepository;
        this.reservationRepository = reservationRepository;
        this.folioRepository = folioRepository;
        this.eventBillRepository = eventBillRepository;
        this.recipeRepository = recipeRepository;
    }

    public List<OrderLineItem> resolveAndPriceItems(List<OrderLineItem> items) {
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("An order must contain at least one item.");
        }
        for (OrderLineItem item : items) {
            if (item.getPricingItemId() == null || item.getPricingItemId().isBlank()) {
                throw new IllegalArgumentException("Every order line must reference Service Pricing.");
            }
            PricingItem catalogItem = pricingItemRepository.findById(item.getPricingItemId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Pricing item not found: " + item.getPricingItemId()));
            if ("Inactive".equalsIgnoreCase(catalogItem.getStatus())) {
                throw new IllegalArgumentException(catalogItem.getName() + " is inactive.");
            }
            boolean kitchenItem = Boolean.TRUE.equals(catalogItem.getKitchenRequired())
                    || List.of("RESTAURANT_FOOD", "ROOM_SERVICE_FOOD", "DESSERT")
                    .stream().anyMatch(category -> category.equalsIgnoreCase(catalogItem.getCategory()));
            if (kitchenItem) {
                if (catalogItem.getRecipeId() == null || catalogItem.getRecipeId().isBlank()) {
                    throw new IllegalArgumentException(catalogItem.getName() + " has no configured recipe.");
                }
                Recipe recipe = recipeRepository.findById(catalogItem.getRecipeId())
                        .orElseThrow(() -> new ResourceNotFoundException("Recipe not found for " + catalogItem.getName()));
                if ("INACTIVE".equalsIgnoreCase(recipe.getStatus())
                        || recipe.getIngredients() == null || recipe.getIngredients().isEmpty()) {
                    throw new IllegalArgumentException("Recipe for " + catalogItem.getName() + " is inactive or incomplete.");
                }
                item.setRecipeId(recipe.getId());
            }
            if (item.getQuantity() <= 0) {
                throw new IllegalArgumentException("Quantity must be at least 1 for " + catalogItem.getName());
            }
            item.setName(catalogItem.getName());
            item.setPrice(catalogItem.getPrice());
        }
        return items;
    }

    public double sumTotal(List<OrderLineItem> items) {
        return items.stream().mapToDouble(i -> i.getQuantity() * i.getPrice()).sum();
    }

    public void postChargeToFolio(String roomNumber, String description, String category, double amount) {
        postChargeToFolio(roomNumber, description, category, amount, null, null, null);
    }

    public void postChargeToFolio(String roomNumber, String description, String category, double amount,
                                  String sourceType, String sourceId, String pricingItemId) {
        if (roomNumber == null || roomNumber.isBlank() || amount <= 0) {
            throw new IllegalArgumentException("Room folio billing requires a room and positive amount.");
        }
        Reservation stay = reservationRepository.findAllByStatusIgnoreCase("CHECKED_IN").stream()
                .filter(r -> roomNumber.equalsIgnoreCase(r.getRoomNumber()))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No active checked-in stay found for room " + roomNumber));
        Folio folio = folioRepository.findByReservationId(stay.getId()).orElseGet(() -> {
            Folio created = new Folio();
            created.setReservationId(stay.getId());
            created.setGuestName(stay.getGuestName());
            created.setRoomNumber(stay.getRoomNumber());
            created.setStatus("OPEN");
            created.setLines(new ArrayList<>());
            return created;
        });
        if (!"OPEN".equalsIgnoreCase(folio.getStatus())) {
            throw new IllegalStateException("Folio is closed and cannot receive charges.");
        }
        if (folio.getLines() == null) folio.setLines(new ArrayList<>());
        FolioLine line = findActiveLine(folio.getLines(), sourceId);
        if (line == null) {
            line = new FolioLine();
            folio.getLines().add(line);
        }
        line.setDescription(description);
        line.setAmount(amount);
        line.setDate(LocalDate.now().toString());
        line.setCategory(category);
        line.setSourceType(sourceType);
        line.setSourceId(sourceId);
        line.setPricingItemId(pricingItemId);
        line.setStatus("POSTED");
        recalculateFolio(folio);
        folioRepository.save(folio);
    }

    public void voidSourceCharge(String reservationId, String sourceId) {
        folioRepository.findByReservationId(reservationId).ifPresent(folio -> {
            if (folio.getLines() == null) return;
            folio.getLines().stream()
                    .filter(line -> sourceId != null && sourceId.equals(line.getSourceId()))
                    .forEach(line -> line.setStatus("VOID"));
            recalculateFolio(folio);
            folioRepository.save(folio);
        });
    }

    public Folio getFolioForReservation(String reservationId) {
        return folioRepository.findByReservationId(reservationId)
                .orElseThrow(() -> new IllegalStateException("No folio exists for reservation " + reservationId));
    }

    public void postChargeToEvent(String eventId, String description, String category, double amount,
                                  String sourceType, String sourceId, String pricingItemId) {
        if (eventId == null || eventId.isBlank() || amount <= 0) {
            throw new IllegalArgumentException("Event billing requires an event and positive amount.");
        }
        EventBill bill = eventBillRepository.findByEventId(eventId).orElseGet(() -> {
            EventBill created = new EventBill();
            created.setEventId(eventId);
            return eventBillRepository.save(created);
        });
        if (!"OPEN".equalsIgnoreCase(bill.getStatus())) {
            throw new IllegalStateException("Event bill is closed and cannot receive charges.");
        }
        if (bill.getLines() == null) bill.setLines(new ArrayList<>());
        FolioLine line = findActiveLine(bill.getLines(), sourceId);
        if (line == null) {
            line = new FolioLine();
            bill.getLines().add(line);
        }
        line.setDescription(description);
        line.setCategory(category);
        line.setAmount(amount);
        line.setDate(LocalDate.now().toString());
        line.setSourceType(sourceType);
        line.setSourceId(sourceId);
        line.setPricingItemId(pricingItemId);
        line.setStatus("POSTED");
        bill.setTotalAmount(bill.getLines().stream()
                .filter(item -> !"VOID".equalsIgnoreCase(item.getStatus()))
                .mapToDouble(FolioLine::getAmount).sum());
        bill.setBalanceAmount(Math.max(0, bill.getTotalAmount() - bill.getPaidAmount()));
        eventBillRepository.save(bill);
    }

    public void voidEventSource(String eventId, String sourceId) {
        if (eventId == null || eventId.isBlank()) return;
        eventBillRepository.findByEventId(eventId).ifPresent(bill -> {
            if (bill.getLines() == null) return;
            bill.getLines().stream()
                    .filter(line -> sourceId != null && sourceId.equals(line.getSourceId()))
                    .forEach(line -> line.setStatus("VOID"));
            bill.setTotalAmount(bill.getLines().stream()
                    .filter(line -> !"VOID".equalsIgnoreCase(line.getStatus()))
                    .mapToDouble(FolioLine::getAmount).sum());
            bill.setBalanceAmount(Math.max(0, bill.getTotalAmount() - bill.getPaidAmount()));
            eventBillRepository.save(bill);
        });
    }

    private FolioLine findActiveLine(List<FolioLine> lines, String sourceId) {
        if (sourceId == null) return null;
        return lines.stream()
                .filter(line -> sourceId.equals(line.getSourceId())
                        && !"VOID".equalsIgnoreCase(line.getStatus()))
                .findFirst().orElse(null);
    }

    private void recalculateFolio(Folio folio) {
        folio.setTotalAmount(folio.getLines().stream()
                .filter(line -> !"VOID".equalsIgnoreCase(line.getStatus()))
                .mapToDouble(FolioLine::getAmount).sum());
        folio.setBalanceAmount(Math.max(0, folio.getTotalAmount() - folio.getPaidAmount()));
    }
}
