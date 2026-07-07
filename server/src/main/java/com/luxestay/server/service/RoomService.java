package com.luxestay.server.service;

import com.luxestay.server.dto.RoomRequest;
import com.luxestay.server.model.Room;
import com.luxestay.server.repository.RoomRepository;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Service
public class RoomService {
    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public Page<Room> getRooms(String keyword, Pageable pageable) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return roomRepository.searchRooms(keyword, pageable);
        }
        return roomRepository.findAll(pageable);
    }

    public Room getRoomById(String id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
    }

    public Room createRoom(RoomRequest request) {
        Room room = Room.builder()
                .roomNumber(request.getRoomNumber())
                .roomType(request.getRoomType())
                .floor(request.getFloor())
                .capacity(request.getCapacity())
                .pricePerNight(request.getPricePerNight())
                .status(request.getStatus())
                .description(request.getDescription())
                .image(request.getImage())
                .createdAt(System.currentTimeMillis())
                .build();
        return roomRepository.save(room);
    }

    public Room updateRoom(String id, RoomRequest request) {
        Room room = getRoomById(id);
        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType());
        room.setFloor(request.getFloor());
        room.setCapacity(request.getCapacity());
        room.setPricePerNight(request.getPricePerNight());
        room.setStatus(request.getStatus());
        room.setDescription(request.getDescription());
        room.setImage(request.getImage());
        return roomRepository.save(room);
    }

    public void deleteRoom(String id) {
        roomRepository.deleteById(id);
    }
}
