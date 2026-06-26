package com.luxestay.backend.service;

import com.luxestay.backend.dto.VenueRequest;
import com.luxestay.backend.model.Venue;
import com.luxestay.backend.repository.VenueRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VenueService {

    private final VenueRepository venueRepository;

    public VenueService(VenueRepository venueRepository) {
        this.venueRepository = venueRepository;
    }



    public List<Venue> getAllVenues() {
        return venueRepository.findAll();
    }

    public Venue getVenueById(String id) {
        return venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found with id: " + id));
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

        return venueRepository.save(venue);
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

        return venueRepository.save(existingVenue);
    }

    public void deleteVenue(String id) {
        if (!venueRepository.existsById(id)) {
            throw new RuntimeException("Venue not found with id: " + id);
        }
        venueRepository.deleteById(id);
    }
}