package com.luxestay.server.dto;

import lombok.Data;

@Data
public class PurchaseRequest {
    private Double quantity;
    private Double purchasePrice;
    private Double unitPrice;
    private Double totalExpense;
    private String supplierName;
    private String supplierInvoiceNumber;
    private String paymentMethod;
    private String paymentStatus;
    private String recordedBy;
    private String note;
    private String notes;
}
