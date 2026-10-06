package com.luxestay.server.service;

import com.luxestay.server.dto.ReportSummaryResponse;
import com.luxestay.server.model.*;
import com.luxestay.server.repository.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Service
public class ReportService {

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryPurchaseRepository purchaseRepository;
    private final EventBookingRepository eventBookingRepository;
    private final RestaurantOrderRepository restaurantOrderRepository;
    private final ParkingBookingRepository parkingBookingRepository;
    private final GameSessionRepository gameSessionRepository;
    private final AppUserRepository appUserRepository;

    public ReportService(PaymentRepository paymentRepository,
                         ReservationRepository reservationRepository,
                         RoomRepository roomRepository,
                         InventoryRepository inventoryRepository,
                         InventoryPurchaseRepository purchaseRepository,
                         EventBookingRepository eventBookingRepository,
                         RestaurantOrderRepository restaurantOrderRepository,
                         ParkingBookingRepository parkingBookingRepository,
                         GameSessionRepository gameSessionRepository,
                         AppUserRepository appUserRepository) {
        this.paymentRepository = paymentRepository;
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
        this.inventoryRepository = inventoryRepository;
        this.purchaseRepository = purchaseRepository;
        this.eventBookingRepository = eventBookingRepository;
        this.restaurantOrderRepository = restaurantOrderRepository;
        this.parkingBookingRepository = parkingBookingRepository;
        this.gameSessionRepository = gameSessionRepository;
        this.appUserRepository = appUserRepository;
    }

    public ReportSummaryResponse getDashboardSummary() {
        ReportSummaryResponse response = new ReportSummaryResponse();
        
        LocalDate today = LocalDate.now();

        // 1. Inflows from verified paid payments
        List<Payment> payments = paymentRepository.findAll();
        double todayRevenue = 0.0;
        double totalInflow = 0.0;

        double cashDrawerAmount = 0.0;
        double cardBatchAmount = 0.0;
        double digitalTransfersAmount = 0.0;

        double roomFolioRev = 0.0;
        double restaurantRev = 0.0;
        double eventRev = 0.0;
        double parkingRev = 0.0;
        double gamesRev = 0.0;

        for (Payment p : payments) {
            if ("PAID".equalsIgnoreCase(p.getStatus())) {
                double amt = p.getAmount();
                totalInflow += amt;

                if (p.getPaidAt() != null && p.getPaidAt().toLocalDate().isEqual(today)) {
                    todayRevenue += amt;
                }

                // Tender Breakdown
                String method = p.getMethod() != null ? p.getMethod().toUpperCase() : "CASH";
                if ("CASH".equals(method)) {
                    cashDrawerAmount += amt;
                } else if ("CARD_TERMINAL".equals(method) || "CARD".equals(method)) {
                    cardBatchAmount += amt;
                } else {
                    digitalTransfersAmount += amt;
                }

                // Module Breakdown by referenceType
                String refType = p.getReferenceType() != null ? p.getReferenceType().toUpperCase() : "";
                if ("ROOM_FOLIO".equals(refType) || "RESERVATION".equals(refType) || "CHECKOUT".equals(refType)) {
                    roomFolioRev += amt;
                } else if ("EVENT_BILL".equals(refType) || "EVENT".equals(refType)) {
                    eventRev += amt;
                } else if ("RESTAURANT_ORDER".equals(refType)) {
                    restaurantRev += amt;
                } else if ("PARKING_BOOKING".equals(refType)) {
                    parkingRev += amt;
                } else if ("GAME_SESSION".equals(refType)) {
                    gamesRev += amt;
                } else if ("DIRECT_BILL".equals(refType)) {
                    String notes = p.getNotes() != null ? p.getNotes().toLowerCase() : "";
                    if (notes.contains("dining") || notes.contains("restaurant") || notes.contains("table")) {
                        restaurantRev += amt;
                    } else if (notes.contains("parking")) {
                        parkingRev += amt;
                    } else if (notes.contains("game") || notes.contains("billiards") || notes.contains("playstation")) {
                        gamesRev += amt;
                    } else {
                        restaurantRev += amt;
                    }
                }
            }
        }
        
        // 2. Outflows from verified inventory stock purchases
        List<InventoryPurchase> purchases = purchaseRepository.findAll();
        double todayExpenses = 0.0;
        double totalOutflow = 0.0;
        Map<String, Double> deptExpenses = new LinkedHashMap<>();

        for (InventoryPurchase ip : purchases) {
            double exp = ip.getTotalExpense() != null ? ip.getTotalExpense() : 0.0;
            totalOutflow += exp;

            if (ip.getPurchasedAt() != null) {
                LocalDate pDate = Instant.ofEpochMilli(ip.getPurchasedAt())
                        .atZone(ZoneId.systemDefault()).toLocalDate();
                if (pDate.isEqual(today)) {
                    todayExpenses += exp;
                }
            }

            String category = ip.getCategory() != null && !ip.getCategory().isBlank() ? ip.getCategory() : "General Supplies";
            deptExpenses.put(category, deptExpenses.getOrDefault(category, 0.0) + exp);
        }

        // 3. Real Net Operating Profit
        // When today payments/expenses exist, compute for today; otherwise lifetime
        double baseInflow = todayRevenue > 0 ? todayRevenue : totalInflow;
        double baseOutflow = todayExpenses > 0 ? todayExpenses : totalOutflow;
        double netProfit = baseInflow - baseOutflow;
        double profitMarginPercent = baseInflow > 0 ? ((netProfit / baseInflow) * 100.0) : 0.0;

        // 4. Current room occupancy
        List<Room> rooms = roomRepository.findAll();
        long occupiedRooms = rooms.stream().filter(r -> "OCCUPIED".equalsIgnoreCase(r.getStatus())).count();
        long totalRooms = rooms.size();
        int occupancyRate = totalRooms > 0 ? (int) ((occupiedRooms * 100.0) / totalRooms) : 0;

        // 5. Unpaid reservations
        List<Reservation> reservations = reservationRepository.findAll();
        double pendingPaymentsAmount = 0.0;
        for (Reservation r : reservations) {
            if ("PENDING".equalsIgnoreCase(r.getPaymentStatus())) {
                pendingPaymentsAmount += r.getTotalAmount();
            }
        }

        // 6. Low stock items
        List<InventoryItem> inventoryItems = inventoryRepository.findAll();
        long lowStockCount = inventoryItems.stream()
                .filter(i -> i.getQuantity() != null && i.getReorderLevel() != null && i.getQuantity() <= i.getReorderLevel())
                .count();

        // 7. Fallback module totals from entities if direct payments haven't yet reached ledger
        if (eventRev == 0.0) {
            eventRev = eventBookingRepository.findAll().stream()
                    .mapToDouble(e -> e.getGrandTotal() != null ? e.getGrandTotal() : 0.0)
                    .sum();
        }
        if (restaurantRev == 0.0) {
            restaurantRev = restaurantOrderRepository.findAll().stream()
                    .mapToDouble(RestaurantOrder::getTotalAmount)
                    .sum();
        }
        if (parkingRev == 0.0) {
            parkingRev = parkingBookingRepository.findAll().stream()
                    .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0)
                    .sum();
        }
        if (gamesRev == 0.0) {
            gamesRev = gameSessionRepository.findAll().stream()
                    .mapToDouble(GameSession::getTotalAmount)
                    .sum();
        }

