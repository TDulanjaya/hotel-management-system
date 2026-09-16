package com.luxestay.server.service;

import com.luxestay.server.dto.ReportSummaryResponse;
import com.luxestay.server.model.*;
import com.luxestay.server.repository.*;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
public class ReportService {

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final InventoryRepository inventoryRepository;
    private final EventBookingRepository eventBookingRepository;
    private final RestaurantOrderRepository restaurantOrderRepository;
    private final ParkingBookingRepository parkingBookingRepository;
    private final AppUserRepository appUserRepository;

    public ReportService(PaymentRepository paymentRepository,
                         ReservationRepository reservationRepository,
                         RoomRepository roomRepository,
                         InventoryRepository inventoryRepository,
                         EventBookingRepository eventBookingRepository,
                         RestaurantOrderRepository restaurantOrderRepository,
                         ParkingBookingRepository parkingBookingRepository,
                         AppUserRepository appUserRepository) {
        this.paymentRepository = paymentRepository;
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
        this.inventoryRepository = inventoryRepository;
        this.eventBookingRepository = eventBookingRepository;
        this.restaurantOrderRepository = restaurantOrderRepository;
        this.parkingBookingRepository = parkingBookingRepository;
        this.appUserRepository = appUserRepository;
    }

    public ReportSummaryResponse getDashboardSummary() {
        ReportSummaryResponse response = new ReportSummaryResponse();
        
        LocalDate today = LocalDate.now();

        // Revenue for today
        List<Payment> payments = paymentRepository.findAll();
        double todayRevenue = 0.0;
        double totalPayments = 0.0;
        for (Payment p : payments) {
            totalPayments += p.getAmount();
            if (p.getPaidAt() != null && p.getPaidAt().toLocalDate().isEqual(today)) {
                todayRevenue += p.getAmount();
            }
        }
        
        // Estimated profit based on margin
        double netProfit = todayRevenue * 0.45;

        // Current room occupancy
        List<Room> rooms = roomRepository.findAll();
        long occupiedRooms = rooms.stream().filter(r -> "OCCUPIED".equalsIgnoreCase(r.getStatus())).count();
        long totalRooms = rooms.size();
        int occupancyRate = totalRooms > 0 ? (int) ((occupiedRooms * 100.0) / totalRooms) : 0;

        // Unpaid reservations
        List<Reservation> reservations = reservationRepository.findAll();
        double pendingPaymentsAmount = 0.0;
        for (Reservation r : reservations) {
            if ("PENDING".equalsIgnoreCase(r.getPaymentStatus())) {
                pendingPaymentsAmount += r.getTotalAmount();
            }
        }

        // Low stock items
        List<InventoryItem> inventoryItems = inventoryRepository.findAll();
        long lowStockCount = inventoryItems.stream()
                .filter(i -> i.getQuantity() != null && i.getReorderLevel() != null && i.getQuantity() <= i.getReorderLevel())
                .count();

        // Service revenues
        List<EventBooking> events = eventBookingRepository.findAll();
        double eventIncome = events.stream()
                .mapToDouble(e -> e.getGrandTotal() != null ? e.getGrandTotal() : 0.0)
                .sum();

        List<RestaurantOrder> orders = restaurantOrderRepository.findAll();
        double foodSales = orders.stream()
                .mapToDouble(RestaurantOrder::getTotalAmount)
                .sum();

        List<ParkingBooking> parkings = parkingBookingRepository.findAll();
        double parkingIncome = parkings.stream()
                .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0)
                .sum();

        long inventoryUsage = inventoryItems.stream()
                .mapToInt(i -> i.getQuantity() != null ? i.getQuantity() : 0)
                .sum();

        long auditHistory = appUserRepository.count();

        NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
        
        response.setTodayRevenue(formatCurrency(todayRevenue));
        response.setNetProfit(formatCurrency(netProfit));
        response.setNetProfitIsEstimate(true);
        response.setNetProfitNote("Estimated (assumes 45% margin — operational expense tracking not yet configured)");
        response.setOccupancyRate(occupancyRate + "%");
        response.setPendingPayments(formatCurrency(pendingPaymentsAmount));
        response.setLowStockCount(String.format("%02d", lowStockCount));
        
        response.setEventIncome(formatCurrency(eventIncome));
        response.setFoodSales(formatCurrency(foodSales));
        response.setParkingIncome(formatCurrency(parkingIncome));
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
