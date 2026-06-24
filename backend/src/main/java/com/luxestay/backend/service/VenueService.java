package com.luxestay.backend.service;

import com.luxestay.backend.dto.VenueRequest;
import com.luxestay.backend.model.Venue;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class VenueService {

    private final Map<String, Venue> venues = new LinkedHashMap<>();

    public VenueService() {
        Venue grandBallroom = Venue.builder()
                .id("VEN-1001")
                .name("Grand Ballroom")
                .type("Banquet Hall")
                .capacity(250)
                .size("5000 sqft")
                .location("Ground Floor")
                .status("Available")
                .price(2500.00)
                .image("")
                .tags(List.of("Wedding", "Corporate", "Luxury"))
                .build();

        Venue rooftop = Venue.builder()
                .id("VEN-1002")
                .name("Rooftop Lounge")
                .type("Rooftop")
                .capacity(80)
                .size("2000 sqft")
                .location("Top Floor")
                .status("Available")
                .price(1200.00)
                .image("")
                .tags(List.of("Party", "Dinner", "Private Event"))
                .build();

        venues.put(grandBallroom.getId(), grandBallroom);
        venues.put(rooftop.getId(), rooftop);
    }

    public List<Venue> getAllVenues() {
        return new ArrayList<>(venues.values());
    }

    public Venue getVenueById(String id) {
        Venue venue = venues.get(id);

        if (venue == null) {
            throw new RuntimeException("Venue not found with id: " + id);
        }

        return venue;
    }

    public Venue createVenue(VenueRequest request) {
        String id = "VEN-" + System.currentTimeMillis();

        Venue venue = Venue.builder()
                .id(id)
                .name(request.getName())
                .type(request.getType())
                .capacity(request.getCapacity())
                .size(request.getSize())
                .location(request.getLocation())
                .status(request.getStatus() != null ? request.getStatus() : "Available")
                .price(request.getPrice())
                .image(request.getImage())
                .tags(request.getTags())
                .build();

        venues.put(id, venue);
        return venue;
    }

    public Venue updateVenue(String id, VenueRequest request) {
        Venue existingVenue = getVenueById(id);

        existingVenue.setName(request.getName());
        existingVenue.setType(request.getType());
        existingVenue.setCapacity(request.getCapacity());
        existingVenue.setSize(request.getSize());
        existingVenue.setLocation(request.getLocation());
        existingVenue.setStatus(request.getStatus());
        existingVenue.setPrice(request.getPrice());
        existingVenue.setImage(request.getImage());
        existingVenue.setTags(request.getTags());

        venues.put(id, existingVenue);
        return existingVenue;
    }

    public void deleteVenue(String id) {
        venues.remove(id);
    }
}