        long inventoryUsage = inventoryItems.stream()
                .mapToInt(i -> i.getQuantity() != null ? i.getQuantity() : 0)
                .sum();

        long auditHistory = appUserRepository.count();
        
        // Populate DTO
        response.setTotalInflow(totalInflow);
        response.setTotalOutflow(totalOutflow);
        response.setNetProfitAmount(netProfit);
        response.setProfitMarginPercent(profitMarginPercent);
        response.setProfitMargin(String.format("%.1f%%", profitMarginPercent));

        response.setCashDrawerAmount(cashDrawerAmount);
        response.setCardBatchAmount(cardBatchAmount);
        response.setDigitalTransfersAmount(digitalTransfersAmount);

        response.setRoomFolioRevenue(roomFolioRev);
        response.setRestaurantRevenue(restaurantRev);
        response.setEventRevenue(eventRev);
        response.setParkingRevenue(parkingRev);
        response.setGamesRevenue(gamesRev);

        response.setDepartmentExpenses(deptExpenses);

        response.setTodayRevenue(formatCurrency(todayRevenue > 0 ? todayRevenue : totalInflow));
        response.setTodayExpenses(formatCurrency(todayExpenses > 0 ? todayExpenses : totalOutflow));
        response.setNetProfit(formatCurrency(netProfit));
        response.setNetProfitIsEstimate(false);
        response.setNetProfitNote(String.format("Live Real Net Operating Profit (Inflow Rs %,.0f - Outflow Rs %,.0f)", baseInflow, baseOutflow));

        response.setOccupancyRate(occupancyRate + "%");
        response.setPendingPayments(formatCurrency(pendingPaymentsAmount));
        response.setLowStockCount(String.format("%02d", lowStockCount));
        
        response.setEventIncome(formatCurrency(eventRev));
        response.setFoodSales(formatCurrency(restaurantRev));
        response.setParkingIncome(formatCurrency(parkingRev));
        response.setGamesIncome(formatCurrency(gamesRev));
        response.setInventoryUsage(String.valueOf(inventoryUsage));
        response.setAuditHistory(String.valueOf(auditHistory));

        return response;
    }

    private String formatCurrency(double amount) {
        return String.format("Rs %,.0f", amount);
    }

    public String generateReportsCSV() {
        ReportSummaryResponse summary = getDashboardSummary();
        StringBuilder csv = new StringBuilder();
        
        csv.append("Report Category,Value\n");
        csv.append("Today Revenue,").append(summary.getTodayRevenue().replace(",", "")).append("\n");
        csv.append("Net Profit,").append(summary.getNetProfit().replace(",", "")).append("\n");
        csv.append("Occupancy Rate,").append(summary.getOccupancyRate()).append("\n");
        csv.append("Pending Payments,").append(summary.getPendingPayments().replace(",", "")).append("\n");
        csv.append("Low Stock Items,").append(summary.getLowStockCount()).append("\n");
        csv.append("Total Event Income,").append(summary.getEventIncome().replace(",", "")).append("\n");
        csv.append("Total Food Sales,").append(summary.getFoodSales().replace(",", "")).append("\n");
        csv.append("Total Parking Income,").append(summary.getParkingIncome().replace(",", "")).append("\n");
        csv.append("Total Inventory Usage,").append(summary.getInventoryUsage()).append("\n");
        csv.append("Audit Logs Count,").append(summary.getAuditHistory()).append("\n");
        
        return csv.toString();
    }
}
