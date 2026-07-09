package com.luxestay.server.repository;

import com.luxestay.server.model.Guest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface GuestRepository extends MongoRepository<Guest, String> {
    @Query("{$or: [{name: {$regex: ?0, $options: 'i'}}, {email: {$regex: ?0, $options: 'i'}}, {phone: {$regex: ?0, $options: 'i'}}]}")
    Page<Guest> searchGuests(String keyword, Pageable pageable);
}
