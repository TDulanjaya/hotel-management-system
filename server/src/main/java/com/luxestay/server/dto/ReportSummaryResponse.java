package com.luxestay.server.dto;

public class ReportSummaryResponse {

    private String todayRevenue;
    private String netProfit;
    private String occupancyRate;
    private String pendingPayments;
    private String lowStockCount;

    private String eventIncome;
    private String foodSales;
    private String parkingIncome;
    private String inventoryUsage;
    private String auditHistory;
    private boolean netProfitIsEstimate = true;
    private String netProfitNote = "Estimated (assumes 45% margin — operational expense tracking not yet configured)";

    // Constructors
    public ReportSummaryResponse() {}

    public boolean isNetProfitIsEstimate() { return netProfitIsEstimate; }
    public void setNetProfitIsEstimate(boolean netProfitIsEstimate) { this.netProfitIsEstimate = netProfitIsEstimate; }

    public String getNetProfitNote() { return netProfitNote; }
    public void setNetProfitNote(String netProfitNote) { this.netProfitNote = netProfitNote; }

    // Getters and Setters
    public String getTodayRevenue() { return todayRevenue; }
    public void setTodayRevenue(String todayRevenue) { this.todayRevenue = todayRevenue; }

    public String getNetProfit() { return netProfit; }
    public void setNetProfit(String netProfit) { this.netProfit = netProfit; }

    public String getOccupancyRate() { return occupancyRate; }
    public void setOccupancyRate(String occupancyRate) { this.occupancyRate = occupancyRate; }

    public String getPendingPayments() { return pendingPayments; }
    public void setPendingPayments(String pendingPayments) { this.pendingPayments = pendingPayments; }

    public String getLowStockCount() { return lowStockCount; }
    public void setLowStockCount(String lowStockCount) { this.lowStockCount = lowStockCount; }

    public String getEventIncome() { return eventIncome; }
    public void setEventIncome(String eventIncome) { this.eventIncome = eventIncome; }

    public String getFoodSales() { return foodSales; }
    public void setFoodSales(String foodSales) { this.foodSales = foodSales; }

    public String getParkingIncome() { return parkingIncome; }
    public void setParkingIncome(String parkingIncome) { this.parkingIncome = parkingIncome; }

    public String getInventoryUsage() { return inventoryUsage; }
    public void setInventoryUsage(String inventoryUsage) { this.inventoryUsage = inventoryUsage; }

    public String getAuditHistory() { return auditHistory; }
    public void setAuditHistory(String auditHistory) { this.auditHistory = auditHistory; }
}
