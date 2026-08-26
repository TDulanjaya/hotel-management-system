package com.luxestay.server.model;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@Document(collection = "audit_logs")
public class AuditLog {
    @Id
    private String id;
    @org.springframework.data.mongodb.core.index.Indexed
    private String userId; // Or generic if not authenticated context
    private String userName;
    @org.springframework.data.mongodb.core.index.Indexed
    private String action; // CREATE, UPDATE, DELETE, PURCHASE
    @org.springframework.data.mongodb.core.index.Indexed
    private String module; // RESERVATION, ROOM, GUEST, INVENTORY, PAYMENT
    private String targetId;
    private String details;
    @org.springframework.data.mongodb.core.index.Indexed
    private long timestamp;
}
