package com.luxestay.server.service;

import com.luxestay.server.model.DirectBill;
import com.luxestay.server.model.FolioLine;
import com.luxestay.server.repository.DirectBillRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DirectBillService {
    private final DirectBillRepository repository;

    public DirectBillService(DirectBillRepository repository) {
        this.repository = repository;
    }

    public List<DirectBill> getAll() {
        return repository.findAll();
    }

    public DirectBill getById(String id) {
        return repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Direct bill not found."));
    }

    public DirectBill getBySource(String sourceType, String sourceId) {
        return repository.findBySourceTypeAndSourceId(sourceType, sourceId).orElse(null);
    }

    public DirectBill ensureForSource(String customerType, String guestName, String sourceType,
                                      String sourceId, String description, String category, double amount) {
        DirectBill bill = repository.findBySourceTypeAndSourceId(sourceType, sourceId)
                .orElseGet(DirectBill::new);
        bill.setCustomerType(customerType);
        bill.setGuestName(guestName);
        bill.setSourceType(sourceType);
        bill.setSourceId(sourceId);
        List<FolioLine> lines = bill.getLines() == null ? new ArrayList<>() : bill.getLines();
        FolioLine line = lines.stream()
                .filter(existing -> sourceId.equals(existing.getSourceId())
                        && !"VOID".equalsIgnoreCase(existing.getStatus()))
                .findFirst().orElseGet(() -> {
                    FolioLine created = new FolioLine();
                    created.setSourceType(sourceType);
                    created.setSourceId(sourceId);
                    lines.add(created);
                    return created;
                });
        line.setDescription(description);
        line.setCategory(category);
        line.setAmount(amount);
        line.setStatus("POSTED");
        bill.setLines(lines);
        bill.setTotalAmount(lines.stream()
                .filter(lineItem -> !"VOID".equalsIgnoreCase(lineItem.getStatus()))
                .mapToDouble(FolioLine::getAmount).sum());
        bill.setBalanceAmount(Math.max(0, bill.getTotalAmount() - bill.getPaidAmount()));
        return repository.save(bill);
    }

    public DirectBill save(DirectBill bill) {
        return repository.save(bill);
    }

    public void voidSource(String sourceType, String sourceId) {
        repository.findBySourceTypeAndSourceId(sourceType, sourceId).ifPresent(bill -> {
            if (bill.getLines() != null) {
                bill.getLines().stream()
                        .filter(line -> sourceId.equals(line.getSourceId()))
                        .forEach(line -> line.setStatus("VOID"));
                bill.setTotalAmount(bill.getLines().stream()
                        .filter(line -> !"VOID".equalsIgnoreCase(line.getStatus()))
                        .mapToDouble(FolioLine::getAmount).sum());
                bill.setBalanceAmount(Math.max(0, bill.getTotalAmount() - bill.getPaidAmount()));
                if (bill.getTotalAmount() <= 0 && bill.getPaidAmount() <= 0) {
                    bill.setStatus("VOID");
                }
                repository.save(bill);
            }
        });
    }
}
