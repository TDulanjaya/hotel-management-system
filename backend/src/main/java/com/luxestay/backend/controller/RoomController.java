package com.luxestay.backend.controller;

import com.luxestay.backend.dto.RoomRequest;
import com.luxestay.backend.model.Room;
import com.luxestay.backend.service.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable String id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody RoomRequest request) {
        return new ResponseEntity<>(roomService.createRoom(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable String id, @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.updateRoom(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable String id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}
