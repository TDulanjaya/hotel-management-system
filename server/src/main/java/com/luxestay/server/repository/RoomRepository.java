package com.luxestay.server.repository;

import com.luxestay.server.model.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends MongoRepository<Room, String> {
    Page<Room> findByStatusIgnoreCase(String status, Pageable pageable);
    
    @Query("{$or: [{ 'roomNumber': { $regex: ?0, $options: 'i' } }, { 'roomType': { $regex: ?0, $options: 'i' } }, { 'status': { $regex: ?0, $options: 'i' } }]}")
    Page<Room> searchRooms(String keyword, Pageable pageable);
    
    java.util.Optional<Room> findByRoomNumber(String roomNumber);
}
