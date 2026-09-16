package com.luxestay.server.repository;

import com.luxestay.server.model.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationRepository extends MongoRepository<Reservation, String> {
    
    @Query("{$or: [{ 'guestName': { $regex: ?0, $options: 'i' } }, { 'roomNumber': { $regex: ?0, $options: 'i' } }, { 'status': { $regex: ?0, $options: 'i' } }]}")
    Page<Reservation> searchReservations(String keyword, Pageable pageable);
    
    Page<Reservation> findByStatusIgnoreCase(String status, Pageable pageable);
    
    java.util.List<Reservation> findAllByStatusIgnoreCase(String status);

    java.util.List<Reservation> findByRoomNumber(String roomNumber);
}
