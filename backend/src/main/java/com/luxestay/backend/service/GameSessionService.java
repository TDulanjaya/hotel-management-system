package com.luxestay.backend.service;

import com.luxestay.backend.model.GameSession;
import com.luxestay.backend.repository.GameSessionRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GameSessionService {
    private final GameSessionRepository repo;
    public GameSessionService(GameSessionRepository repo) { this.repo = repo; }

    public List<GameSession> getAll() { return repo.findAll(); }
    public GameSession getById(String id) { return repo.findById(id).orElseThrow(); }
    public GameSession create(GameSession session) { return repo.save(session); }
    public GameSession update(String id, GameSession updated) {
        updated.setId(id);
        return repo.save(updated);
    }
    public void delete(String id) { repo.deleteById(id); }
}
