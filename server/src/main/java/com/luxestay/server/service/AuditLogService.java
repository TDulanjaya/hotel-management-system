package com.luxestay.server.service;

import com.luxestay.server.model.AuditLog;
import com.luxestay.server.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void log(String action, String module, String targetId, String details) {
        // Here we could extract user details from SecurityContextHolder if auth is fully integrated
        AuditLog auditLog = AuditLog.builder()
                .userId("SYSTEM") // Fallback
                .userName("System User") // Fallback
                .action(action)
                .module(module)
                .targetId(targetId)
                .details(details)
                .timestamp(System.currentTimeMillis())
                .build();
        auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop50ByOrderByTimestampDesc();
    }
}
