package com.luxestay.server.service;

import com.luxestay.server.model.AuditLog;
import com.luxestay.server.repository.AuditLogRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(String action, String module, String targetId, String details) {
        String userName = "System";
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                userName = auth.getName();
            }
        } catch (Exception ignored) {
        }

        AuditLog auditLog = AuditLog.builder()
                .userId(userName)
                .userName(userName)
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
