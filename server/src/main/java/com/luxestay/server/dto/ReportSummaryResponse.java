package com.luxestay.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportSummaryResponse {

    // Numerical Totals
    private Double totalInflow;
    private Double totalOutflow;
    private Double netProfitAmount;
    private Double profitMarginPercent;
    
    // Tender Breakdown (Live Cash Drawer & Batch Settlement)
    private Double cashDrawerAmount;
    private Double cardBatchAmount;
    private Double digitalTransfersAmount;

    // Module Revenues (Raw Numeric)
    private Double roomFolioRevenue;
    private Double restaurantRevenue;
    private Double eventRevenue;
    private Double parkingRevenue;
    private Double gamesRevenue;

    // Department Expenses Breakdown
    private Map<String, Double> departmentExpenses;

    // Display strings
    private String todayRevenue;
    private String todayExpenses;
    private String netProfit;
    private String profitMargin;
    private String occupancyRate;
    private String pendingPayments;
    private String lowStockCount;

    private String eventIncome;
    private String foodSales;
    private String parkingIncome;
    private String gamesIncome;
    private String inventoryUsage;
    private String auditHistory;
    
    @Builder.Default
    private boolean netProfitIsEstimate = false;
    
    @Builder.Default
    private String netProfitNote = "Live Audited Operating Inflow vs Outflow";
}
