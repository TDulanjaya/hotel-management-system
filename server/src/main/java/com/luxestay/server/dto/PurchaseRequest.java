package com.luxestay.server.dto;

import lombok.Data;

@Data
public class PurchaseRequest {
    private Integer quantity;
    private Double purchasePrice;
    private String supplierName;
    private String note;
}
