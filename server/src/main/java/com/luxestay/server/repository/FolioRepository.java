package com.luxestay.server.repository;

import com.luxestay.server.model.Folio;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FolioRepository extends MongoRepository<Folio, String> {
    java.util.Optional<Folio> findByReservationId(String reservationId);
}
