package com.luxestay.server.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "direct_bills")
public class DirectBill {
    @Id private String id;
    private String customerType;
    private String guestName;
    private String sourceType;
    private String sourceId;
    private List<FolioLine> lines = new ArrayList<>();
    private double totalAmount;
    private double paidAmount;
    private double balanceAmount;
    private String status = "OPEN";
}
