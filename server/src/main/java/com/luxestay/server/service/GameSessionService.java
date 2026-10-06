package com.luxestay.server.service;

import com.luxestay.server.exception.ResourceNotFoundException;
import com.luxestay.server.model.GameSession;
import com.luxestay.server.model.PricingItem;
import com.luxestay.server.repository.GameSessionRepository;
import com.luxestay.server.repository.PricingItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameSessionService {
    private final GameSessionRepository repo;
    private final PricingItemRepository pricingRepository;
    private final OrderBillingService billingService;
    private final DirectBillService directBillService;

    public GameSessionService(GameSessionRepository repo,
                              PricingItemRepository pricingRepository,
                              OrderBillingService billingService,
                              DirectBillService directBillService) {
        this.repo = repo;
        this.pricingRepository = pricingRepository;
        this.billingService = billingService;
        this.directBillService = directBillService;
    }

    public List<GameSession> getAll() { return repo.findAll(); }

    public GameSession getById(String id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Game session not found with id: " + id));
    }

    public GameSession create(GameSession session) {
        normalize(session);
        PricingItem pricing = resolvePricing(session);
        double hours = durationHours(session.getDuration());
        double total = Math.round(pricing.getPrice() * hours * 100.0) / 100.0;
        session.setHourlyRate(pricing.getPrice());
        session.setTotalAmount(total);
        GameSession saved = repo.save(session);

        if ("ROOM_FOLIO".equalsIgnoreCase(session.getBillingType())) {
            billingService.postChargeToFolio(session.getRoomNumber(),
                    "Game session: " + session.getGameName(), "Games", total,
                    "GAME_SESSION", saved.getId(), pricing.getId());
            session.setStatus("FOLIO_POSTED");
        } else if ("EVENT_MASTER_BILL".equalsIgnoreCase(session.getBillingType())) {
            billingService.postChargeToEvent(session.getEventId(),
                    "Game session: " + session.getGameName(), "Games", total,
                    "GAME_SESSION", saved.getId(), pricing.getId());
            session.setStatus("EVENT_BILLED");
        } else {
            directBillService.ensureForSource(session.getCustomerType(), session.getGuestName(),
                    "GAME_SESSION", saved.getId(), "Game session: " + session.getGameName(),
                    "Games", total);
            session.setStatus(session.getStatus() == null ? "AWAITING_PAYMENT" : session.getStatus());
        }
        return repo.save(session);
    }

    public GameSession update(String id, GameSession updated) {
        GameSession existing = getById(id);
        if ("FOLIO_POSTED".equalsIgnoreCase(existing.getStatus())
                || "EVENT_BILLED".equalsIgnoreCase(existing.getStatus())) {
            throw new IllegalStateException("Billed game sessions must be cancelled through a reversal workflow.");
        }
        updated.setId(id);
        normalize(updated);
        PricingItem pricing = resolvePricing(updated);
        updated.setHourlyRate(pricing.getPrice());
        updated.setTotalAmount(Math.round(pricing.getPrice() * durationHours(updated.getDuration()) * 100.0) / 100.0);
        return repo.save(updated);
    }

    public void delete(String id) {
        GameSession session = getById(id);
        if ("FOLIO_POSTED".equalsIgnoreCase(session.getStatus())
                || "EVENT_BILLED".equalsIgnoreCase(session.getStatus())) {
            throw new IllegalStateException("Billed game sessions cannot be deleted.");
        }
        repo.deleteById(id);
    }

    private void normalize(GameSession session) {
        if (session.getCustomerType() == null || session.getCustomerType().isBlank()) {
            session.setCustomerType(session.getRoomNumber() == null || session.getRoomNumber().isBlank()
                    ? "GAME_VISITOR" : "HOTEL_GUEST");
        }
        if (session.getBillingType() == null || session.getBillingType().isBlank()) {
            session.setBillingType(session.getRoomNumber() == null || session.getRoomNumber().isBlank()
                    ? "DIRECT_PAYMENT" : "ROOM_FOLIO");
        }
        if ("ROOM_FOLIO".equalsIgnoreCase(session.getBillingType())
                && (session.getRoomNumber() == null || session.getRoomNumber().isBlank())) {
            throw new IllegalArgumentException("Room-folio game billing requires a room.");
        }
        if ("EVENT_MASTER_BILL".equalsIgnoreCase(session.getBillingType())
                && (session.getEventId() == null || session.getEventId().isBlank())) {
            throw new IllegalArgumentException("Event billing requires an event.");
        }
    }

    private PricingItem resolvePricing(GameSession session) {
        if (session.getPricingItemId() == null || session.getPricingItemId().isBlank()) {
            throw new IllegalArgumentException("Select an approved game pricing item.");
        }
        PricingItem pricing = pricingRepository.findById(session.getPricingItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Game pricing item not found."));
        if ("Inactive".equalsIgnoreCase(pricing.getStatus())) {
            throw new IllegalArgumentException("Selected game pricing item is inactive.");
        }
        return pricing;
    }

    private double durationHours(String duration) {
        if (duration == null || duration.isBlank()) return 1;
        if (duration.toLowerCase().contains("minute")) {
            return Double.parseDouble(duration.split(" ")[0]) / 60.0;
        }
        if (duration.toLowerCase().contains("day")) return 8;
        try {
            return Math.max(0.5, Double.parseDouble(duration.split(" ")[0]));
        } catch (NumberFormatException ignored) {
            return 1;
        }
    }
}
