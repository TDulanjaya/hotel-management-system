package com.luxestay.server.model;

import lombok.Data;

@Data
public class FolioLine {
    private String description;
    private double amount;
    private String date;
    private String category;
}
