package com.luxestay.backend.repository;

import com.luxestay.backend.model.GameSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface GameSessionRepository extends MongoRepository<GameSession, String> {
    List<GameSession> findByStatus(String status);
}
