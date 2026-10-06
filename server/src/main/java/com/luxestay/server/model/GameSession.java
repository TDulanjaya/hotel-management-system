package com.luxestay.server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "game_sessions")
public class GameSession {
    @Id
    private String id;
    private String guestName;
    private String roomNumber;
    private String customerType;
    private String billingType;
    private String pricingItemId;
    private String reservationId;
    private String eventId;
    private String gameName;       // e.g. "Grand Billiards I"
    private String gameType;       // e.g. "Billiards"
    private String location;       // e.g. "Recreation Floor"
    private String sessionType;    // "Hourly Rental", "Package Session", "Complimentary", "Event Booking"
    private String paymentMethod;  // "Charge to Room", "Cash", "Card", "Complimentary"
    private LocalDateTime startTime;
    private String duration;       // e.g. "1 Hour"
    private double hourlyRate;
    private double totalAmount;
    private String status;         // "ACTIVE", "AVAILABLE", "OVERDUE", "COMPLETED"
    private String notes;
    private boolean equipmentChecked;
    private boolean accessoriesIssued;
    private boolean guestResponsibilityConfirmed;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getGuestName() { return guestName; }
    public void setGuestName(String guestName) { this.guestName = guestName; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public String getCustomerType() { return customerType; }
    public void setCustomerType(String customerType) { this.customerType = customerType; }
    public String getBillingType() { return billingType; }
    public void setBillingType(String billingType) { this.billingType = billingType; }
    public String getPricingItemId() { return pricingItemId; }
    public void setPricingItemId(String pricingItemId) { this.pricingItemId = pricingItemId; }
    public String getReservationId() { return reservationId; }
    public void setReservationId(String reservationId) { this.reservationId = reservationId; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getGameName() { return gameName; }
    public void setGameName(String gameName) { this.gameName = gameName; }
    public String getGameType() { return gameType; }
    public void setGameType(String gameType) { this.gameType = gameType; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getSessionType() { return sessionType; }
    public void setSessionType(String sessionType) { this.sessionType = sessionType; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(double hourlyRate) { this.hourlyRate = hourlyRate; }
    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public boolean isEquipmentChecked() { return equipmentChecked; }
    public void setEquipmentChecked(boolean equipmentChecked) { this.equipmentChecked = equipmentChecked; }
    public boolean isAccessoriesIssued() { return accessoriesIssued; }
    public void setAccessoriesIssued(boolean accessoriesIssued) { this.accessoriesIssued = accessoriesIssued; }
    public boolean isGuestResponsibilityConfirmed() { return guestResponsibilityConfirmed; }
    public void setGuestResponsibilityConfirmed(boolean guestResponsibilityConfirmed) { this.guestResponsibilityConfirmed = guestResponsibilityConfirmed; }
}
