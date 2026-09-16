package com.luxestay.server.service;

import com.luxestay.server.exception.ResourceNotFoundException;
import com.luxestay.server.model.Folio;
import com.luxestay.server.model.FolioLine;
import com.luxestay.server.model.OrderLineItem;
import com.luxestay.server.model.PricingItem;
import com.luxestay.server.model.Reservation;
import com.luxestay.server.repository.FolioRepository;
import com.luxestay.server.repository.PricingItemRepository;
import com.luxestay.server.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

// Handles pricing from catalog and posting charges to room folios
@Service
public class OrderBillingService {

    private final PricingItemRepository pricingItemRepository;
    private final ReservationRepository reservationRepository;
    private final FolioRepository folioRepository;

    public OrderBillingService(PricingItemRepository pricingItemRepository,
                                ReservationRepository reservationRepository,
                                FolioRepository folioRepository) {
        this.pricingItemRepository = pricingItemRepository;
        this.reservationRepository = reservationRepository;
        this.folioRepository = folioRepository;
    }

    // Lookup prices from the catalog
    public List<OrderLineItem> resolveAndPriceItems(List<OrderLineItem> items) {
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("An order must contain at least one item.");
        }
        for (OrderLineItem item : items) {
            if (item.getPricingItemId() == null || item.getPricingItemId().isBlank()) {
                throw new IllegalArgumentException(
                        "Every order line must reference a pricingItemId from the Service Pricing catalog.");
            }
            PricingItem catalogItem = pricingItemRepository.findById(item.getPricingItemId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Pricing item not found: " + item.getPricingItemId()));
            if ("Inactive".equalsIgnoreCase(catalogItem.getStatus())) {
                throw new IllegalArgumentException(
                        "\"" + catalogItem.getName() + "\" is marked Inactive in Service Pricing and can't be ordered.");
            }
            if (item.getQuantity() <= 0) {
                throw new IllegalArgumentException("Quantity must be at least 1 for \"" + catalogItem.getName() + "\".");
            }
            item.setName(catalogItem.getName());
            item.setPrice(catalogItem.getPrice());
        }
        return items;
    }

    // Calculate total order amount
    public double sumTotal(List<OrderLineItem> items) {
        return items.stream().mapToDouble(i -> i.getQuantity() * i.getPrice()).sum();
    }

    // Post charge to active room folio
    public void postChargeToFolio(String roomNumber, String description, String category, double amount) {
        if (roomNumber == null || roomNumber.isBlank() || amount <= 0) {
            return;
        }

        List<Reservation> active = reservationRepository.findAllByStatusIgnoreCase("CHECKED_IN");
        Reservation stay = active.stream()
                .filter(r -> roomNumber.equalsIgnoreCase(r.getRoomNumber()))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException(
                        "No active checked-in stay found for room " + roomNumber
                                + " — charge of Rs " + amount + " could not be posted to a folio."));

        Folio folio = folioRepository.findByReservationId(stay.getId())
                .orElseGet(() -> {
                    Folio newFolio = new Folio();
                    newFolio.setReservationId(stay.getId());
                    newFolio.setGuestName(stay.getGuestName());
                    newFolio.setRoomNumber(stay.getRoomNumber());
                    newFolio.setStatus("OPEN");
                    newFolio.setLines(new ArrayList<>());
                    newFolio.setTotalAmount(0.0);
                    return folioRepository.save(newFolio);
                });

        if (folio.getLines() == null) {
            folio.setLines(new ArrayList<>());
        }

        FolioLine line = new FolioLine();
        line.setDescription(description);
        line.setAmount(amount);
        line.setDate(LocalDate.now().toString());
        line.setCategory(category);

        folio.getLines().add(line);
        folio.setTotalAmount(folio.getLines().stream().mapToDouble(FolioLine::getAmount).sum());
        folioRepository.save(folio);
    }
}
