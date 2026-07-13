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
    private String userId; // Or generic if not authenticated context
    private String userName;
    private String action; // CREATE, UPDATE, DELETE, PURCHASE
    private String module; // RESERVATION, ROOM, GUEST, INVENTORY, PAYMENT
    private String targetId;
    private String details;
    private long timestamp;
}
