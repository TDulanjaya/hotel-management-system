package com.luxestay.server.repository;

import com.luxestay.server.model.GameSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface GameSessionRepository extends MongoRepository<GameSession, String> {
    List<GameSession> findByStatus(String status);
}
