package com.luxestay.server.service;

import com.luxestay.server.dto.VenueRequest;
import com.luxestay.server.model.Venue;
import com.luxestay.server.repository.VenueRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VenueService {

    private final VenueRepository venueRepository;

    public VenueService(VenueRepository venueRepository) {
        this.venueRepository = venueRepository;
    }

    @Cacheable("venues")
    public List<Venue> getAllVenues() {
        return venueRepository.findAll();
    }

    @Cacheable(value = "venue", key = "#id")
    public Venue getVenueById(String id) {
        return venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found with id: " + id));
    }

    @CacheEvict(value = {"venues", "venue"}, allEntries = true)
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

    @CacheEvict(value = {"venues", "venue"}, allEntries = true)
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

    @CacheEvict(value = {"venues", "venue"}, allEntries = true)
    public void deleteVenue(String id) {
        if (!venueRepository.existsById(id)) {
            throw new RuntimeException("Venue not found with id: " + id);
        }
        venueRepository.deleteById(id);
    }
}