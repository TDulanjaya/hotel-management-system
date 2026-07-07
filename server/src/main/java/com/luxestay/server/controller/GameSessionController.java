package com.luxestay.server.controller;

import com.luxestay.server.model.GameSession;
import com.luxestay.server.service.GameSessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameSessionController {
    private final GameSessionService service;
    public GameSessionController(GameSessionService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<List<GameSession>> getAll() { return ResponseEntity.ok(service.getAll()); }

    @GetMapping("/{id}")
    public ResponseEntity<GameSession> getById(@PathVariable String id) { return ResponseEntity.ok(service.getById(id)); }

    @PostMapping
    public ResponseEntity<GameSession> create(@RequestBody GameSession session) { return ResponseEntity.ok(service.create(session)); }

    @PutMapping("/{id}")
    public ResponseEntity<GameSession> update(@PathVariable String id, @RequestBody GameSession session) { return ResponseEntity.ok(service.update(id, session)); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
